import os
import requests
import json
import time

API_BASE = "http://127.0.0.1:8000/api"
FRONTEND_BASE = "http://localhost:3000"
SESSION_ID = f"test_session_{int(time.time())}"

headers = {
    "X-Session-ID": SESSION_ID
}

import sys

def log(msg):
    print(msg, flush=True)

log("=" * 70)
log("DOCSAATHI AI — COMPREHENSIVE END-TO-END VERIFICATION SUITE")
log("=" * 70)

# 1. Health check
log("\n[TEST 1] Backend Health Check...")
res = requests.get(f"{API_BASE}/health/", headers=headers)
assert res.status_code == 200, f"Health check failed: {res.text}"
health_data = res.json()
log(f" -> Status: {health_data['status']}, Gemini: {health_data['geminiConfigured']}, Model: {health_data['geminiModel']}")

# 2. Upload Document A (College Notice)
log("\n[TEST 2] Uploading Document A: College Exam Notice (Hindi)...")
with open("test_docs/test_a_college_notice.pdf", "rb") as f:
    res = requests.post(
        f"{API_BASE}/documents/analyze/",
        files={"file": f},
        data={"language": "hi", "category": "college", "session_id": SESSION_ID},
        headers=headers
    )
assert res.status_code == 200, f"Doc A upload failed: {res.text}"
doc_a = res.json()
doc_a_id = doc_a["documentId"]
hash_a = doc_a["fileHash"]
log(f" -> Doc A ID: {doc_a_id}, Hash: {hash_a[:16]}..., Title: {doc_a.get('title')}")
assert "SEMESTER" in doc_a.get("title", "").upper() or "EXAMINATION" in doc_a.get("title", "").upper() or "1,850" in str(doc_a)

# 3. Upload Document B (Bank Statement)
log("\n[TEST 3] Uploading Document B: Bank Statement (English)...")
with open("test_docs/test_b_bank_statement.pdf", "rb") as f:
    res = requests.post(
        f"{API_BASE}/documents/analyze/",
        files={"file": f},
        data={"language": "en", "category": "bank", "session_id": SESSION_ID},
        headers=headers
    )
assert res.status_code == 200, f"Doc B upload failed: {res.text}"
doc_b = res.json()
doc_b_id = doc_b["documentId"]
hash_b = doc_b["fileHash"]
log(f" -> Doc B ID: {doc_b_id}, Hash: {hash_b[:16]}..., Type: {doc_b.get('documentType')}")
assert doc_a_id != doc_b_id, "Document IDs must be unique!"
assert hash_a != hash_b, "File hashes must be unique!"

# 4. Upload Document C (Solar Subsidy Scheme)
log("\n[TEST 4] Uploading Document C: Government Solar Subsidy (Hindi)...")
with open("test_docs/test_c_gov_subsidy.pdf", "rb") as f:
    res = requests.post(
        f"{API_BASE}/documents/analyze/",
        files={"file": f},
        data={"language": "hi", "category": "subsidy", "session_id": SESSION_ID},
        headers=headers
    )
assert res.status_code == 200, f"Doc C upload failed: {res.text}"
doc_c = res.json()
doc_c_id = doc_c["documentId"]
hash_c = doc_c["fileHash"]
log(f" -> Doc C ID: {doc_c_id}, Hash: {hash_c[:16]}..., Title: {doc_c.get('title')}")
assert doc_c_id not in [doc_a_id, doc_b_id]

# 5. List Documents for this Session
log(f"\n[TEST 5] Listing saved documents for session '{SESSION_ID}'...")
res = requests.get(f"{API_BASE}/documents/?session_id={SESSION_ID}", headers=headers)
assert res.status_code == 200
docs_list = res.json()["documents"]
log(f" -> Found {len(docs_list)} documents in database for this session:")
for d in docs_list:
    log(f"    * [{d['documentId']}] {d['title']} ({d['filename']}, {d['completedTasks']}/{d['totalTasks']} tasks)")
doc_ids = [d["documentId"] for d in docs_list]
assert doc_a_id in doc_ids and doc_b_id in doc_ids and doc_c_id in doc_ids

# 6. Verify Complete Document Isolation
log("\n[TEST 6] Verifying Data Isolation between Document A and Document B...")
res_a = requests.get(f"{API_BASE}/documents/{doc_a_id}/", headers=headers).json()
res_b = requests.get(f"{API_BASE}/documents/{doc_b_id}/", headers=headers).json()

