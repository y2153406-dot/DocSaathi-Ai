import os
from rest_framework import serializers
from .models import Document, DocumentAnalysis, ChecklistItem, ChatMessage

class DocumentUploadSerializer(serializers.Serializer):
    file = serializers.FileField(required=True)
    language = serializers.CharField(max_length=10, default="en", required=False)
    region = serializers.CharField(max_length=50, default="all-india", required=False)
    category = serializers.CharField(max_length=50, default="other", required=False)
    session_id = serializers.CharField(max_length=128, default="", required=False, allow_blank=True)

    def validate_file(self, value):
        max_size = 15 * 1024 * 1024  # 15MB
        if value.size > max_size:
            raise serializers.ValidationError("File size exceeds 15MB limit.")
        
        allowed_mimes = [
            "application/pdf",
            "image/jpeg",
            "image/jpg",
            "image/png"
        ]
        content_type = getattr(value, 'content_type', '')
        if content_type and content_type.lower() not in allowed_mimes:
            ext = value.name.lower().split('.')[-1] if '.' in value.name else ''
            if ext not in ['pdf', 'jpg', 'jpeg', 'png']:
                raise serializers.ValidationError("Unsupported file format. Please upload PDF, JPG, or PNG.")
        return value

class DocumentAskSerializer(serializers.Serializer):
    document_id = serializers.CharField(required=False)
    documentId = serializers.CharField(required=False)
    question = serializers.CharField(required=True, min_length=1)
    language = serializers.CharField(max_length=10, default="en", required=False)

    def validate(self, attrs):
        doc_id = attrs.get('document_id') or attrs.get('documentId')
        if not doc_id:
            raise serializers.ValidationError("Either 'document_id' or 'documentId' must be provided.")
        attrs['document_id'] = doc_id
        return attrs

class ChecklistItemSerializer(serializers.ModelSerializer):
    dbId = serializers.UUIDField(source='id', read_only=True)
    id = serializers.CharField(source='item_key', read_only=True)
    taskEnglish = serializers.CharField(source='task_english', read_only=True)
    descriptionEnglish = serializers.CharField(source='description_english', read_only=True)
    sourceText = serializers.CharField(source='source_text', read_only=True)
    isCompleted = serializers.BooleanField(source='is_completed')
    isPersonal = serializers.BooleanField(source='is_custom', read_only=True)

    class Meta:
        model = ChecklistItem
        fields = [
            'id',
            'dbId',
            'task',
            'taskEnglish',
            'description',
            'descriptionEnglish',
            'deadline',
            'priority',
            'category',
            'sourceText',
            'isCompleted',
            'isPersonal',
            'created_at',
        ]

class ChecklistItemToggleSerializer(serializers.Serializer):
    is_completed = serializers.BooleanField(required=False)
    isCompleted = serializers.BooleanField(required=False)

    def validate(self, attrs):
        if 'isCompleted' in attrs and 'is_completed' not in attrs:
            attrs['is_completed'] = attrs['isCompleted']
        return attrs

class ChecklistItemCreateSerializer(serializers.Serializer):
    task = serializers.CharField(required=True)
    description = serializers.CharField(required=False, default="", allow_blank=True)
    deadline = serializers.CharField(required=False, default=None, allow_null=True)
    priority = serializers.CharField(required=False, default="medium")
    category = serializers.CharField(required=False, default="Personal Task")

class ChatMessageSerializer(serializers.ModelSerializer):
    answerEnglish = serializers.CharField(source='answer_english', read_only=True)
    sourceSnippet = serializers.CharField(source='source_snippet', read_only=True)
    isGrounded = serializers.BooleanField(source='is_grounded', read_only=True)

    class Meta:
        model = ChatMessage
        fields = [
            'id',
            'sender',
            'question',
            'answer',
            'answerEnglish',
            'sourceSnippet',
            'confidence',
            'isGrounded',
            'created_at',
        ]
