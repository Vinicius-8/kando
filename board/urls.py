from django.urls import path
from . import views

urlpatterns = [
    
    # project
    path('create', views.create_project, name='create-project'),
    path('projects', views.get_projects, name='get-projects'),
    path('projects/<str:pk>', views.get_project, name='get-project'),
    path('projects/delete/<str:pk>', views.delete_project, name='delete-project'),

    # board
    path('board/create', views.create_board, name='create-board'),
    path('board/delete/<str:pk>', views.delete_board, name='delete-board'),
    path('board/update', views.update_board, name='update-board'),
    path('boards/update', views.update_boards_position, name='update-boards'), # update the boards position in the canvas

    # item
    path('item/create', views.create_item, name='create-item'),
    path('item/delete/<str:pk>', views.delete_item, name='delete-item'),
    path('item/update', views.update_item, name='update-item'),
    path('item/<str:pk>', views.get_item, name='get-item'),
    path('items/update', views.update_items_position, name='update-items'), # update the items position in the canvas
    

]
