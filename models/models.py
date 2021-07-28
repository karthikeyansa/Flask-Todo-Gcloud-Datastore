from google.cloud import ndb


class Users(ndb.Model):
   email = ndb.StringProperty()
   password = ndb.StringProperty()


class Tasks(ndb.Model):
   task_id = ndb.IntegerProperty(default=0)
   description = ndb.TextProperty()
   status = ndb.BooleanProperty(default=False)
   timestamp = ndb.DateTimeProperty(auto_now_add=True)


class Notes(ndb.Model):
   content = ndb.TextProperty()
   author = ndb.KeyProperty(Users)
   taskOwner = ndb.StructuredProperty(Tasks, repeated=True, indexed=True)