# Doc A must NOT have bank account numbers
assert "50100482910382" not in json.dumps(res_a), "Cross-contamination: Doc A contains Doc B's account number!"
# Doc B must NOT have exam fee 1,850
assert "1,850" not in json.dumps(res_b), "Cross-contamination: Doc B contains Doc A's exam fee!"
log(" -> Isolation Verified: Zero data leakage between documents!")

# 7. Action Checklist DB Persistence
log(f"\n[TEST 7] Toggling Action Checklist Item on Document B...")
items_b = res_b["actionChecklist"]
assert len(items_b) > 0, "Doc B has no checklist items"
target_item_b = items_b[0]["id"]
log(f" -> Toggling item '{target_item_b}' from False to True...")
patch_res = requests.patch(
    f"{API_BASE}/documents/{doc_b_id}/checklist/{target_item_b}/",
    json={"is_completed": True},
    headers=headers
)
assert patch_res.status_code == 200
assert patch_res.json()["isCompleted"] == True

# Verify persisted state via GET
res_b_after = requests.get(f"{API_BASE}/documents/{doc_b_id}/", headers=headers).json()
saved_item = next(it for it in res_b_after["actionChecklist"] if it["id"] == target_item_b)
assert saved_item["isCompleted"] == True, "Checklist toggle was not persisted in database!"

# Verify Doc A checklist remains untouched
res_a_after = requests.get(f"{API_BASE}/documents/{doc_a_id}/", headers=headers).json()
for it in res_a_after["actionChecklist"]:
    assert it["isCompleted"] == False, "Doc A checklist should still be False!"
log(" -> Checklist Persistence & Isolation Verified!")

# 8. Grounded Document Q&A DB Persistence
log(f"\n[TEST 8] Asking question on Document B: 'What is the closing balance?'...")
ask_res = requests.post(
    f"{API_BASE}/documents/ask/",
    json={"document_id": doc_b_id, "question": "What is the closing balance?", "language": "en"},
    headers=headers
)
assert ask_res.status_code == 200
qa_data = ask_res.json()
log(f" -> Answer: {qa_data['answer']}")
assert "1,70,000" in qa_data["answer"] or "170000" in qa_data["answer"]

# Verify Q&A appears in Doc B chat history
res_b_qa = requests.get(f"{API_BASE}/documents/{doc_b_id}/", headers=headers).json()
assert len(res_b_qa.get("chatHistory", [])) >= 1, "Chat message not found in Doc B history!"
log(f" -> Verified chat message persisted in Doc B history ({len(res_b_qa['chatHistory'])} messages in DB)")

# Verify Doc A has 0 chat messages
res_a_qa = requests.get(f"{API_BASE}/documents/{doc_a_id}/", headers=headers).json()
assert len(res_a_qa.get("chatHistory", [])) == 0, "Doc A should have 0 chat messages!"
log(" -> Q&A Persistence & Isolation Verified!")

# 9. Document Deletion with Cascade
log(f"\n[TEST 9] Deleting Document C ({doc_c_id})...")
del_res = requests.delete(f"{API_BASE}/documents/{doc_c_id}/", headers=headers)
assert del_res.status_code == 200, f"Delete failed: {del_res.text}"

# Verify Document C is gone (404)
check_c = requests.get(f"{API_BASE}/documents/{doc_c_id}/", headers=headers)
assert check_c.status_code == 404, "Deleted document should return 404!"

# Verify Doc A and Doc B are still intact
check_a = requests.get(f"{API_BASE}/documents/{doc_a_id}/", headers=headers)
check_b = requests.get(f"{API_BASE}/documents/{doc_b_id}/", headers=headers)
assert check_a.status_code == 200 and check_b.status_code == 200, "Remaining documents must not be affected!"
log(" -> Cascading Deletion & Independence Verified!")

# 10. Dynamic Frontend Route Verification
log(f"\n[TEST 10] Verifying dynamic frontend URL restoration for /documents/{doc_a_id}...")
front_res = requests.get(f"{FRONTEND_BASE}/documents/{doc_a_id}")
assert front_res.status_code == 200, f"Frontend route failed: {front_res.status_code}"
log(" -> Next.js App Router dynamic route /documents/[id] responded 200 OK!")

log("\n" + "=" * 70)
log("ALL 10 TESTS PASSED SUCCESSFULLY! DOCSAATHI AI IS PRODUCTION-READY.")
log("=" * 70)
