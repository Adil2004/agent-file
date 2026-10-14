from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class FileManager(models.Model):
    username = models.ForeignKey(User, on_delete=models.CASCADE, related_name="filemanager")
    topic = models.CharField(max_length=100)
    file = models.FileField(upload_to="media/", blank=False, null = False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.topic
