# base image
FROM python:3.8.12-bullseye 

# woriking directory for the app
WORKDIR /app 

# gets the requirements from the location of the dockerfile and copies to the app dir (.)
COPY requirements.txt .

# install the requirements
RUN pip3 install --no-cache-dir -r requirements.txt 

# gets all the files from dockerfile location and copies to the
COPY . /app 

ENV DEBUG=False
ENV PYTHONUNBUFFERED=1


# defines the type of command
ENTRYPOINT ["python3"] 
 
# collect the static files
# RUN python manage.py collectstatic --noinput 
 
# exposes the 8000 door 
EXPOSE 8000 

# defines the args to the entrypoint
CMD ["manage.py", "runserver", "0.0.0.0:8000"] 
