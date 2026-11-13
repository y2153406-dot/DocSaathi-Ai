import os
import uuid
from django.db import models

class Document(models.Model):
    """Primary model for an uploaded or captured document."""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('analyzing', 'Analyzing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    id = models.CharField(max_length=64, primary_key=True)
    session_id = models.CharField(max_length=128, db_index=True, blank=True, default='')
    original_filename = models.CharField(max_length=255)
    file = models.FileField(upload_to='uploads/%Y/%m/%d/', null=True, blank=True)
    file_hash = models.CharField(max_length=64, db_index=True, blank=True, default='')
    file_size = models.BigIntegerField(default=0)
    mime_type = models.CharField(max_length=100, blank=True, default='')
    language = models.CharField(max_length=10, default='en')
    region = models.CharField(max_length=50, blank=True, default='all-india')
    category = models.CharField(max_length=50, blank=True, default='other')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', db_index=True)
    error_message = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Document'
        verbose_name_plural = 'Documents'

    def __str__(self):
        return f"{self.id} - {self.original_filename} ({self.status})"

    def to_analysis_dict(self):
        """Constructs full frontend-compatible analysis dictionary from relational records."""
        if not hasattr(self, 'analysis') or self.analysis is None:
            return {
                "documentId": self.id,
                "originalFilename": self.original_filename,
                "fileHash": self.file_hash,
                "fileSize": self.file_size,
                "language": self.language,
                "region": self.region,
                "category": self.category,
                "status": self.status,
                "errorMessage": self.error_message,
                "createdAt": self.created_at.isoformat()
            }

        an = self.analysis
        # Build checklist from relational ChecklistItem table
        items = self.checklist_items.all().order_by('order', 'created_at')
        checklist_data = []
        for it in items:
            checklist_data.append({
                "id": it.item_key or str(it.id),
                "dbId": str(it.id),
                "task": it.task,
                "taskEnglish": it.task_english,
                "description": it.description,
                "descriptionEnglish": it.description_english,
                "deadline": it.deadline,
                "priority": it.priority,
                "category": it.category,
                "sourceText": it.source_text,
                "isCompleted": it.is_completed,
                "isPersonal": it.is_custom,
            })

        # Build chat history from relational ChatMessage table
        chats = self.chat_messages.all().order_by('created_at')
        chat_data = []
        for c in chats:
            chat_data.append({
                "id": str(c.id),
                "sender": c.sender,
                "question": c.question,
                "answer": c.answer,
                "answerEnglish": c.answer_english,
                "sourceSnippet": c.source_snippet,
                "confidence": c.confidence,
                "isGrounded": c.is_grounded,
                "timestamp": c.created_at.strftime("%I:%M %p")
            })

        return {
            "documentId": self.id,
            "fileHash": self.file_hash,
            "fileSize": self.file_size,
            "originalFilename": self.original_filename,
            "mimeType": self.mime_type,
            "language": self.language,
            "region": self.region,
            "category": self.category,
            "status": self.status,
            "documentType": an.document_type,
            "title": an.title,
            "titleEnglish": an.title_english,
            "simpleSummary": an.simple_summary,
            "simpleSummaryEnglish": an.simple_summary_english,
            "keyPoints": an.key_points or [],
            "keyPointsEnglish": an.key_points_english or [],
            "importantDates": an.important_dates or [],
            "feesAndAmounts": an.fees_and_amounts or [],
            "eligibility": an.eligibility or [],
            "requiredDocuments": an.required_documents or [],
            "missingInformation": an.missing_information or [],
            "cautionNotes": an.caution_notes or [],
            "actionChecklist": checklist_data,
            "audioScript": an.audio_script,
            "confidenceScore": an.confidence_score,
            "modelUsed": an.model_used,
            "chatHistory": chat_data,
            "createdAt": self.created_at.isoformat(),
            "updatedAt": self.updated_at.isoformat()
        }


class DocumentAnalysis(models.Model):
    """Detailed structured analysis extracted for a document."""
    document = models.OneToOneField(Document, on_delete=models.CASCADE, related_name='analysis', primary_key=True)
    document_type = models.CharField(max_length=100, default='Document')
    title = models.CharField(max_length=255, default='')
    title_english = models.CharField(max_length=255, blank=True, default='')
    simple_summary = models.TextField(blank=True, default='')
    simple_summary_english = models.TextField(blank=True, default='')

    # Structured sections
    key_points = models.JSONField(default=list, blank=True)
    key_points_english = models.JSONField(default=list, blank=True)
    important_dates = models.JSONField(default=list, blank=True)
    fees_and_amounts = models.JSONField(default=list, blank=True)
    eligibility = models.JSONField(default=list, blank=True)
    required_documents = models.JSONField(default=list, blank=True)
    missing_information = models.JSONField(default=list, blank=True)
    caution_notes = models.JSONField(default=list, blank=True)

    # Audio script & metadata
    audio_script = models.TextField(blank=True, default='')
    raw_analysis = models.JSONField(default=dict, blank=True)
    model_used = models.CharField(max_length=100, blank=True, default='')
    confidence_score = models.FloatField(default=0.9)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Document Analysis'
        verbose_name_plural = 'Document Analyses'

    def __str__(self):
        return f"Analysis for {self.document.id}: {self.title}"


class ChecklistItem(models.Model):
    """Action checklist item linked to a document."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='checklist_items')
    item_key = models.CharField(max_length=64, blank=True, default='')
    task = models.TextField()
    task_english = models.TextField(blank=True, default='')
    description = models.TextField(blank=True, default='')
    description_english = models.TextField(blank=True, default='')
    deadline = models.CharField(max_length=100, null=True, blank=True)
    priority = models.CharField(max_length=20, default='medium')
    category = models.CharField(max_length=100, blank=True, default='General')
    source_text = models.TextField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    is_custom = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'created_at']
        verbose_name = 'Checklist Item'
        verbose_name_plural = 'Checklist Items'

    def __str__(self):
        status_sym = "[X]" if self.is_completed else "[ ]"
        return f"{status_sym} {self.task[:40]} ({self.document.id})"


class ChatMessage(models.Model):
    """Persisted Q&A message for a document."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='chat_messages')
    sender = models.CharField(max_length=20, default='user')  # 'user' or 'ai'
    question = models.TextField()
    answer = models.TextField(blank=True, default='')
    answer_english = models.TextField(blank=True, default='')
    source_snippet = models.TextField(null=True, blank=True)
    confidence = models.CharField(max_length=20, default='high')
    is_grounded = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
        verbose_name = 'Chat Message'
        verbose_name_plural = 'Chat Messages'

    def __str__(self):
        return f"Q: {self.question[:30]} -> {self.document.id}"
