from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.forms.models import model_to_dict

from .models import Project, User, Board



@login_required(login_url='login')
def create_project(request):
    if request.method == 'POST':
        project = Project.objects.create(
            user = request.user,
            name = request.POST.get('projectName'),
        )

        return JsonResponse({'project': model_to_dict(project)})
        
    

    return HttpResponse('Cant create project', status_code=500)



@login_required(login_url='login')
def get_projects(request):
    if request.method == 'POST':
        user_id = request.POST.get('userId')
        if not user_id:
            return HttpResponseBadRequest("Not enough data provided")
            
        user = get_object_or_404(User, pk=user_id)          
        projects = Project.objects.filter(user=user)

        projects_list = []
        for project in projects:
            project_dict = model_to_dict(project)
            projects_list.append(project_dict)

        return JsonResponse({'projects': projects_list})

    return HttpResponse('Can\'t fetch projects', status_code=500)


@login_required(login_url='login')
def get_project(request, pk):
    if request.method == 'POST':
        # project_id = request.POST.get('projectId')
        if not pk:
            return HttpResponseBadRequest("Not enough data provided")
        
        project = get_object_or_404(Project, pk=pk)

        return JsonResponse({'project': model_to_dict(project)})

    return HttpResponse('Can\'t fetch projects', status_code=500)


def create_board(request):
    if request.method == 'POST':
        
        project = Project.objects.get(id=request.POST.get('projectId'))
        
        board = Board.objects.create(
            project = project,
            name = request.POST.get('boardName'),
        )

        return JsonResponse({'board': model_to_dict(board)})
            

    return HttpResponse('Cant create project', status_code=500)
