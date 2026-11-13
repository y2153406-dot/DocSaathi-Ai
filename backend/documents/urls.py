from django.urls import path
from .views import (
    HealthCheckView,
    DocumentAnalyzeView,
    DocumentAskView,
    DocumentDetailView,
    DocumentListView,
    DocumentRetryView,
    ChecklistListView,
    ChecklistItemToggleView,
    DocumentAudioView,
    GenericTTSView,
)

urlpatterns = [
    # Health check
    path('health/', HealthCheckView.as_view(), name='health-check'),
    
    # Document Analysis
    path('documents/analyze/', DocumentAnalyzeView.as_view(), name='documents-analyze'),
    path('analyze/', DocumentAnalyzeView.as_view(), name='analyze-alias'),
    
    # Document Q&A
    path('documents/ask/', DocumentAskView.as_view(), name='documents-ask'),
    path('ask/', DocumentAskView.as_view(), name='ask-alias'),
    
    # Document Audio Synthesis (High-Fidelity Indian Language MP3)
    path('documents/<str:document_id>/audio/', DocumentAudioView.as_view(), name='document-audio'),
    path('tts/', GenericTTSView.as_view(), name='generic-tts'),

    # Document Management & History
    path('documents/', DocumentListView.as_view(), name='documents-list'),
    path('documents/<str:document_id>/', DocumentDetailView.as_view(), name='document-detail'),
    path('documents/<str:document_id>/delete/', DocumentDetailView.as_view(), name='document-delete-alias'),
    path('documents/<str:document_id>/retry/', DocumentRetryView.as_view(), name='document-retry'),

    # Action Checklist Persistence & Manipulation
    path('documents/<str:document_id>/checklist/', ChecklistListView.as_view(), name='document-checklist-list'),
    path('documents/<str:document_id>/checklist/<str:item_id>/', ChecklistItemToggleView.as_view(), name='document-checklist-toggle'),
]
