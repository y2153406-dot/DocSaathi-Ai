import requests
import json
import time

def test_document(file_path, language="hi"):
    print(f"\n=======================================================")
    print(f"TESTING UPLOAD: {file_path} (Language: {language})")
    print(f"=======================================================")
    
    start = time.time()
    with open(file_path, "rb") as f:
        files = {"file": (file_path.split("/")[-1], f, "application/pdf")}
        data = {"language": language, "category": "other"}
        r = requests.post("http://localhost:8000/api/documents/analyze/", files=files, data=data, timeout=60)
    
    elapsed = round(time.time() - start, 2)
    print(f"HTTP Status: {r.status_code} in {elapsed}s")
    
    if r.status_code != 200:
        print("ERROR RESPONSE:", r.text)
        return None
    
    res = r.json()
    print("SUCCESS:", res.get("success"))
    print("DOCUMENT ID:", res.get("documentId"))
    print("ORIGINAL FILENAME:", res.get("originalFilename"))
    print("FILE HASH (SHA-256):", res.get("fileHash"))
    print("FILE SIZE:", res.get("fileSize"), "bytes")
    print("MODEL USED:", res.get("modelUsed"))
    print("DOCUMENT TYPE:", res.get("documentType"))
    print("TITLE:", res.get("title"))
    print("\n--- SIMPLE SUMMARY (NATIVE) ---")
    print(res.get("simpleSummary")[:250] + "..." if len(res.get("simpleSummary", "")) > 250 else res.get("simpleSummary"))
    print("\n--- SIMPLE SUMMARY (ENGLISH) ---")
    print(res.get("simpleSummaryEnglish")[:250] + "..." if len(res.get("simpleSummaryEnglish", "")) > 250 else res.get("simpleSummaryEnglish"))
    print("\n--- IMPORTANT DATES ---")
    for d in res.get("importantDates", []):
        print(f"  • {d.get('title')}: {d.get('date')} ({d.get('urgency')})")
    print("\n--- FEES & AMOUNTS ---")
    for f in res.get("feesAndAmounts", []):
        print(f"  • {f.get('category')}: {f.get('amount')}")
    print("\n--- ACTION CHECKLIST ---")
    for t in res.get("actionChecklist", [])[:3]:
        print(f"  [ ] {t.get('task')} (En: {t.get('taskEnglish')}) - Deadline: {t.get('deadline')}")
    
    return res

if __name__ == "__main__":
    print("STARTING TEST SUITE FOR MULTI-DOCUMENT VERIFICATION...")
    res_a1 = test_document("test_docs/test_a_college_notice.pdf", language="hi")
    res_b = test_document("test_docs/test_b_bank_statement.pdf", language="hi")
    res_c = test_document("test_docs/test_c_gov_subsidy.pdf", language="hi")
    res_a2 = test_document("test_docs/test_a_college_notice.pdf", language="hi")

    print("\n\n=======================================================")
    print("CROSS-DOCUMENT VERIFICATION MATRIX:")
    print("=======================================================")
    print(f"Doc A (First):  Hash={res_a1.get('fileHash')[:12]}... Type='{res_a1.get('documentType')}'")
    print(f"Doc B (Bank):   Hash={res_b.get('fileHash')[:12]}... Type='{res_b.get('documentType')}'")
    print(f"Doc C (Scheme): Hash={res_c.get('fileHash')[:12]}... Type='{res_c.get('documentType')}'")
    print(f"Doc A (Second): Hash={res_a2.get('fileHash')[:12]}... Type='{res_a2.get('documentType')}'")

    # Assertions
    assert res_a1.get('fileHash') != res_b.get('fileHash'), "Hashes for A and B must differ!"
    assert res_b.get('fileHash') != res_c.get('fileHash'), "Hashes for B and C must differ!"
    assert res_a1.get('documentType') != res_b.get('documentType'), "Doc types for A and B must differ!"
    assert res_b.get('documentType') != res_c.get('documentType'), "Doc types for B and C must differ!"
    assert res_a1.get('fileHash') == res_a2.get('fileHash'), "Hashes for repeated A must be identical!"
    print("\nALL MULTI-DOCUMENT IDENTITY & DISCRIMINATION ASSERTIONS PASSED!")
