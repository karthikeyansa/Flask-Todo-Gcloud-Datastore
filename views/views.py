from flask import render_template, request, url_for, session, redirect, jsonify
from models.models import Users, Tasks, Notes
from main import app
from configuration.config import pattern


# login

@app.route("/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        current_user = Users.query().filter(Users.email == request.json.get("email"),
                                            Users.password == request.json.get("password")).get()
        if current_user:
            session['current_user_id'] = current_user.key.id()
            return jsonify({"success": True})
        else:
            return jsonify({"success": False})
    return render_template("login.html")


@app.route("/notes", methods=["GET"])
def firstpage():
    if session.get('current_user_id'):
        username = Users.get_by_id(session.get('current_user_id')).email.split("@")[0]
        return render_template("add.html", user_name=username)
    else:
        return redirect(url_for('login'))


# register
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        email = request.json.get("email")
        password = request.json.get("password")
        confirmPassword = request.json.get("confirmPassword")
        current_user = Users.query().filter(Users.email == request.json.get("email")).get()
        if current_user:
            return jsonify({"reason": "User Email already in use", 
                            "success": False})
        if('@' in email and '.' in email and len(email.split("@")[0]) > 10):
            if(pattern.fullmatch(password) is not None and password == confirmPassword):
                new_user = Users(email=request.json.get("email"), password=request.json.get("password"))
                new_user.put()
                return jsonify({"success": True})
            else:
                return jsonify({"reason": "Password should be atleast 11 characters \
                                and should also contain Uppercase, Lowercase and numbers only in each.", 
                                "success": False})
        else:
            return jsonify({"reason": "Invalid email ID",
                            "success": False})
    return render_template("register.html")


# new note and task
@app.route("/v2/todos/note", methods=["POST"])
def addNote():
    current_user = Users.get_by_id(session.get('current_user_id'))
    if request.method == "POST":
        tasks = request.json.get('tasks')
        alltasks = []
        for task in tasks:
            new_task = Tasks(description = task.get('description'))
            new_task.put()
            new_task.task_id = new_task.key.id()
            new_task.put()
            alltasks.append(Tasks.get_by_id(new_task.task_id))
        add_note = Notes(content=request.json.get('content'), author=current_user.key,taskOwner=alltasks).put()
        new_note = Notes.get_by_id(add_note.id())
        alltasks.clear()
        for task in new_note.taskOwner:
            alltasks.append({"task_id": task.key.id(), "description": task.description, "status": task.status})
        response_note = {"id": new_note.key.id(), "content": new_note.content, "tasks": alltasks}
        return jsonify({"new_note": response_note, "success": True}), 200

# get notes and tasks
@app.route("/v2/todos", methods=["GET"])
def getNote():
    current_user = Users.get_by_id(session.get('current_user_id'))
    if(current_user):
        notes = Notes.query().filter(Notes.author == current_user.key).order(-Notes.key).fetch()
        result = []
        for note in notes:
            tasks = note.taskOwner
            alltasks = []
            for task in tasks:
                alltasks.append({"task_id": task.task_id, "description": task.description, "status": task.status})
            result.append({"id": note.key.id(), "content": note.content, "tasks": alltasks})
        return jsonify({"result": result, "success": True})
    return redirect(url_for('login'))

#update note context and task/newtask  and delete note and tasks.
@app.route("/v2/todos/note/<int:id>", methods=["PUT", "DELETE"])
def updateNote(id):
    current_user = Users.get_by_id(session.get('current_user_id'))
    if(current_user and request.method == "PUT"):
        noteToUpdate = Notes.get_by_id(id)
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
            alltasks.append({"task_id": task.task_id, "description": task.description, "status": task.status})
        response_note = {"id": noteToUpdate.key.id(), "content": noteToUpdate.content, "tasks": alltasks}
        return jsonify({"result": response_note, "success": True})
    elif(current_user and request.method == "DELETE"):
        noteToUpdate = Notes.get_by_id(id)
        noteToUpdate.key.delete()
        return jsonify({"success": True})
    return jsonify({"Authorization Error": "Invalid credentials"})

# update task and delete task using note ID.
@app.route("/v2/todos/note/<int:noteid>/todo/<int:todoid>", methods=["PUT", "DELETE"])
def updateTodo(noteid, todoid):
    current_user = Users.get_by_id(session.get('current_user_id'))
    if(current_user and request.method == "PUT"):
        noteToUpdate = Notes.get_by_id(noteid)
        for task in noteToUpdate.taskOwner:
            if(task.task_id == todoid):
                task.description = request.json.get('description')
                task.put()
        noteToUpdate.put()
        alltasks = []
        for task in noteToUpdate.taskOwner:
            alltasks.append({"task_id": task.task_id, "description": task.description, "status": task.status})
        response_note = {"id": noteToUpdate.key.id(), "content": noteToUpdate.content, "tasks": alltasks}
        return jsonify({"result": response_note, "success": True})
    elif(current_user and request.method == "DELETE"):
        noteToUpdate = Notes.get_by_id(noteid)
        for task in noteToUpdate.taskOwner:
            if(task.task_id == todoid):
                noteToUpdate.taskOwner.remove(task)
        noteToUpdate.put()
        alltasks = []
        for task in noteToUpdate.taskOwner:
            alltasks.append({"task_id": task.task_id, "description": task.description, "status": task.status})
        response_note = {"id": noteToUpdate.key.id(), "content": noteToUpdate.content, "tasks": alltasks}
        return jsonify({"result": response_note, "success": True})
    return jsonify({"Authorization Error": "Invalid credentials"})

#update task status.
@app.route("/v2/todos/note/<int:noteid>/todo/<int:todoid>/update", methods=["PUT"])
def statusupdate(noteid, todoid):
    current_user = Users.get_by_id(session.get('current_user_id'))
    if(current_user and request.method == "PUT"):
        noteToUpdate = Notes.get_by_id(noteid)
        for task in noteToUpdate.taskOwner:
            if(task.task_id == todoid):
                task.status = request.json.get('status')
                task.put()
        noteToUpdate.put()
        alltasks = []
        for task in noteToUpdate.taskOwner:
            alltasks.append({"task_id": task.task_id, "description": task.description, "status": task.status})
        response_note = {"id": noteToUpdate.key.id(), "content": noteToUpdate.content, "tasks": alltasks}
        return jsonify({"result": response_note, "success": True})
    return jsonify({"Authorization Error": "Invalid credentials"})

@app.route("/logout", methods=["GET"])
def logout():
    del session['current_user_id']
    return redirect(url_for('login'))

