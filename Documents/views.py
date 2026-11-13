
from django.shortcuts import render

from .forms import DocumentUploadForm
from .services import analyze_document

import markdown
import bleach

from django.utils.safestring import mark_safe


def upload_document(request):

    analysis_html = None
    error_message = None

    if request.method == 'POST':

        form = DocumentUploadForm(
            request.POST,
            request.FILES
        )

        if form.is_valid():

            uploaded_document = form.save()

            try:
                # Analyze uploaded document using Gemini
                analysis_result = analyze_document(
                    uploaded_document.image.path
                )

                # Convert Markdown into HTML
                converted_html = markdown.markdown(
                    analysis_result,
                    extensions=['extra', 'nl2br']
                )

                # Allow only safe HTML tags
                allowed_tags = bleach.sanitizer.ALLOWED_TAGS.union({
                    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                    'p', 'br', 'hr',
                    'ol', 'ul', 'li',
                    'strong', 'em',
                    'pre', 'code',
                    'blockquote',
                    'table', 'thead', 'tbody',
                    'tr', 'th', 'td'
                })

                # Sanitize generated HTML
                safe_html = bleach.clean(
                    converted_html,
                    tags=allowed_tags,
                    attributes={},
                    strip=True
                )

                # Mark sanitized HTML as safe
                analysis_html = mark_safe(safe_html)

            except Exception:
                # Handle AI analysis failure
                error_message = (
                    "Document analysis failed. "
                    "Please try again after some time."
                )

    else:
        form = DocumentUploadForm()

    return render(
        request,
        'documents/upload.html',
        {
            'form': form,
            'analysis_html': analysis_html,
            'error_message': error_message,
        }
    )
