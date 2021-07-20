from flask import render_template, request, url_for, session, redirect, jsonify
from google.cloud.ndb._datastore_query import Cursor
from models.models import Users, Tasks
from main import app

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
    if session.get('current_user_id'):
        return redirect(url_for('firstpage'))
    return render_template("login.html")


@app.route("/tasks", methods=["GET"])
def firstpage():
    username = Users.get_by_id(session.get(
        'current_user_id')).email.split("@")[0]
    return render_template("add.html", user_name=username)


# register
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        new_user = Users(email=request.json.get("email"),
                         password=request.json.get("password"))
        current_user = Users.query().filter(Users.email == request.json.get("email"),
                                            Users.password == request.json.get("password")).get()
        print(new_user.email)
        if not current_user and "@" in new_user.email and ".com" in new_user.email:
            new_user.put()
            return jsonify({"success": True})
        else:
            return jsonify({"success": False})
    return render_template("register.html")


# new task
@app.route("/v1/todos/task", methods=["POST"])
def addTask():
    current_user = Users.get_by_id(session.get('current_user_id'))
    if request.method == "POST":
        add_task = Tasks(content=request.json.get(
            'content'), author=current_user.key)
        add_task.put()
        new_task = {"id": add_task.key.id(), "content": add_task.content, "status": add_task.status,
                    "time": add_task.timestamp}
        return jsonify({"new_task": new_task, "success": True}), 200


@app.route("/v1/todos/", methods=["GET"])
def getTask():
    current_user = Users.get_by_id(session.get("current_user_id"))
    if request.method == "GET":
        tasks = Tasks.query().filter(
            Tasks.author == current_user.key).order(-Tasks.timestamp).fetch()
        result = []
        complete = 0
        incomplete = 0
        for task in tasks:
            if(task.status == False):
                incomplete += 1
            elif(task.status == True):
                complete += 1
            result.append({"id": task.key.id(), "content": task.content,
                          "status": task.status, "time": task.timestamp})
        return jsonify({"result": result, "success": True, "incomplete": incomplete, "complete": complete})


# update
@app.route("/v1/todos/<int:id>", methods=["PUT", "DELETE"])
def updateTask(id):
    task = Tasks.get_by_id(id)
    if task and request.method == "PUT":
        task.content = request.json.get('content')
        task.put()
        return jsonify({"task": {"id": task.key.id(), "content": task.content, "status": task.status, "time": task.timestamp}, "success": True}), 200
    if task and request.method == "DELETE":
        task.key.delete()
        return jsonify({"success": True}), 200
    else:
        return jsonify({"success": False}), 500


# status update
@app.route("/v1/todos/statusupdate/<int:id>", methods=["PUT"])
def statusUpdate(id):
    task = Tasks.get_by_id(id)
    if task:
        task.status = True
        task.put()
        return jsonify({"task": {"id": task.key.id(), "content": task.content, "status": task.status, "time": task.timestamp}, "success": True}), 200
    else:
        return jsonify({"success": False}), 500


# logout
@app.route("/logout", methods=["GET"])
def logout():
    del session['current_user_id']
    return redirect(url_for('login'))
