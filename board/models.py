from django.db import models
from user.models import User


class Project(models.Model):
    name = models.CharField(max_length=205)
    user = models.ForeignKey(User, on_delete=models.CASCADE) # user owner

    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    
class Board(models.Model):
    name = models.CharField(max_length=205)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    position = models.IntegerField(null=True, default=0) # item position in the project

    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)



class Item(models.Model):
    name = models.CharField(max_length=205)
    description = models.CharField(max_length=800, blank=True, default='null')
    color = models.CharField(max_length=20, blank=True, default='null')
    board = models.ForeignKey(Board, on_delete=models.CASCADE)
    position = models.IntegerField(null=True, default=0) # item position in the board
    
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
