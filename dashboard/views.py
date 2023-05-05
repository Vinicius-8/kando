from django.shortcuts import render, redirect

# Create your views here.

def dashboard(request):
    """
    This function is used to render the dashboard page
    """
    
    # check if the user is authenticated or not
    # if not authenticated then redirect to dashboard page
    # else render the authenticated dashboard page

    if request.user.is_authenticated:
        return redirect('user-dashboard')
    return render(request, "dashboard/dashboard.html")
