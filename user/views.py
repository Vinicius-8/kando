from django.shortcuts import render
from .forms import UserForm
# Create your views here.

def register(request):
    form = UserForm()
    if request.method == 'POST':
        print(request.POST)

    context = {'form': form}
    return render(request, "user/register.html", context)