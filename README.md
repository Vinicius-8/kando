# KanDo

KanDo is a web application that allows you to manage tasks on a kanban board. With KanDo, you can create, edit, and delete tasks, move them between different columns of the kanban board, and update their status.

KanDo was developed using Django, Postgres, and jQuery. The backend of the application is powered by Django, while the Postgres database is used to store information about tasks and their status. The frontend of the application uses jQuery for user interface manipulation as well as for communication with the backend.

## Demo
You can try out KanDo online at https://django-kando.fly.dev. This is a demo endpoint where you can test KanDo's features without having to set it up locally. Please note that this is just a demo environment and any data you create will be periodically wiped.

## Features

KanDo has the following features:

- Create, edit, and delete tasks.
- Move tasks between columns of the kanban board.
- Update the status of tasks.


## How to Run

To run KanDo, follow these instructions:

1. Clone this repository to your local machine using the following command:

```bash
git clone https://github.com/Vinicius-8/kando.git
```

2. Install the Python dependencies listed in `requirements.txt` using the following command:

```bash
pip install -r requirements.txt
```

3. Create a Postgres database or SQLite3 and update the database settings in `settings.py`.

4. Run the database migrations using the following command:

```bash
python manage.py migrate
```

5. Start the Django development server using the following command:

```bash
python manage.py runserver
```

6. Open a web browser and navigate to `http://localhost:8000` to access the application.



