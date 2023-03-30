from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import UserForm
from .models import User
# Create your views here.

def register(request):
    form = UserForm()

    if request.method == 'POST':
        form = UserForm(request.POST)

        if form.is_valid():
            

            user = form.save(commit=False)
            user.username = user.username.lower()
            user.save()
            # login(request, user)

            return redirect('user-dashboard')
        else:
            print('fail to register')
            for field, errors in form.errors.items():
                    for error in errors:
                        print(f"Erro no campo {field}: {error}")
            # messages.error(request, 'Fail! too easy password')

    context = {'form': form}
    return render(request, "user/register.html", context)


def user_dashboard(request):

    context = {}
    return render(request, 'user/user_dashboard.html', context)