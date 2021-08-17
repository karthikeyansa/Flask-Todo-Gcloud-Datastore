from flask import request, jsonify, render_template, make_response, url_for, redirect
from models.models import Users, Tasks, Notes
from werkzeug.security import generate_password_hash, check_password_hash
from main import app
import uuid
import jwt
from functools import wraps
from configuration.config import SECRET_KEY

# Token Handler
def token_required(func):
    '''
    using @wraps instead of tradition wrapper, because tradition wrapper overwites existing view fuction decorators and 
    make existing view function to have same name, @warps changes this automatically.
    '''
    @wraps(func)
    def inner(*args, **kwargs):
        if request.cookies:
            access_token = request.cookies.get('access-token')
            refresh_token = request.cookies.get('refresh-token')
            try:
                data = jwt.decode(access_token, app.config['SECRET_KEY'], algorithms=["HS256"])
                current_user = Users.query().filter(Users.user_id==data['public_id']).get()
                return func(current_user)
            except:
                data = jwt.decode(refresh_token, app.config['SECRET_KEY'], algorithms=["HS256"])
                current_user = Users.query().filter(Users.user_id==data['public_id']).get()
                access_token = jwt.encode({'public_id': current_user.user_id}, app.config['SECRET_KEY'])
                return func(current_user, access_token)
        else:
            return redirect(url_for('login'))
    return inner

#login
@app.route("/", methods=["POST", "GET"])
def login():
    if(request.method == "POST"):
        email = request.json.get('email')
        password = request.json.get('password')
        user = Users.query().filter(Users.email==email).get()
        if(user and check_password_hash(user.password, password) == True):
            access_token = jwt.encode({'public_id': user.user_id}, app.config['SECRET_KEY'])
            refresh_token = jwt.encode({'public_id': user.user_id}, app.config['SECRET_KEY'])
            response = make_response(jsonify({"success": True}))
            response.set_cookie("access-token", value=access_token, max_age=60*30, secure=True, httponly=True, samesite="strict")
            response.set_cookie("refresh-token", value=refresh_token, secure=True, httponly=True, samesite="strict")
            return response
        else:
            return jsonify({"success": False, "message": "Invalid Credentials"})
    if(request.cookies.get("refresh-token") and request.cookies.get("access-token")):
        return redirect(url_for('application'))
    return render_template("login.html")

# register
@app.route("/register", methods=["POST", "GET"])
def register():
    if request.method == "POST":
        data = request.get_json()
        existing_user = Users.query().filter(Users.email==data.get('email')).get()
        if existing_user:
            return jsonify({"message": "User already exists", "success": False})
        hashed_password = generate_password_hash(data.get('password'), method='sha256')
        Users(email=data.get('email'), password=hashed_password, user_id=str(uuid.uuid4())).put()
        users = Users.query().fetch()
        return jsonify({"message": "User created successfully", "success": True})
    return render_template("register.html")

@app.route("/app")
@token_required
def application(self, *args, **kwargs):
    if(request.cookies.get("refresh-token") and request.cookies.get("access-token")):
        return render_template("app.html")
    return redirect(url_for('login'))

@app.route("/api/v3/deleteall", methods=["POST"])
def alldelete():
    data = request.get_json()
    if data:
        code = data.get("SECRET_KEY")
        if(code == SECRET_KEY):
            users = Users.query().fetch()
            notes = Notes.query().fetch()
            tasks = Tasks.query().fetch()
            print(users)
            print(notes)
            print(tasks)
            for user in users:
                user.key.delete()
            for note in notes:
                note.key.delete()
            for task in tasks:
                task.key.delete()
        return jsonify({"success": True})
    return jsonify({"success": False})
    

# get notes and tasks
@app.route("/api/v3/todos", methods=["GET"])
@token_required
def getNote(self, *args, **kwargs):
    notes = Notes.query().order(-Notes.key).filter(Notes.author == self.key).fetch()
    result = []
    for note in notes:
        tasks = note.taskOwner
        alltasks = []
        for task in tasks:
            alltasks.append({"task_id": task.task_id, "description": task.description, 
                             "status": task.status})
        result.append({"id": note.key.id(), "content": note.content, 
                       "tasks": alltasks})
    response =  make_response(jsonify({"result": result, "success": True}), 200)
    if(args):
        response.set_cookie("access-token", value=args[0], max_age=60*30, secure=True, httponly=True, samesite="strict")
    return response


# new note and task
@app.route("/api/v3/todos/note", methods=["POST"])
@token_required
def addNote(self, *args, **kwargs):
    tasks = request.json.get('tasks')
    alltasks = []
    for task in tasks:
        new_task = Tasks(description = task.get('description'))
        new_task.put()
        new_task.task_id = new_task.key.id()
        new_task.put()
        alltasks.append(Tasks.get_by_id(new_task.task_id))
    add_note = Notes(content=request.json.get('content'), 
                     author=self.key, taskOwner=alltasks).put()
    new_note = Notes.get_by_id(add_note.id())
    alltasks.clear()
    for task in new_note.taskOwner:
        alltasks.append({"task_id": task.key.id(), "description": task.description, 
                         "status": task.status})
    response_note = {"id": new_note.key.id(), "content": new_note.content, 
                     "tasks": alltasks}
    response =  make_response(jsonify({"new_note": response_note, "success": True}), 200)
    if(args):
        response.set_cookie("access-token", value=args[0], max_age=60*30, secure=True, httponly=True, samesite="strict")
    return response

