
from django import forms
from .models import document


class DocumentUploadForm(forms.ModelForm):

    class Meta:
        model = document
        fields = ['image']
