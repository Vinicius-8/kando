from django.db.utils import IntegrityError
from django.test import TestCase
from user.models import User
from ..models import Item, Board, Project


class ItemTestCase(TestCase):

    def setUp(self):        
        self.user = User.objects.create(name = 'User 1', email = 'user@gmail.com')
        self.project = Project.objects.create(name = 'Project 1', user = self.user)
        self.board = Board.objects.create(name = "Board 1", project = self.project)
        self.item = Item.objects.create(name = 'Item de teste', description='Item padrão de teste', color = 'blue', board = self.board, position = 1)


    def test_item_creation(self):
        self.assertEqual(self.item.name, 'Item de teste')
        self.assertEqual(self.item.position, 1)
        self.assertEqual(self.item.description, 'Item padrão de teste')
        self.assertEqual(self.item.color, 'blue')
        self.assertEqual(self.item.board, self.board)
        self.assertEqual(self.item.position, 1)


    def test_validation(self):
        with self.assertRaises(IntegrityError):
            Item.objects.create(name='')
        

    def test_update(self):
        self.item.name = 'New Name'
        self.item.save()
        self.assertEqual(self.item.name, 'New Name')

        self.item.position = 4
        self.item.save()
        self.assertEqual(self.item.position, 4)


    def test_cascade_deletion(self):
        self.board.delete()
        self.assertEqual(Item.objects.filter(name='Item de teste').count(), 0)
        