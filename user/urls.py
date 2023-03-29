from django.urls import path
from . import views

urlpatterns =[
    path('', views.user_dashboard, name='user-dashboard'),
    path('register', views.register, name='register'),
    path('dashboard', views.user_dashboard, name='user-dashboard')
]
