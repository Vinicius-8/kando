from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse


# Create your views here.
@login_required(login_url='login')
def create_project(request):
    if request.method == 'POST':
        print('--------',request.POST)
    else:
        print('nothing -----------')