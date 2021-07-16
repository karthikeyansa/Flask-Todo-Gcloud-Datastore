from flask import render_template, request, url_for, session, redirect, jsonify, flash
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
            flash("Logged In Successful")
            return render_template("add.html")
        else:
            flash("Invalid credentials")
            return redirect(url_for('login'))
    if session.get('current_user_id'):
        username = Users.get_by_id(session.get('current_user_id')).email.split("@")[0]
        return render_template("add.html", user_name = username)
    return render_template("login.html")


# register
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        new_user = Users(email=request.json.get("email"), password=request.json.get("password"))
        current_user = Users.query().filter(Users.email == request.json.get("email"),
                                            Users.password == request.json.get("password")).get()
        if not current_user:
            new_user.put()
            flash("Registration Successful")
            return redirect(url_for('login'))
        else:
            flash("Registration Unsuccessful")
            return redirect(url_for('register'))
    return render_template("register.html")


# new task
@app.route("/v1/todos/task", methods=["POST"])
def addTask():
    current_user = Users.get_by_id(session.get('current_user_id'))
    if request.method == "POST":
        add_task = Tasks(content=request.json.get('content'), author=current_user.key)
        add_task.put()
        new_task = {"id": add_task.key.id(), "content": add_task.content, "status": add_task.status,
                    "time": add_task.timestamp}
        return jsonify({"new_task": new_task, "success": True}), 200

@app.route("/v1/todos/", methods=["GET"])
def getTask():
    current_user = Users.get_by_id(session.get("current_user_id"))
    if request.method == "GET":
        tasks = Tasks.query().filter(Tasks.author == current_user.key).order(-Tasks.timestamp).fetch()
        result = []
        complete = 0
        incomplete = 0
        for task in tasks:
            if(task.status == False):
                incomplete += 1
            elif(task.status == True):
                complete += 1
            result.append({"id": task.key.id(), "content": task.content, "status": task.status, "time": task.timestamp})
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
        return jsonify({"task": {"id": task.key.id(), "content": task.content, "status": task.status, "time": task.timestamp},"success": True}), 200
    else:
        return jsonify({"success": False}), 500


# logout
@app.route("/logout", methods=["GET"])
def logout():
    del session['current_user_id']
    return redirect(url_for('login'))
