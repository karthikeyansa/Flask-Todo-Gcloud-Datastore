from flask import Flask
from configuration.config import ndb_wsgi_middleware
import os

app = Flask(__name__)

app.config.from_pyfile('configuration/config.py')
app.wsgi_app = ndb_wsgi_middleware(app.wsgi_app)

from views.views import *

if __name__ == '__main__':
   if os.getenv('GAE_ENV', '').startswith('standard'):
         app.run()
   else:
      app.run(debug=True)