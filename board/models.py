from django.db import models
from user.models import User

# Create your models here.
class Project(models.Model):
    name = models.CharField(max_length=205)
    user = models.ForeignKey(User, on_delete=models.CASCADE) # user owner

    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    

