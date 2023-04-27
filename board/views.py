from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse, QueryDict
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.forms.models import model_to_dict

from .models import Project, User, Board, Item

# project
def create_project(request):
    if request.method == 'POST':
        project = Project.objects.create(
            user = request.user,
            name = request.POST.get('projectName'),
        )

        return JsonResponse({'project': model_to_dict(project)})
        
    return HttpResponse('Cant create project', status=500)


# project
def delete_project(request, pk):

    if request.method == 'DELETE':
        if not pk:  
            return HttpResponseBadRequest('Not enough data provided')
        
        project = Project.objects.get(id=str(pk))
        
        if not project.name.lower() == 'to do list':
            project.delete()                        
            # deleted_project = Project.objects.filter(pk=pk).delete()            
            return JsonResponse({'deleted_project_id': project.id})
            
    return HttpResponse('Can\'t delete project',status=501)



# project
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
            boards_list = list(Board.objects.filter(project=project).values())
            # eliminates the fields updated and created    
            for board in boards_list:
                board.pop("updated")
                board.pop("created")

                items_list = list(Item.objects.filter(board=board['id']).values())
                
                for item in items_list:                    
                    item.pop("created")
                    item.pop("updated")

                board['items'] = items_list
                
            project_dict['boards'] = boards_list
            projects_list.append(project_dict)

        return JsonResponse({'projects': projects_list})

    return HttpResponse('Can\'t fetch projects', status=500)


# project
def get_project(request, pk):
    if request.method == 'POST':
        # project_id = request.POST.get('projectId')
        if not pk:
            return HttpResponseBadRequest("Not enough data provided")
        
        project = get_object_or_404(Project, pk=pk)

        return JsonResponse({'project': model_to_dict(project)})

    return HttpResponse('Can\'t fetch projects', status=500)


# board
def create_board(request):
    if request.method == 'POST':
        
        project = Project.objects.get(id=request.POST.get('projectId'))
        
        board = Board.objects.create(
            project = project,
            name = request.POST.get('boardName'),
        )

        return JsonResponse({'board': model_to_dict(board)})
            
    return HttpResponse('Cant create project', status=500)


# board
def delete_board(request, pk):
    if request.method == 'DELETE':
        if not pk:
            return HttpResponseBadRequest("Not enough data provided")

        deleted_board = Board.objects.filter(pk=pk).delete()
        # add also the deletion of the items related

        return JsonResponse({'delete_board_id': deleted_board})
    
    return HttpResponse('Can\'t delete the board', status=405)

# board
def update_board(request):
    if request.method == 'PUT':
        put = QueryDict(request.body)
        board_id = put.get('boardId')
        new_name = put.get('newName')

        if not board_id or not new_name:
            return HttpResponseBadRequest("Not enough data provided")

        board = Board.objects.get(id=board_id)
        board.name = new_name
        board.save()

        return JsonResponse({'updated_board_id': board.id})
    return HttpResponse('Can\'t update board', status=500)

# item
def create_item(request):
    if request.method == 'POST':
        board = Board.objects.get(id=request.POST.get('boardId'))
        
        item = Item.objects.create(
            board = board,
            name = request.POST.get('itemName'),
        )
        return JsonResponse({'item': model_to_dict(item)})
        
    return HttpResponse('Cant create item', status=500)


# item
def delete_item(request, pk):
    if request.method == 'DELETE':
        if not pk:
            return HttpResponseBadRequest('Not enough data provided')

        deleted_item = Item.objects.filter(pk=pk).delete()
        return JsonResponse({'deleted_item_id': deleted_item})

    return HttpResponse('Can\'t delete item', status = 500)


# item 
def update_item(request):
    if request.method == 'PUT':
        put = QueryDict(request.body)
        
        item_id = put.get('itemId')
        new_name = put.get('newName')

        if not item_id or not new_name:
            return HttpResponseBadRequest("Not enough data provided")

        item = Item.objects.get(id=item_id)
        item.name = new_name
        item.save()

        return JsonResponse({'updated_item_id': item.id})

    return HttpResponse('Can\'t update item', status = 500)


