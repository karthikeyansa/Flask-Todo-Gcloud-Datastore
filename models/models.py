from google.cloud import ndb

class Users(ndb.Model):
   email = ndb.StringProperty()
   password = ndb.StringProperty()

class Tasks(ndb.Model):
   content = ndb.TextProperty()
   timestamp = ndb.DateTimeProperty(auto_now_add=True)
   author = ndb.KeyProperty(Users, required=True)
   status = ndb.BooleanProperty(default=False)