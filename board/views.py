from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse, QueryDict
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.forms.models import model_to_dict
import json

from .models import Project, User, Board, Item

# project
def create_project(request):
    """
    This view creates a kanban project

    Parameters:
        request (HttpRequest) The HttpRequest object that contains information about the request.

    Returns:
        HttpResponse: A simple response in case of fail to create a project
        JsonResponse: A model project converted to dict with the new created project

    Example Usage:
        To create a project, make a POST request to '/project/create'            

    """

    if request.method == 'POST':
        project = Project.objects.create(
            user = request.user,
            name = request.POST.get('projectName'),
        )

        return JsonResponse({'project': model_to_dict(project)})
        
    return HttpResponse('Cant create project', status=500)


# project
def delete_project(request, pk):    
    """
    This view deletes a kanban project
    
    Parameters:
        request (HttpRequest) The HttpRequest object that contains information about the request.
        pk (int) The primary key of the project to be deleted.
            
    Returns:
        HttpResponse: A simple response in case of fail to delete a project
        JsonResponse: A simple response in case of success to delete a project
            
    Example Usage:
        To delete a project, make a DELETE request to '/project/projects/delete/<str:pk>'
            
    """

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
    """
    Get all projects.
    
    Parameters:
        request (HttpRequest) The HttpRequest object that contains information about the request.
            
    Returns:
        HttpResponse: A simple response in case of fail to get projects
        JsonResponse: A list of all projects converted to dict
            
    Example Usage:
        To get all projects, make a POST request to '/project/projects'                

    """

    if request.method == 'POST':
        user_id = request.POST.get('userId')
        if not user_id:
            return HttpResponseBadRequest("Not enough data provided")
            
        user = get_object_or_404(User, pk=user_id)          
        projects = Project.objects.filter(user=user)

        projects_list = []
        for project in projects:
            project_dict = model_to_dict(project)
            boards_list = list(Board.objects.filter(project = project).values())
            
            # eliminates the fields updated and created    
            for board in boards_list:
                board.pop("updated")
                board.pop("created")

                items_list = list(Item.objects.filter(board=board['id']).values())
                
                for item in items_list:                    
                    item.pop("created")
                    item.pop("updated")


                items_list.sort(key=lambda x: x['position'])                

                board['items'] = items_list
        
            boards_list.sort(key=lambda x: x['position'])


            project_dict['boards'] = boards_list
            projects_list.append(project_dict)
            
        

        return JsonResponse({'projects': projects_list})

    return HttpResponse('Can\'t fetch projects', status=500)


# project
def get_project(request, pk):
    """
    Get a project.
    
    Parameters:
        request (HttpRequest) The HttpRequest object that contains information about the request.
        pk (int) The primary key of the project to be fetched.
            
    Returns:
        HttpResponse: A simple response in case of fail to get a project
        JsonResponse: A model project converted to dict
            
    Example Usage:
        To get a project, make a POST request to '/project/projects/<str:pk>'                

    """

    if request.method == 'POST':

        if not pk:
            return HttpResponseBadRequest("Not enough data provided")
        
        project = get_object_or_404(Project, pk=pk)

        return JsonResponse({'project': model_to_dict(project)})

    return HttpResponse('Can\'t fetch projects', status=500)


# board
def create_board(request):
    """
    This view creates a board inside a project

    Parameters:
        request (HttpRequest) The HttpRequest object that contains information about the request.

    Returns:
        HttpResponse: A simple response in case of fail to create a board
        JsonResponse: A model board converted to dict with the new created board

    Example Usage:
        To create a board, make a POST request to '/project/board/create'            

    """
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
    """
    This view deletes a board inside a project

    Parameters:
        request (HttpRequest) The HttpRequest object that contains information about the request.
        pk (int) The primary key of the board to be deleted.

    Returns:
        HttpResponse: A simple response in case of fail to delete a board
        JsonResponse: A simple response with the board id deleted, in case of success to delete a board

    Example Usage:
        To delete a board, make a DELETE request to '/project/board/delete/<str:pk>'

    """

    if request.method == 'DELETE':
        if not pk:
            return HttpResponseBadRequest("Not enough data provided")

        deleted_board = Board.objects.filter(pk=pk).delete()
        # add also the deletion of the items related

        return JsonResponse({'delete_board_id': deleted_board})
    
    return HttpResponse('Can\'t delete the board', status=405)

# board
def update_board(request):
    """
    This view updates a board inside a project

    Parameters:
        request (HttpRequest) The HttpRequest object that contains information about the request.

    Returns:
        HttpResponse: A simple response in case of fail to update a board
        JsonResponse: A simple response with the board id updated, in case of success to update a board

    Example Usage:
        To update a board, make a PUT request to '/project/board/update'            

    with the following JSON data:
        {
            "board_id": "1",
            "board_name": "My new board",
            "board_description": "This is a new board",
            "board_color": "red",
            "board_order": "1"
        }
    
    """


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
    """
    This view creates an item inside a board

    Parameters:
        request (HttpRequest) The HttpRequest object that contains information about the request.

    Returns:
        HttpResponse: A simple response in case of fail to create an item
        JsonResponse: A model item converted to dict with the new created item

    Example Usage:
        To create an item, make a POST request to '/project/item/create'            

    with the following JSON data:
        {            
            "itemName": "My new item"
        }    

    """

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
    """
    This view deletes an item inside a board

    Parameters:
        request (HttpRequest) The HttpRequest object that contains information about the request.
        pk (int) The primary key of the item to be deleted.

    Returns:
        HttpResponse: A simple response in case of fail to delete an item
        JsonResponse: A simple response with the item deleted, in case of success to delete an item

    Example Usage:
        To delete an item, make a DELETE request to '/project/item/delete/<str:pk>'

    """

    if request.method == 'DELETE':
        if not pk:
            return HttpResponseBadRequest('Not enough data provided')

        deleted_item = Item.objects.filter(pk=pk).delete()
        return JsonResponse({'deleted_item_id': deleted_item})

    return HttpResponse('Can\'t delete item', status = 500)


