
import os
import mimetypes

from google import genai
from google.genai import types


def analyze_document(image_path):

    # Initialize Gemini Client
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise ValueError("GEMINI_API_KEY is not configured.")

    client = genai.Client(
        api_key=api_key,
        http_options=types.HttpOptions(timeout=60000)
    )

    # Detect Image MIME Type
    mime_type, _ = mimetypes.guess_type(image_path)

    supported_formats = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ]

    if mime_type not in supported_formats:
        raise ValueError(
            "Unsupported image format. Please upload JPEG, PNG or WEBP."
        )

    # Read Image
    with open(image_path, "rb") as image_file:
        image_bytes = image_file.read()

    if not image_bytes:
        raise ValueError("Uploaded image is empty.")

    # Send Image to Gemini
    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=[
            types.Part.from_bytes(
                data=image_bytes,
                mime_type=mime_type
            ),
            """
            You are DocSaathi AI, an intelligent document
            understanding assistant.

            Analyze the provided document carefully.

            Explain its contents in simple, user-friendly language.

            Extract the following information:

            1. Document Title
            2. Main Purpose
            3. Important Information
            4. Dates and Deadlines
            5. Fees or Charges
            6. Eligibility Requirements
            7. Required Documents
            8. Action Items

            IMPORTANT RULES:

            - Only use information available in the document.
            - Never invent dates, fees, names or requirements.
            - If information is missing, write "Not found".
            - Do not make assumptions about eligibility.
            - If text is blurry or unreadable, mention it clearly.
            - Preserve important dates, amounts and names accurately.
            - Organize the response using Markdown headings,
              bold text and numbered lists.
            - Explain difficult information in simple language.
            """
        ]
    )

    # Return AI Analysis
    if not response.text:
        raise ValueError("Gemini returned an empty response.")

    return response.text
