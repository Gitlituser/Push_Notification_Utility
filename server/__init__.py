
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

# APP = Flask(__name__)
APP = Flask(__name__, instance_relative_config=True)

APP.config['DB_URL'] = 'login.db'
APP.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///login.db'
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
APP.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True

# Creating SQLAlchemy object and bind it to Flask application.
db = SQLAlchemy(APP)
APP.app_context().push()

APP.config.from_pyfile('config.py')

# Can't import AUTH_BLUEPRINT before db object so importing later.
from server.views import AUTH_BLUEPRINT
APP.register_blueprint(AUTH_BLUEPRINT)




