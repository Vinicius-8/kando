from django.test import TestCase
from django.urls import reverse
from ..models import User


class UserTestCase(TestCase):

    def setUp(self) -> None:
        self.user = User.objects.create_user(username='testuser', email='testuser@gmail.com', password='testuser')


    def test_user_login_view(self):
        url = reverse('login')
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'user/login.html')

         
        # login the user 
        url_login = reverse('login')
        response_login = self.client.post(url_login, {'email': 'testuser@gmail.com', 'password': 'testuser'})
        self.assertTrue(response_login)
        self.assertRedirects(response_login, reverse('user-dashboard'))
    

    def test_user_register_view(self):
        url = reverse('register')
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'user/register.html')

        # register the user
        url_register = reverse('register')
        response_register = self.client.post(url_register, {
            'name':'test user',
            'username':'testuser@gmail.com', 
            'email': 'testuser@gmail.com', 
            'password1': 'testuser', 
            'password2': 'testuser'
            })

        print(response_register)

        self.assertTrue(response_register)
        self.assertRedirects(response_register, reverse('user-dashboard'))



    def test_user_dashboard_view(self):
        url = reverse('user-dashboard')
        response = self.client.get(url)

        self.assertEqual(response.status_code, 302) # not loged user
        

       


        loged_user = self.client.login(email='testuser@gmail.com', password='testuser') # email is used to log in because is set in the login view instead of username
        self.assertTrue(loged_user)

        response_authenticated = self.client.get(url)

        self.assertEqual(response_authenticated.status_code, 200)
        self.assertTemplateUsed(response_authenticated, 'user/user_dashboard.html')


