from django.test import TestCase
from ..models import User


class UserTestCase(TestCase):

    def setUp(self) -> None:
        self.user_1 = User.objects.create(username='vini',name='vinicius', email='vinicius@gmail.com')
        self.user_2 = User.objects.create(username='richard88',name='richard gomez', email='richard@gmail.com')

    def test_user_creation(self):
        self.assertEqual(self.user_1.username, 'vini')
        self.assertEqual(self.user_1.name, 'vinicius')
        self.assertEqual(self.user_1.email, 'vinicius@gmail.com')
        
        self.assertEqual(self.user_2.name, 'richard gomez')
        self.assertEqual(self.user_2.email, 'richard@gmail.com')
        self.assertEqual(self.user_2.username, 'richard88')
    

    def test_user_creation_count(self):
        self.assertEqual(User.objects.count(), 2)
