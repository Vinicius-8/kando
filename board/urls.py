from django.urls import path
from . import views

urlpatterns = [
    #project
    path('create', views.create_project, name='create-project'),
    path('projects', views.get_projects, name='get-projects'),
    path('projects/<str:pk>', views.get_project, name='get-project'),

    #board
    path('board/create', views.create_board, name='create-board')
]
