from django.urls import path
from board import views as board_views
from . import views

urlpatterns = [
    path('', views.user_dashboard, name='user-dashboard'),
    path('register', views.register, name='register'),
    path('login', views.login, name='login'),
    path('logout', views.logout, name='logout'),
    path('dashboard', views.user_dashboard, name='user-dashboard'),

    #path('create_project', board_views.create_project, name='create-project'),
]
