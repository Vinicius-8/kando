from django.test import TestCase, Client
from django.urls import reverse

class DashboardTemplateTest(TestCase):
    
    def setUp(self):
        self.client = Client()

    def test_dashboard_html(self):
        # gets the view and checks for 200 response
        response = self.client.get(reverse('dashboard'))
        self.assertEqual(response.status_code, 200)
        
    def test_elements_existence(self):
        response = self.client.get(reverse('dashboard'))
        self.assertContains(response, '<span class="col-sm-8 d-flex align-items-center justify-content-center">To Do</span>')
        self.assertContains(response, '<span class="col-sm-8 d-flex align-items-center justify-content-center">Doing</span>')
        self.assertContains(response, '<span class="col-sm-8 d-flex align-items-center justify-content-center">Done</span>')
        self.assertContains(response, "<span>Register</span>")
        self.assertContains(response, "<span>Login</span>")
        self.assertContains(response, "<div class=\"simple-item col-sm-10 d-flex align-items-center\" style=\"overflow: hidden;\">Build</div>")    
        self.assertContains(response, "<div class=\"item-board text-center plus-item-board\" onclick=\"openNewItemCreation(this)\">+</div>")
        self.assertContains(response, "<button class=\"btn btn-box  align-items-center\" style=\"color: whitesmoke;\">")
        
    
    