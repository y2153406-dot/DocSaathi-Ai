import json
import io
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from PIL import Image

class DocumentApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_health_endpoint(self):
        """Test GET /api/health/ returns healthy status."""
        response = self.client.get('/api/health/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data.get("status"), "healthy")
        self.assertEqual(data.get("service"), "DocSaathi AI Backend Service")
        self.assertEqual(data.get("database"), "sqlite3")

    def test_analyze_and_flow(self):
        """Test full document workflow: upload -> analyze -> ask -> get -> delete."""
        # Create a small valid test image in memory
        img = Image.new('RGB', (100, 100), color=(255, 255, 255))
        img_io = io.BytesIO()
        img.save(img_io, format='JPEG')
        img_io.seek(0)
        img_io.name = "test_scholarship_notice.jpg"

        # 1. POST /api/documents/analyze/
        response = self.client.post(
            '/api/documents/analyze/',
            {
                'file': img_io,
                'language': 'hi',
                'category': 'scholarship'
            },
            format='multipart'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data.get("success"))
        doc_id = data.get("documentId")
        self.assertIsNotNone(doc_id)
        self.assertEqual(data.get("language"), "hi")
        self.assertIn("actionChecklist", data)
        self.assertIn("simpleSummary", data)
        self.assertIn("importantDates", data)

        # 2. POST /api/documents/ask/
        ask_response = self.client.post(
            '/api/documents/ask/',
            {
                'document_id': doc_id,
                'question': 'What is the deadline for this scholarship?',
                'language': 'hi'
            },
            format='json'
        )
        self.assertEqual(ask_response.status_code, 200)
        ask_data = ask_response.json()
        self.assertTrue(ask_data.get("success"))
        self.assertIn("answer", ask_data)
        self.assertIn("sourceSnippet", ask_data)

        # 3. GET /api/documents/<document_id>/
        detail_response = self.client.get(f'/api/documents/{doc_id}/')
        self.assertEqual(detail_response.status_code, 200)
        detail_data = detail_response.json()
        self.assertEqual(detail_data.get("documentId"), doc_id)

        # 4. DELETE /api/documents/<document_id>/
        delete_response = self.client.delete(f'/api/documents/{doc_id}/')
        self.assertEqual(delete_response.status_code, 200)
        self.assertTrue(delete_response.json().get("success"))

        # Verify it is deleted
        followup_get = self.client.get(f'/api/documents/{doc_id}/')
        self.assertEqual(followup_get.status_code, 404)
