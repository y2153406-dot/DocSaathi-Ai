import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"
SESSION_ID = "sess-bonafide-test-01"

# 1. Health check
print("1. Health check...")
r = requests.get(f"{BASE_URL}/health/")
print(f"Health: {r.status_code} -> {r.json()}")

# 2. Upload and analyze bonafide.pdf with language 'pa' (Punjabi)
print("\n2. Uploading bonafide.pdf with language='pa'...")
pdf_path = "backend/media/uploads/2026/11/13/bonafide.pdf"
with open(pdf_path, "rb") as f:
    files = {"file": ("bonafide.pdf", f, "application/pdf")}
    data = {
        "language": "pa",
        "category": "education"
    }
    headers = {"X-Session-ID": SESSION_ID}
    resp = requests.post(f"{BASE_URL}/documents/analyze/", files=files, data=data, headers=headers, timeout=60)

print(f"Status Code: {resp.status_code}")
if resp.status_code == 200:
    res = resp.json()
    doc_id = res.get("documentId")
    print(f"Document ID: {doc_id}")
    print(f"Title: {res.get('title')}")
    print(f"Doc Type: {res.get('documentType')}")
    print(f"Simple Summary (Punjabi): {res.get('simpleSummary')[:200]}...")
    print(f"Simple Summary (English): {res.get('simpleSummaryEnglish')[:200]}...")
    print(f"Audio Script: {res.get('audioScript')[:150]}...")
    
    # 3. Test Q&A in Punjabi
    print("\n3. Testing Q&A in Punjabi on this document...")
    qa_payload = {
        "documentId": doc_id,
        "question": "ਕੀ ਇਹ ਸਰਟੀਫਿਕੇਟ ਕਿਸੇ ਸਕਾਲਰਸ਼ਿਪ ਲਈ ਹੈ?",
        "language": "pa"
    }
    qa_resp = requests.post(f"{BASE_URL}/documents/ask/", json=qa_payload, headers=headers, timeout=30)
    print(f"QA Status: {qa_resp.status_code}")
    if qa_resp.status_code == 200:
        qa_data = qa_resp.json()
        print(f"Answer (Punjabi): {qa_data.get('answer')}")
        print(f"Answer (English): {qa_data.get('answerEnglish')}")
    else:
        print(f"QA Error: {qa_resp.text}")

    # 4. Check document history
    print("\n4. Checking Document History...")
    hist_resp = requests.get(f"{BASE_URL}/documents/", headers=headers)
    print(f"History Status: {hist_resp.status_code}, Documents count: {len(hist_resp.json())}")

else:
    print("Upload Error:", resp.text)
