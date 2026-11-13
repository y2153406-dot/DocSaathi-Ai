import os
import time
import uuid
import hashlib
import logging
from datetime import datetime
from django.http import HttpResponse
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import Document, DocumentAnalysis, ChecklistItem, ChatMessage
from .serializers import (
    DocumentUploadSerializer,
    DocumentAskSerializer,
    ChecklistItemSerializer,
    ChecklistItemToggleSerializer,
    ChecklistItemCreateSerializer,
)
from .gemini_service import (
    analyze_document_content,
    answer_document_question,
    normalize_mime_type,
    GeminiServiceError
)
from .tts_service import generate_multilingual_audio

logger = logging.getLogger(__name__)

class HealthCheckView(APIView):
    """GET /api/health/ - Checks backend service health and Gemini configuration."""
    def get(self, request):
        api_key = os.getenv("GEMINI_API_KEY", "").strip()
        model_name = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")
        
        return Response({
            "status": "healthy",
            "service": "DocSaathi AI Backend Service",
            "version": "2.0.0",
            "timestamp": datetime.now().isoformat(),
            "geminiConfigured": bool(api_key),
            "geminiModel": model_name,
            "database": "sqlite3",
            "supportedLanguagesCount": 15,
            "features": [
                "Multimodal Document Analysis (Gemini)",
                "Action Checklist DB Persistence",
                "Context-Grounded Document Q&A DB Persistence",
                "Multilingual Support (15 Indian Languages)",
                "Document Audio Briefing Synthesis",
                "Secure Document Deletion & Cascade",
                "Document Re-analysis & Retry Endpoint"
            ]
        }, status=status.HTTP_200_OK)


