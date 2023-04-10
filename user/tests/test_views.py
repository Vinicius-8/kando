from django.test import TestCase
from django.urls import reverse
from ..models import User


class UserTestCase(TestCase):

    def setUp(self) -> None:
        self.user = User.objects.create_user(username='testuser', email='testuser@gmail.com', password='testuser')


    def test_user_login_view(self):
        '''
            Testing the login page/template
            -   testing if the correct template is used
            -   testing if login
            -   testing if the user is redirect correctly

        '''
        url = reverse('login')
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'user/login.html')

         
        # login the user 
        response_login = self.client.post(url, {'email': 'testuser@gmail.com', 'password': 'testuser'})
        self.assertTrue(response_login)
        self.assertRedirects(response_login, reverse('user-dashboard'))
    

    def test_user_register_view(self):
        '''
            Testing the register page/template
            -   testing if the correct template is used
            -   testing if the registered user exists
            -   testing if the user is redirect properly
        '''

        url = reverse('register')
        response = self.client.get(url)

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'user/register.html')

        # register the user
        data = {
            'name': 'john doe',
            'email': 'johndoe334@example.com',      
            'password1': '0i9u9gy987y',             # the password can't be easy, otherwise the test won't pass (and won't say why)
            'password2': '0i9u9gy987y',
        }

        response = self.client.post(url, data)
        self.assertTrue(User.objects.filter(email='johndoe334@example.com').exists())
        self.assertRedirects(response, reverse('user-dashboard'))


    def test_user_dashboard_view(self):
        '''
            testing the user-dashboard page/template , 
            -   trying to access without session 
            -   trying to access after login

        '''
        url = reverse('user-dashboard')
        response = self.client.get(url)

        self.assertEqual(response.status_code, 302) # not loged user        

        loged_user = self.client.login(email='testuser@gmail.com', password='testuser') # email is used to log in because is set in the login view instead of username
        self.assertTrue(loged_user)

        response_authenticated = self.client.get(url)

        self.assertEqual(response_authenticated.status_code, 200)
        self.assertTemplateUsed(response_authenticated, 'user/user_dashboard.html')


    def test_user_logout(self):
        '''
            Testing the logout view
            -   login the user
            -   logout
            -   checks if the user was redirected
            -   checks if the user was redirected to the correct page
            -   checks for id of the user in the session
            
        '''
        # login    
        loged_user = self.client.login(email='testuser@gmail.com', password='testuser') # email is used to log in because is set in the login view instead of username
        self.assertTrue(loged_user)

        # logout
        url = reverse('logout') 
        response = self.client.get(url)
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, reverse('dashboard'))
        self.assertFalse('_auth_user_id' in self.client.session) # checks for id in the session

