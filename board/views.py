from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Project


@login_required(login_url='login')
def create_project(request):
    if request.method == 'POST':
        project = Project.objects.create(
            user = request.user,
            name = request.POST.get('projectName'),
        )

        return HttpResponse('Project created', status=201)
        
    

    return HttpResponse('Cant create project', status_code=500)