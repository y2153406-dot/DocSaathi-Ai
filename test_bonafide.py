import time
import base64
import requests
import fitz

api_key = ''
with open('backend/.env') as f:
    for line in f:
        if line.startswith('GEMINI_API_KEY='):
            api_key = line.split('=', 1)[1].strip()

doc = fitz.open('backend/media/uploads/2026/11/13/bonafide.pdf')
print(f"bonafide.pdf has {len(doc)} page(s)")

parts = []
# Render first page to JPEG
page = doc[0]
pix = page.get_pixmap(dpi=150)
img_bytes = pix.tobytes("jpeg")
b64_img = base64.b64encode(img_bytes).decode('utf-8')

parts.append({
    "inlineData": {
        "mimeType": "image/jpeg",
        "data": b64_img
    }
})
parts.append({
    "text": "Analyze this certificate/document image. Return JSON: {\"title\": \"title of document\", \"summary\": \"summary\"}"
})

url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={api_key}'
payload = {
    'contents': [{'parts': parts}],
    'generationConfig': {
        'responseMimeType': 'application/json'
    }
}

r = requests.post(url, json=payload)
print('Status:', r.status_code)
print('Response:', r.text[:600])
