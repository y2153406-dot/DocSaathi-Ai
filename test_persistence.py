import requests
import json

API = 'http://127.0.0.1:8000/api'

# 1. Upload Doc A
print("[1] Uploading test_a_college_notice.pdf...")
with open('test_docs/test_a_college_notice.pdf', 'rb') as f:
    r = requests.post(
        f'{API}/documents/analyze/',
        files={'file': f},
        data={'language': 'hi', 'category': 'college'}
    )

if r.status_code != 200:
    print(f"FAILED: {r.status_code} {r.text}")
    exit(1)

doc_a = r.json()
doc_id = doc_a['documentId']
print(f"SUCCESS: Uploaded Doc A: ID={doc_id}")
print(f"Title: {doc_a.get('title')}")
print(f"Checklist items count: {len(doc_a.get('actionChecklist', []))}")

# 2. Toggle first checklist item
item_id = doc_a['actionChecklist'][0]['id']
print(f"\n[2] Toggling checklist item: {item_id} -> True...")
r_patch = requests.patch(
    f'{API}/documents/{doc_id}/checklist/{item_id}/',
    json={'is_completed': True}
)
if r_patch.status_code != 200:
    print(f"FAILED PATCH: {r_patch.text}")
    exit(1)
print(f"SUCCESS: isCompleted={r_patch.json().get('isCompleted')}")

# 3. Ask question
print("\n[3] Asking question: What is the examination fee?...")
r_ask = requests.post(
    f'{API}/documents/ask/',
    json={'document_id': doc_id, 'question': 'What is the examination fee?', 'language': 'en'}
)
if r_ask.status_code != 200:
    print(f"FAILED ASK: {r_ask.text}")
    exit(1)
ask_res = r_ask.json()
print(f"SUCCESS Answer: {ask_res.get('answer')}")

# 4. Fetch detail to verify persistence
print(f"\n[4] Fetching GET /api/documents/{doc_id}/...")
r_get = requests.get(f'{API}/documents/{doc_id}/')
if r_get.status_code != 200:
    print(f"FAILED GET: {r_get.text}")
    exit(1)
doc_detail = r_get.json()
persisted_item = next((it for it in doc_detail['actionChecklist'] if it['id'] == item_id), None)
assert persisted_item is not None, "Checklist item missing from detail"
assert persisted_item['isCompleted'] == True, "isCompleted was not True in detail"
assert len(doc_detail.get('chatHistory', [])) >= 1, "Chat history missing from detail"
print(f"SUCCESS: Checklist item {item_id} isCompleted=True in DB!")
print(f"SUCCESS: Chat history has {len(doc_detail['chatHistory'])} message(s) in DB!")

# 5. List documents
print("\n[5] Fetching GET /api/documents/...")
r_list = requests.get(f'{API}/documents/')
assert r_list.status_code == 200
docs = r_list.json()['documents']
print(f"SUCCESS: Total saved documents: {len(docs)}")
for d in docs:
    print(f" - {d['documentId']}: {d['title']} (tasks: {d['completedTasks']}/{d['totalTasks']})")

print("\nALL PERSISTENCE CHECKS PASSED!")