# item 
def update_item(request):
    """
    This view updates an item inside a board

    Parameters:
        request (HttpRequest) The HttpRequest object that contains information about the request.

    Returns:
        HttpResponse: A simple response in case of fail to update an item
        JsonResponse: A simple response with the item id updated, in case of success to update an item

    Example Usage:
        To update an item, make a PUT request to '/project/item/update'            

    with the following JSON data:
        {
            "itemId": "1",
            "data": {
                "name": "My new item",
                "description": "This is a new item",
                "color": "red",                
            }
        }    

    """

    if request.method == 'PUT':

        put = json.loads(request.body)
                
        item_id = put['itemId']
        itemData = put['data']
    

        if not itemData['name'] or not item_id or not itemData:
            return HttpResponseBadRequest("Not enough data provided")

        item = Item.objects.get(id=item_id)
        item.name = itemData['name']
        item.description = itemData['description']
        item.color = itemData['color']
        item.save()

        return JsonResponse({'updated_item_id': item.id})

    return HttpResponse('Can\'t update item', status = 500)


def get_item(request, pk):
    # documentation
    """
    This view gets an item from a board

    Parameters:
        request (HttpRequest) The HttpRequest object that contains information about the request.
        pk (int) The primary key of the item to be deleted.

    Returns:
        HttpResponse: A simple response in case of fail to get an item
        JsonResponse: A model item converted to dict with the new created item

    Example Usage:
        To get an item, make a GET request to '/project/item/get/<str:pk>'

    """
    if request.method == 'GET':
        if not pk:
            return HttpResponseBadRequest("Not enough data provided")

        item = Item.objects.get(id=pk)
        return JsonResponse({'item': model_to_dict(item)})

    return HttpResponse('Can\'t read item', status = 500)



def update_items_position(request):
    """
    This view updates the position of items inside a board

    Parameters:
        request (HttpRequest) The HttpRequest object that contains information about the request.

    Returns:
        HttpResponse: A simple response in case of fail to update items position
        JsonResponse: A simple response with the items position updated, in case of success to update items position

    Example Usage:
        To update items position, make a PUT request to '/project/items/update

    with the following JSON data:
        {
            "actualBoardId": "1",
            "data": [
                {
                    "dbKey": "1",
                    "htmlIndex": "1"
                },
                {
                    "dbKey": "2",
                    "htmlIndex": "2"
                }
            ]
        }    

    Note:
        The data is a list of items with the following format:
        {
            "dbKey": "1",
            "htmlIndex": "1"
        }    

        The dbKey is the primary key of the item in the database.
        The htmlIndex is the position of the item in the html.

    """


    if request.method == 'PUT':

        put = json.loads(request.body)
    
        actual_board = put['actualBoardId']                       
        items_data = put['data']
        

        if not items_data:
            return HttpResponseBadRequest("Not enough data provided")
                
        board = Board.objects.get(id = int(actual_board))
        
        for item in items_data:            
            item_db = Item.objects.get(id = int(item['dbKey']))
            item_db.position = item['htmlIndex']
            item_db.board = board
            item_db.save()
    
        return JsonResponse({'updated_items': items_data})

    return HttpResponse('Can\'t update item', status = 500)



def update_boards_position(request):
    """
    This view updates the position of boards inside a project

    Parameters:
        request (HttpRequest) The HttpRequest object that contains information about the request.

    Returns:
        HttpResponse: A simple response in case of fail to update boards position
        JsonResponse: A simple response with the boards position updated, in case of success to update boards position

    Example Usage:
        To update boards position, make a PUT request to '/project/boards/update

    with the following JSON data:
        {
            "actualProjectId": "1",
            "data": [
                {
                    "dbKey": "1",
                    "htmlIndex": "1"
                },
                {
                    "dbKey": "2",
                    "htmlIndex": "2"
                }
            ]
        }    

    Note:
        The data is a list of boards with the following format:
        {
            "dbKey": "1",
            "htmlIndex": "1"
        }    

        The dbKey is the primary key of the board in the database.
        The htmlIndex is the index of the board in the HTML page.

    """
    
    
    
    if request.method == 'PUT':        

        put = json.loads(request.body)
    
        actual_project = put['actualProjectId']                       
        boards_data = put['data']
        

        if not boards_data:
            return HttpResponseBadRequest("Not enough data provided")
                
        project = Project.objects.get(id = int(actual_project))
        
        for board in boards_data:            
            board_db = Board.objects.get(id = int(board['dbKey']))
            board_db.position = board['htmlIndex']
            board_db.project = project
            board_db.save()
    
        return JsonResponse({'updated_boards': boards_data})

    return HttpResponse('Can\'t update item', status = 500)
