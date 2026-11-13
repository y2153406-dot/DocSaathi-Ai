import os
import base64
import requests
import json
import pymupdf
from dotenv import load_dotenv

load_dotenv('backend/.env')
api_key = os.getenv('GEMINI_API_KEY')
print(f"API Key present: {bool(api_key)}")

pdf_path = r'backend/media/uploads/2026/11/13/bonafide.pdf'
doc = pymupdf.open(pdf_path)
print(f"Pages in {pdf_path}: {len(doc)}")
pix = doc[0].get_pixmap(dpi=120)
img_bytes = pix.tobytes("jpeg")
print(f"Rendered JPEG size: {len(img_bytes)} bytes")
b64 = base64.b64encode(img_bytes).decode('utf-8')

# Test with gemini-2.5-flash or gemini-1.5-flash
models = ["gemini-3.5-flash", "gemini-3.8-flash", "gemini-3.5-flash-lite"]
for model in models:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    payload = {
        "contents": [{
            "parts": [
                {"inlineData": {"mimeType": "image/jpeg", "data": b64}},
                {"text": "Identify this document. Return JSON with keys: title, summary, documentType."}
            ]
        }],
        "generationConfig": {"responseMimeType": "application/json"}
    }
    try:
        resp = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=25)
        print(f"Model {model} -> HTTP {resp.status_code}")
        if resp.status_code == 200:
            print("Response:", resp.json()["candidates"][0]["content"]["parts"][0]["text"][:200])
            break
        else:
            print("Error:", resp.text[:200])
    except Exception as e:
        print(f"Exception on {model}: {e}")
