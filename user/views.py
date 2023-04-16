from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import login as auth_login, authenticate, logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.forms.models import model_to_dict
import json


from .forms import UserForm
from .models import User
from board.models import Project, Board

@csrf_exempt # dev only---------------
def register(request): # ! todo: change the password to encrypted
    form = UserForm()

    if request.method == 'POST':
        form = UserForm(request.POST)
        if form.is_valid():
            
            user = form.save(commit=False)
            user.username = user.username.lower()
            user.save()
            
            auth_login(request, user)
            return redirect('user-dashboard')
            
        else:
            """
            calling the toast to inform the reason the user was not created
            
            """
            messages.set_level(request, messages.WARNING)    
            for field, errors in form.errors.items():
                    for error in errors:
                        messages.warning(request, f'Error: {error} (\'{field}\' )')
        
    context = {'form': form}
    return render(request, "user/register.html", context)


def login(request):
    '''
        Gets the user's email and password and verifies for existence in db,
        if so, creates a session in the browser 

        parameter: request

        return: None
    '''
    page = 'login'

    if request.user.is_authenticated:
        return redirect('user-dashboard')

    if request.method == 'POST':
        email = request.POST.get('email').lower().strip()
        password = request.POST.get('password').strip()


        try: 
            user = User.objects.get(email=email)
        except:
            messages.warning(request, 'User does not exist')

        user = authenticate(request, email=email, password=password)

        if user is not None:
            auth_login(request, user) # add session to browser
            return redirect('user-dashboard')
        else:
            messages.warning(request, 'Username or password don\'t match')

    context = {'page':page}
    return render(request, 'user/login.html', context)


@login_required(login_url='register')
def user_dashboard(request):    
    projects = Project.objects.filter(user=request.user)

    projects_list = []
    for project in projects:
        data = model_to_dict(project)        
        boards_list = list(Board.objects.filter(project=project).values())
        
        for board in boards_list:
            board.pop("updated")
            board.pop("created")

        data['boards'] = boards_list                
        projects_list.append(data)
    
    

    for i in projects_list:
        print(i)
        print('-'*20)

    context = {'projects' : json.dumps(projects_list)}
    return render(request, 'user/user_dashboard.html', context)


@login_required(login_url='login')
def logout(request):
    auth_logout(request)
    return redirect('dashboard')