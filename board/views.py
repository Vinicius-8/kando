from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt



#@csrf_exempt
@login_required(login_url='login')
def create_project(request):
    if request.method == 'POST':
        print('--------',request.POST)
        return HttpResponse('ok')
    else:
        print('nothing -----------')
        return HttpResponse('not ok')