#update note context and add newtask and delete notes and tasks.
@app.route("/api/v3/todos/note", methods=["PUT", "DELETE"])
@token_required
def updateNote(self, *args, **kwargs):
    data = request.get_json()
    if(request.method == "PUT"):
        noteToUpdate = Notes.get_by_id(data.get('note_id'))
        if(request.json.get("content")):
            noteToUpdate.content = request.json.get("content")
        elif(request.json.get('description')):
            new_task = Tasks(description=request.json.get('description'))
            new_task.put()
            new_task.task_id = new_task.key.id()
            new_task.put()
            noteToUpdate.taskOwner.append(Tasks.get_by_id(new_task.task_id))
        noteToUpdate.put()
        alltasks = []
        for task in noteToUpdate.taskOwner:
            alltasks.append({"task_id": task.task_id, 
                             "description": task.description, 
                             "status": task.status})
        response_note = {"id": noteToUpdate.key.id(), 
                         "content": noteToUpdate.content, 
                         "tasks": alltasks}
        response =  make_response(jsonify({"result": response_note, "success": True}), 200)
        if(args):
            response.set_cookie("access-token", value=args[0], max_age=60*30, secure=True, httponly=True, samesite="strict")
        return response
    elif(request.method == "DELETE"):
        noteToUpdate = Notes.get_by_id(data.get('id'))
        for task in noteToUpdate.taskOwner:
            taskTodelete = Tasks.query().filter(Tasks.task_id == task.task_id).get()
            if(taskTodelete):
                taskTodelete.key.delete()
        noteToUpdate.key.delete()
        response =  make_response(jsonify({"success": True}), 200)
        if(args):
            response.set_cookie("access-token", value=args[0], max_age=60*30, secure=True, httponly=True, samesite="strict")
        return response
    return jsonify({"Authorization Error": "Invalid credentials"})

# update task and delete task using note ID.
@app.route("/api/v3/todos/note/todo", methods=["PUT", "DELETE"])
@token_required
def updateTodo(self, *args, **kwargs):
    data = request.get_json()
    if(request.method == "PUT"):
        noteToUpdate = Notes.get_by_id(data.get('note_id'))
        for task in noteToUpdate.taskOwner:
            if(task.task_id == data.get('task_id')):
                task.description = request.json.get('description')
                task.put()
        noteToUpdate.put()
        alltasks = []
        for task in noteToUpdate.taskOwner:
            alltasks.append({"task_id": task.task_id, 
                             "description": task.description, 
                             "status": task.status})
        response_note = {"id": noteToUpdate.key.id(), 
                         "content": noteToUpdate.content, 
                         "tasks": alltasks}
        response =  make_response(jsonify({"result": response_note, "success": True}), 200)
        if(args):
            response.set_cookie("access-token", value=args[0], max_age=60*30, secure=True, httponly=True, samesite="strict")
        return response
    elif(request.method == "DELETE"):
        noteToUpdate = Notes.get_by_id(data.get('note_id'))
        for task in noteToUpdate.taskOwner:
            if(task.task_id == data.get('task_id')):
                noteToUpdate.taskOwner.remove(task)
        noteToUpdate.put()
        alltasks = []
        for task in noteToUpdate.taskOwner:
            alltasks.append({"task_id": task.task_id, 
                             "description": task.description, 
                             "status": task.status})
        response_note = {"id": noteToUpdate.key.id(), 
                        "content": noteToUpdate.content, 
                        "tasks": alltasks}
        response =  make_response(jsonify({"result": response_note, "success": True}), 200)
        if(args):
            response.set_cookie("access-token", value=args[0], max_age=60*30, secure=True, httponly=True, samesite="strict")
        return response
    return jsonify({"Authorization Error": "Invalid credentials"})

#update task status.
@app.route("/api/v3/todos/note/todo/update", methods=["PUT"])
@token_required
def statusupdate(self, *args, **kwargs):
    if(request.method == "PUT"):
        data = request.get_json()
        noteToUpdate = Notes.get_by_id(data.get('note_id'))
        for task in noteToUpdate.taskOwner:
            if(task.task_id == data.get('task_id')):
                task.status = data.get('status')
                task.put()
        noteToUpdate.put()
        alltasks = []
        for task in noteToUpdate.taskOwner:
            alltasks.append({"task_id": task.task_id, 
                             "description": task.description, 
                             "status": task.status})
        response_note = {"id": noteToUpdate.key.id(), 
                         "content": noteToUpdate.content, 
                         "tasks": alltasks}
        response =  make_response(jsonify({"result": response_note, "success": True}), 200)
        if(args):
            response.set_cookie("access-token", value=args[0], max_age=60*30, secure=True, httponly=True, samesite="strict")
        return response
    return jsonify({"Authorization Error": "Invalid credentials"})

@app.route("/profile", methods=["GET", "POST"])
@token_required
def profile(self, *args, **kwargs):
    if request.method == "POST":
        notes = Notes.query().filter(Notes.author == self.key).fetch()
        for note in notes:
            for task in note.taskOwner:
                task = Tasks.get_by_id(task.task_id)
                task.key.delete()
            note.key.delete()
        user = Users.query().filter(Users.key==self.key).get()
        user.key.delete()
        return redirect(url_for('logout'))
    return render_template("profile.html", user_name = self.email.split("@")[0])

@app.route("/logout")
def logout():
    response = make_response(render_template('login.html'), 200)
    response.set_cookie("access-token", max_age=0)
    response.set_cookie("refresh-token", max_age=0)
    return response