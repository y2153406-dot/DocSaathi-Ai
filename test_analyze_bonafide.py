import os
import sys
import json
from dotenv import load_dotenv

# Setup django environment
sys.path.insert(0, os.path.abspath('backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
import django
django.setup()

from documents.gemini_service import analyze_document_content

pdf_path = r'backend/media/uploads/2026/11/13/bonafide.pdf'
print(f"Testing analyze_document_content on {pdf_path} with language='pa' (Punjabi)...")

res = analyze_document_content(
    file_path=pdf_path,
    original_filename="bonafide.pdf",
    mime_type="application/pdf",
    language="pa"
)

print("="*60)
print("SUCCESS!")
print(f"Document Type: {res.get('documentType')}")
print(f"Title: {res.get('title')}")
print(f"Model Used: {res.get('modelUsed')}")
print(f"Simple Summary (Punjabi): {res.get('simpleSummary')}")
print(f"Simple Summary (English): {res.get('simpleSummaryEnglish')}")
print(f"Key Points (Punjabi count): {len(res.get('keyPoints', []))}")
print(f"Key Points (English count): {len(res.get('keyPointsEnglish', []))}")
print(f"Action Checklist items: {len(res.get('actionChecklist', []))}")
print(f"Audio Script: {res.get('audioScript')}")
print("="*60)
