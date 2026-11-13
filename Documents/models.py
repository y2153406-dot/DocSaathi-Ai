from django.db import models

# Create your models here.
class document(models.Model):
    image = models.ImageField(upload_to= 'documents/')
    upload_at= models.DateTimeField(auto_now_add = True)
    def __str__(self):
        return self.image.name