class DocumentAnalyzeView(APIView):
    """
    POST /api/documents/analyze/ (and /api/analyze/)
    Multipart upload: file, language, region, category, session_id.
    Performs fresh, independent analysis on every uploaded document and saves to DB.
    """
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        start_time = time.time()
        serializer = DocumentUploadSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "Invalid upload parameters.",
                    "details": serializer.errors
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        uploaded_file = serializer.validated_data['file']
        language = serializer.validated_data.get('language', 'en')
        region = serializer.validated_data.get('region', 'all-india')
        category = serializer.validated_data.get('category', 'other')
        session_id = serializer.validated_data.get('session_id') or request.headers.get('X-Session-ID', '')

        document_id = f"doc-{uuid.uuid4().hex[:12]}"
        original_filename = uploaded_file.name
        
        # Read file bytes to compute SHA-256 identity hash and size
        file_bytes = uploaded_file.read()
        uploaded_file.seek(0)
        file_hash = hashlib.sha256(file_bytes).hexdigest()
        file_size = len(file_bytes)

        raw_mime = getattr(uploaded_file, 'content_type', '') or 'application/octet-stream'
        mime_type = normalize_mime_type(original_filename, raw_mime)

        # Create Document instance in database
        doc = Document.objects.create(
            id=document_id,
            session_id=session_id,
            original_filename=original_filename,
            file=uploaded_file,
            file_hash=file_hash,
            file_size=file_size,
            mime_type=mime_type,
            language=language,
            region=region,
            category=category,
            status='analyzing'
        )

        try:
            file_path = doc.file.path
            
            # Run fresh Gemini Multimodal analysis
            analysis_data = analyze_document_content(
                file_path=file_path,
                original_filename=original_filename,
                mime_type=mime_type,
                language=language,
                category=category
            )

            # Persist DocumentAnalysis model
            doc_analysis, _ = DocumentAnalysis.objects.update_or_create(
                document=doc,
                defaults={
                    "document_type": analysis_data.get("documentType", "Document"),
                    "title": analysis_data.get("title", original_filename),
                    "title_english": analysis_data.get("titleEnglish", ""),
                    "simple_summary": analysis_data.get("simpleSummary", ""),
                    "simple_summary_english": analysis_data.get("simpleSummaryEnglish", ""),
                    "key_points": analysis_data.get("keyPoints", []),
                    "key_points_english": analysis_data.get("keyPointsEnglish", []),
                    "important_dates": analysis_data.get("importantDates", []),
                    "fees_and_amounts": analysis_data.get("feesAndAmounts", []),
                    "eligibility": analysis_data.get("eligibility", []),
                    "required_documents": analysis_data.get("requiredDocuments", []),
                    "missing_information": analysis_data.get("missingInformation", []),
                    "caution_notes": analysis_data.get("cautionNotes", []),
                    "audio_script": analysis_data.get("audioScript", ""),
                    "raw_analysis": analysis_data,
                    "model_used": analysis_data.get("modelUsed", "gemini-3.5-flash"),
                    "confidence_score": analysis_data.get("confidenceScore", 0.95),
                }
            )

            # Persist relational ChecklistItem records
            raw_checklist = analysis_data.get("actionChecklist", [])
            for idx, item in enumerate(raw_checklist):
                ChecklistItem.objects.create(
                    document=doc,
                    item_key=item.get("id") or f"task-{idx+1}",
                    task=item.get("task", ""),
                    task_english=item.get("taskEnglish", ""),
                    description=item.get("description", ""),
                    description_english=item.get("descriptionEnglish", ""),
                    deadline=item.get("deadline"),
                    priority=item.get("priority", "medium"),
                    category=item.get("category", "General"),
                    source_text=item.get("sourceText"),
                    is_completed=False,
                    is_custom=False,
                    order=idx
                )

            doc.status = 'completed'
            doc.save(update_fields=['status'])

            elapsed = round(time.time() - start_time, 2)
            logger.info(
                f"[DocSaathi Audit] SUCCESS doc_id={document_id}, file='{original_filename}', "
                f"hash={file_hash[:16]}..., size={file_size}B, time={elapsed}s, "
                f"type='{analysis_data.get('documentType')}'"
            )

            return Response(doc.to_analysis_dict(), status=status.HTTP_200_OK)

        except GeminiServiceError as ge:
            doc.status = 'failed'
            doc.error_message = ge.message
            doc.save(update_fields=['status', 'error_message'])

            elapsed = round(time.time() - start_time, 2)
            logger.error(
                f"[DocSaathi Audit] GEMINI ERROR doc_id={document_id}, file='{original_filename}', "
                f"hash={file_hash[:16]}..., time={elapsed}s, error={ge.message}"
            )
            return Response({
                "success": False,
                "error": {
                    "code": ge.code,
                    "message": ge.message,
                    "details": ge.details
                }
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        except Exception as e:
            doc.status = 'failed'
            doc.error_message = str(e)
            doc.save(update_fields=['status', 'error_message'])

            elapsed = round(time.time() - start_time, 2)
            logger.error(
                f"[DocSaathi Audit] UNEXPECTED ERROR doc_id={document_id}, file='{original_filename}', "
                f"time={elapsed}s: {e}", exc_info=True
            )
            return Response({
                "success": False,
                "error": {
                    "code": "ANALYSIS_FAILED",
                    "message": "AI analysis is temporarily unavailable. Please retry.",
                    "details": str(e)
                }
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DocumentDetailView(APIView):
    """
    GET /api/documents/<document_id>/ - Retrieve analysis for a document.
    DELETE /api/documents/<document_id>/ - Delete document and cascading records.
    """
    def get(self, request, document_id):
        doc = Document.objects.filter(id=document_id).first()
        if not doc:
            return Response({
                "success": False,
                "error": {
                    "code": "DOCUMENT_NOT_FOUND",
                    "message": f"Document with ID '{document_id}' was not found."
                }
            }, status=status.HTTP_404_NOT_FOUND)

        return Response(doc.to_analysis_dict(), status=status.HTTP_200_OK)

    def delete(self, request, document_id):
        doc = Document.objects.filter(id=document_id).first()
        if not doc:
            return Response({
                "success": False,
                "error": {
                    "code": "DOCUMENT_NOT_FOUND",
                    "message": f"Document with ID '{document_id}' was not found."
                }
            }, status=status.HTTP_404_NOT_FOUND)

        # Delete physical file from disk storage
        if doc.file and os.path.exists(doc.file.path):
            try:
                os.remove(doc.file.path)
            except Exception as e:
                logger.warning(f"Failed to delete file {doc.file.path}: {e}")

        doc.delete()

        return Response({
            "success": True,
            "message": f"Document '{document_id}' and all associated records deleted successfully."
        }, status=status.HTTP_200_OK)


class DocumentRetryView(APIView):
    """
    POST /api/documents/<document_id>/retry/
    Re-runs Gemini analysis on an existing uploaded document.
    """
    def post(self, request, document_id):
        doc = Document.objects.filter(id=document_id).first()
        if not doc:
            return Response({
                "success": False,
                "error": {
                    "code": "DOCUMENT_NOT_FOUND",
                    "message": f"Document with ID '{document_id}' was not found."
                }
            }, status=status.HTTP_404_NOT_FOUND)

        if not doc.file or not os.path.exists(doc.file.path):
            return Response({
                "success": False,
                "error": {
                    "code": "FILE_NOT_FOUND",
                    "message": "Physical file is missing from storage. Please upload again."
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            doc.status = 'analyzing'
            doc.save(update_fields=['status'])

            analysis_data = analyze_document_content(
                file_path=doc.file.path,
                original_filename=doc.original_filename,
                mime_type=doc.mime_type,
                language=doc.language,
                category=doc.category
            )

            # Update DocumentAnalysis
            DocumentAnalysis.objects.update_or_create(
                document=doc,
                defaults={
                    "document_type": analysis_data.get("documentType", "Document"),
                    "title": analysis_data.get("title", doc.original_filename),
                    "title_english": analysis_data.get("titleEnglish", ""),
                    "simple_summary": analysis_data.get("simpleSummary", ""),
                    "simple_summary_english": analysis_data.get("simpleSummaryEnglish", ""),
                    "key_points": analysis_data.get("keyPoints", []),
                    "key_points_english": analysis_data.get("keyPointsEnglish", []),
                    "important_dates": analysis_data.get("importantDates", []),
                    "fees_and_amounts": analysis_data.get("feesAndAmounts", []),
                    "eligibility": analysis_data.get("eligibility", []),
                    "required_documents": analysis_data.get("requiredDocuments", []),
                    "missing_information": analysis_data.get("missingInformation", []),
                    "caution_notes": analysis_data.get("cautionNotes", []),
                    "audio_script": analysis_data.get("audioScript", ""),
                    "raw_analysis": analysis_data,
                    "model_used": analysis_data.get("modelUsed", "gemini-3.5-flash"),
                    "confidence_score": analysis_data.get("confidenceScore", 0.95),
                }
            )

            # Re-create checklist items
            doc.checklist_items.filter(is_custom=False).delete()
            raw_checklist = analysis_data.get("actionChecklist", [])
            for idx, item in enumerate(raw_checklist):
                ChecklistItem.objects.create(
                    document=doc,
                    item_key=item.get("id") or f"task-{idx+1}",
                    task=item.get("task", ""),
                    task_english=item.get("taskEnglish", ""),
                    description=item.get("description", ""),
                    description_english=item.get("descriptionEnglish", ""),
                    deadline=item.get("deadline"),
                    priority=item.get("priority", "medium"),
                    category=item.get("category", "General"),
                    source_text=item.get("sourceText"),
                    is_completed=False,
                    is_custom=False,
                    order=idx
                )

            doc.status = 'completed'
            doc.error_message = ''
            doc.save(update_fields=['status', 'error_message'])

            return Response(doc.to_analysis_dict(), status=status.HTTP_200_OK)

        except GeminiServiceError as ge:
            doc.status = 'failed'
            doc.error_message = ge.message
            doc.save(update_fields=['status', 'error_message'])
            return Response({
                "success": False,
                "error": {
                    "code": ge.code,
                    "message": ge.message,
                    "details": ge.details
                }
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            doc.status = 'failed'
            doc.error_message = str(e)
            doc.save(update_fields=['status', 'error_message'])
            return Response({
                "success": False,
                "error": {
                    "code": "RETRY_FAILED",
                    "message": "Retry failed.",
                    "details": str(e)
                }
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DocumentListView(APIView):
    """
    GET /api/documents/ - Lists saved documents.
    Optional query parameter or header: session_id or X-Session-ID.
    """
    def get(self, request):
        session_id = request.query_params.get('session_id') or request.headers.get('X-Session-ID')
        
        query = Document.objects.all()
        if session_id:
            query = query.filter(session_id=session_id)
        
        docs = query[:50]
        results = []
        for d in docs:
            has_an = hasattr(d, 'analysis') and d.analysis is not None
            title = d.analysis.title if has_an else d.original_filename
            doc_type = d.analysis.document_type if has_an else "Document"
            
            total_tasks = d.checklist_items.count()
            completed_tasks = d.checklist_items.filter(is_completed=True).count()

            results.append({
                "documentId": d.id,
                "filename": d.original_filename,
                "fileHash": d.file_hash,
                "fileSize": d.file_size,
                "language": d.language,
                "region": d.region,
                "category": d.category,
                "status": d.status,
                "title": title,
                "documentType": doc_type,
                "totalTasks": total_tasks,
                "completedTasks": completed_tasks,
                "createdAt": d.created_at.isoformat(),
            })

        return Response({"success": True, "documents": results}, status=status.HTTP_200_OK)


class DocumentAskView(APIView):
    """
    POST /api/documents/ask/ (and /api/ask/)
    JSON body: { document_id, question, language }
    Answers document questions and persists ChatMessage in database.
    """
    parser_classes = [JSONParser]

    def post(self, request, *args, **kwargs):
        serializer = DocumentAskSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({
                "success": False,
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "Invalid question parameters.",
                    "details": serializer.errors
                }
            }, status=status.HTTP_400_BAD_REQUEST)

        document_id = serializer.validated_data['document_id']
        question = serializer.validated_data['question']
        language = serializer.validated_data.get('language', 'en')

        # Lookup document in database
        doc = Document.objects.filter(id=document_id).first()
        document_context = doc.to_analysis_dict() if doc else {}

        # Answer question grounded in document context
        answer_data = answer_document_question(
            document_context=document_context,
            question=question,
            language=language
        )

        answer_text = answer_data.get("answer", "No answer found in document.")
        answer_eng = answer_data.get("answerEnglish", "")
        source_snip = answer_data.get("sourceSnippet")
        confidence = answer_data.get("confidence", "high")
        is_grounded = answer_data.get("isGrounded", True)

        # Persist ChatMessage in DB if doc exists
        msg_id = str(uuid.uuid4())
        if doc:
            chat_record = ChatMessage.objects.create(
                document=doc,
                sender='user',
                question=question,
                answer=answer_text,
                answer_english=answer_eng,
                source_snippet=source_snip,
                confidence=confidence,
                is_grounded=is_grounded
            )
            msg_id = str(chat_record.id)

        response_payload = {
            "success": True,
            "id": msg_id,
            "documentId": document_id,
            "question": question,
            "answer": answer_text,
            "answerEnglish": answer_eng,
            "sourceSnippet": source_snip,
            "confidence": confidence,
            "isGrounded": is_grounded,
            "timestamp": datetime.now().strftime("%I:%M %p")
        }

        return Response(response_payload, status=status.HTTP_200_OK)


class ChecklistListView(APIView):
    """
    GET /api/documents/<document_id>/checklist/ - List items.
    POST /api/documents/<document_id>/checklist/ - Add custom item.
    """
    parser_classes = [JSONParser]

    def get(self, request, document_id):
        doc = Document.objects.filter(id=document_id).first()
        if not doc:
            return Response({"success": False, "error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)
        
        items = doc.checklist_items.all()
        serializer = ChecklistItemSerializer(items, many=True)
        return Response({"success": True, "checklist": serializer.data}, status=status.HTTP_200_OK)

    def post(self, request, document_id):
        doc = Document.objects.filter(id=document_id).first()
        if not doc:
            return Response({"success": False, "error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ChecklistItemCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"success": False, "error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        item = ChecklistItem.objects.create(
            document=doc,
            item_key=f"custom-{uuid.uuid4().hex[:8]}",
            task=data['task'],
            task_english=data.get('taskEnglish', data['task']),
            description=data.get('description', ''),
            deadline=data.get('deadline'),
            priority=data.get('priority', 'medium'),
            category=data.get('category', 'Personal Task'),
            is_completed=False,
            is_custom=True,
            order=doc.checklist_items.count()
        )

        return Response({"success": True, "item": ChecklistItemSerializer(item).data}, status=status.HTTP_201_CREATED)


class ChecklistItemToggleView(APIView):
    """
    PATCH /api/documents/<document_id>/checklist/<item_id>/
    Toggles or updates the completion status of a checklist item.
    """
    parser_classes = [JSONParser]

    def patch(self, request, document_id, item_id):
        doc = Document.objects.filter(id=document_id).first()
        if not doc:
            return Response({
                "success": False,
                "error": {
                    "code": "DOCUMENT_NOT_FOUND",
                    "message": f"Document '{document_id}' not found."
                }
            }, status=status.HTTP_404_NOT_FOUND)

        # Match either by item_key or by primary key UUID
        item = doc.checklist_items.filter(item_key=item_id).first()
        if not item:
            try:
                item = doc.checklist_items.filter(id=item_id).first()
            except Exception:
                pass

        if not item:
            return Response({
                "success": False,
                "error": {
                    "code": "ITEM_NOT_FOUND",
                    "message": f"Checklist item '{item_id}' not found for document '{document_id}'."
                }
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = ChecklistItemToggleSerializer(data=request.data)
        if serializer.is_valid() and 'is_completed' in serializer.validated_data:
            item.is_completed = serializer.validated_data['is_completed']
        else:
            # Toggle if not explicitly specified
            item.is_completed = not item.is_completed

        item.save(update_fields=['is_completed'])

        return Response({
            "success": True,
            "documentId": document_id,
            "itemId": item.item_key or str(item.id),
            "isCompleted": item.is_completed,
            "item": ChecklistItemSerializer(item).data
        }, status=status.HTTP_200_OK)


class DocumentAudioView(APIView):
    """
    GET /api/documents/<document_id>/audio/
    Streams high-fidelity, authentic native language MP3 audio of the document's audioScript.
    """
    def get(self, request, document_id):
        doc = Document.objects.filter(id=document_id).first()
        if not doc:
            return Response({
                "success": False,
                "error": {"code": "DOCUMENT_NOT_FOUND", "message": f"Document '{document_id}' not found."}
            }, status=status.HTTP_404_NOT_FOUND)

        analysis = getattr(doc, 'analysis', None)
        if not analysis:
            return Response({
                "success": False,
                "error": {"code": "ANALYSIS_NOT_FOUND", "message": "Document has not been analyzed yet."}
            }, status=status.HTTP_400_BAD_REQUEST)

        # Get audio text: either audio_script or simple_summary
        script = analysis.audio_script
        if not script or len(script.strip()) < 10:
            script = f"{analysis.title}. {analysis.simple_summary}"

        # Generate or load cached audio
        try:
            audio_bytes = generate_multilingual_audio(script, doc.language)
            if not audio_bytes:
                return Response({
                    "success": False,
                    "error": {"code": "TTS_FAILED", "message": "Failed to synthesize speech audio."}
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            response = HttpResponse(audio_bytes, content_type="audio/mpeg")
            response["Content-Length"] = len(audio_bytes)
            response["Accept-Ranges"] = "bytes"
            response["Content-Disposition"] = f'inline; filename="docsaathi_{document_id}_{doc.language}.mp3"'
            response["Cache-Control"] = "public, max-age=86400"
            return response
        except Exception as e:
            logger.error(f"[DocSaathi AudioView] Failed to generate audio for {document_id}: {e}")
            return Response({
                "success": False,
                "error": {"code": "TTS_ERROR", "message": str(e)}
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GenericTTSView(APIView):
    """
    POST /api/tts/ or GET /api/tts/
    Synthesizes arbitrary text into native Indian language MP3 audio stream.
    """
    parser_classes = [JSONParser, FormParser]

    def post(self, request):
        text = request.data.get("text", "").strip()
        language = request.data.get("language", "en").strip()
        if not text:
            return Response({"error": "text is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            audio_bytes = generate_multilingual_audio(text, language)
            response = HttpResponse(audio_bytes, content_type="audio/mpeg")
            response["Content-Length"] = len(audio_bytes)
            response["Accept-Ranges"] = "bytes"
            response["Content-Disposition"] = 'inline; filename="speech.mp3"'
            return response
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request):
        text = request.query_params.get("text", "").strip()
        language = request.query_params.get("language", "en").strip()
        if not text:
            return Response({"error": "text parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            audio_bytes = generate_multilingual_audio(text, language)
            response = HttpResponse(audio_bytes, content_type="audio/mpeg")
            response["Content-Length"] = len(audio_bytes)
            response["Accept-Ranges"] = "bytes"
            response["Content-Disposition"] = 'inline; filename="speech.mp3"'
            return response
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
