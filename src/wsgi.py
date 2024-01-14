# This file was created to run the application on heroku using gunicorn.
# Read more about it here: https://devcenter.heroku.com/articles/python-gunicorn

from app import app as application
from flask import Flask


if __name__ == "__main__":
    application.run()
