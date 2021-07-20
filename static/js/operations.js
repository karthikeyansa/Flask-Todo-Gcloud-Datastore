var taskCountKeeper = {"incomplete": 0, "complete": 0};
var editingContent = {};

var taskContext = document.getElementById("content");
taskContext.addEventListener("keyup", function(event){
    if(event.keyCode === 13){
        event.preventDefault();
        document.getElementById("submit").click();
    }
})

async function fetchTodolist(url, requestSettings){
    try{
        let request = await fetch(url, requestSettings);
        let response = await request.json();
        return response;
    }
    catch(error){
        console.log("failed to fetch");
    }  
}

async function callFetchList(){
    // Function to fetch todolist from fetchTodolist function on page render.

    try{
        let responseData = await fetchTodolist('/v1/todos', {"method": "GET"});
        console.log(responseData);
        createtablebody(responseData);
    }
    catch(error){
        console.error(error);
    }  
}

callFetchList();


async function createtablebody(response) {
    // Function responsible for creating ongoing and completed Task sections.

    var ongoing = document.getElementById("ongoingTasks");
    ongoing.innerHTML = "";
    var completed = document.getElementById("completedTasks");
    completed.innerHTML = "";
    console.log(response);
    var todos = response.result;
    taskCountKeeper["incomplete"] = response.incomplete;
    taskCountKeeper["complete"] = response.complete;
    var incomplete = document.getElementById("incomplete");
    incomplete.innerHTML = `Ongoing Tasks(${taskCountKeeper["incomplete"]})`;
    var complete = document.getElementById("complete");
    complete.innerHTML = `Completed Tasks(${taskCountKeeper["complete"]})`
    if(todos.length){
        todos.forEach((todo, idx) => {
        if(todo.status === false){
            ongoing.innerHTML += `<div class=taskContent id=content${todo.id}>
                                  <span class=text-editor title='click to edit' onclick=editor(${todo.id})>${todo.content}</span>&nbsp
                                  <span class=task-status title='Ongoing' id=statusUpdate${todo.id} onclick=statusUpdator(${todo.id})>❌</span>
                                  </div>`
        }
        if(todo.status === true){
            completed.innerHTML += `<div class=taskContent id=content${todo.id}>
                                    <span class=text-editor title='click to edit' onclick=editor(${todo.id})>${todo.content}</span>&nbsp
                                    <span class=task-status title='Completed' id=deleteTask${todo.id} onclick=deleteTask(${todo.id})>✔</span>
                                    </div>`
        }
        });
    }
}

async function Addtask() {
    // Function responsible for adding a new task.

    var task = document.getElementById("content");
    if(task.value !== ""){
        try{
            let requestSettings = {"method": "POST", "headers": {"Content-Type": "application/json"}, "body": JSON.stringify({"content": task.value})}
            let addedTaskResponse = await fetchTodolist("/v1/todos/task", requestSettings);
            if(addedTaskResponse.success){
                var ongoing = document.getElementById("ongoingTasks");
                ongoing.insertAdjacentHTML("afterbegin",`<div class=taskContent id=content${addedTaskResponse.new_task.id}>
                                                         <span class=text-editor onclick=editor(${addedTaskResponse.new_task.id})>${addedTaskResponse.new_task.content}</span>
                                                         <span class=task-status title='Ongoing' id=statusUpdate${addedTaskResponse.new_task.id} onclick=statusUpdator(${addedTaskResponse.new_task.id})>❌</span>
                                                         </div>`);
                taskCountKeeper["incomplete"] += 1;
                var incomplete = document.getElementById("incomplete");
                incomplete.innerHTML = `Ongoing Tasks(${taskCountKeeper["incomplete"]})`;
            }
        }
        catch(error){
            console.error(error);
        }
        finally{
            document.getElementById("content").value = "";
        }
    }
    else{
        let alert = document.getElementById("alerts");
        alert.style.display = "block";
        alert.className = "alert-danger alerts"
        alert.innerHTML = "Task context cannot be empty.";
        setTimeout(() => {alert.style.display = "none"}, 3000)
    }   
}

async function statusUpdator(id){
    // Function responsible for updating status of each task and pushing the completed task to completed section.

    var taskcolumn = document.getElementById(`content${id}`);
    try{
        let updatedTaskResponse = await fetchTodolist(`/v1/todos/statusupdate/${id}`, {"method": "PUT", "headers": {"Content-Type": "application/json"}});
        if(updatedTaskResponse.success){
            var completedTasks = document.getElementById("completedTasks");
            completedTasks.insertAdjacentHTML("afterbegin", `<div class=taskContent id=content${id}>
                                                             <span class=text-editor onclick=editor(${id})>${updatedTaskResponse.task.content}</span>&nbsp
                                                             <span class=task-status title='Completed' id=deleteTask${id} onclick=deleteTask(${id})>✔</span>
                                                             </div>`);
            taskCountKeeper["incomplete"] -= 1;
            var incomplete = document.getElementById("incomplete");
            incomplete.innerHTML = `Ongoing Tasks(${taskCountKeeper["incomplete"]})`;
            taskCountKeeper["complete"] += 1;
            var complete = document.getElementById("complete");
            complete.innerHTML = `Completed Tasks(${taskCountKeeper["complete"]})`;
            taskcolumn.remove();
        }
        else{
            console.error("could not update the requested task");
        }
    }
    catch(error){
        console.error(error);
    }
}

async function deleteTask(id){
    // Function responsible for deleting the task from completed section.

    var completedTaskColumn = document.getElementById(`content${id}`);
    try{
        let deleteTaskResponse = await fetchTodolist(`/v1/todos/${id}`, {"method": "DELETE", "headers": {"Content-Type": "application/json"}});
        if(deleteTaskResponse.success){
            completedTaskColumn.remove();
            taskCountKeeper["complete"] -= 1;
            var complete = document.getElementById("complete");
            complete.innerHTML = `Completed Tasks(${taskCountKeeper["complete"]})`;
        }
    }
    catch(error){
        console.error(error);
    }
} 

function editor(id){
    // Function to edit the selected task.

    var editTask = document.getElementById(`content${id}`);
    editingContent[`content${id}`] = editTask.getElementsByTagName("span")[0].textContent;
    editingContent[`status${id}`] = editTask.getElementsByTagName("span")[1].textContent;
    editTask.innerHTML = `<div id=content${id}>
                          <input type=text id=editingContent${id} value='${editingContent[`content${id}`]}'/>
                          <span class='update-btn' id=updatebutton${id} onclick=updateContent(${id})>Update</span>
                          <span class='cancel-btn' onclick='updateContent(${id}, noUpdate=true)'>Cancel</span>
                          </div>`
    
    var taskContext = document.getElementById(`editingContent${id}`);
    taskContext.addEventListener("keyup", function(event){
        if(event.keyCode === 13){
            event.preventDefault();
            document.getElementById(`updatebutton${id}`).click();
        }
    })                 
}

async function updateContent(id, noUpdate=false){
    // Function to update the edited context.
    var content = document.getElementById(`editingContent${id}`).value;
    var todocolumn = document.getElementById(`content${id}`);
    if(noUpdate === true){
        if(editingContent['status'] === "❌"){
            todocolumn.innerHTML = `<div id=content${id}>
                                    <span class=text-editor onclick=editor(${id})>${editingContent[`content${id}`]}</span>
                                    <span class=task-status title='Ongoing' id=statusUpdate${id} onclick=statusUpdator(${id})>${editingContent[`status${id}`]}</span>
                                    </div>`;
        }
        else{
            todocolumn.innerHTML = `<div id=content${id}>
                                    <span class=text-editor onclick=editor(${id})>${editingContent[`content${id}`]}</span>
                                    <span class=task-status title='Completed' id=statusUpdate${id} onclick=statusUpdator(${id})>${editingContent[`status${id}`]}</span>
                                    </div>`;
        }
        delete editingContent.content;
        delete editingContent.status;
    }
    else if(content.length && content !== editingContent[`content${id}`]){
        let requestSettings = {method: "PUT", headers: {"Content-Type": "application/json"}, body: JSON.stringify({"content": content})};
        let updatedTaskContent = await fetchTodolist(`/v1/todos/${id}`, requestSettings);
        if(updatedTaskContent.success){
            if(updatedTaskContent.task.status === false){
                todocolumn.innerHTML = `<div id=content${id}>
                                        <span class=text-editor onclick=editor(${id})>${content}</span>
                                        <span class=task-status title='Ongoing' id=statusUpdate${id} onclick=statusUpdator(${id})>❌</span>
                                        </div>`
            }
            else if(updatedTaskContent.task.status === true){
                todocolumn.innerHTML = `<div id=content${id}>
                                        <span class=text-editor onclick=editor(${id})>${content}</span>
                                        <span class=task-status title='Completed' id=deleteTask${id} onclick=deleteTask(${id})>✔</span>
                                        </div>`
            }
        let alert = document.getElementById("alerts");
        alert.style.display = "block";
        alert.className = "alert-success alerts"
        alert.innerHTML = "Task \""+ editingContent[`content${id}`] +"\" updated";
        setTimeout(() => {alert.style.display = "none"}, 2000)
        delete editingContent.content;
        delete editingContent.status;
        }
    }
    else{
        let alert = document.getElementById("alerts");
        alert.style.display = "block";
        alert.className = "alert-danger alerts"
        alert.innerHTML = "Empty task or same task is found, no changes were made.";
        setTimeout(() => {alert.style.display = "none"}, 3000)
        if(editingContent['status'] === "❌"){
            todocolumn.innerHTML = `<div id=content${id}>
                                    <span class=text-editor onclick=editor(${id})>${editingContent[`content${id}`]}</span>
                                    <span class=task-status title='Ongoing' id=statusUpdate${id} onclick=statusUpdator(${id})>${editingContent[`status${id}`]}</span>
                                    </div>`;
        }
        else{
            todocolumn.innerHTML = `<div id=content${id}>
                                    <span class=text-editor onclick=editor(${id})>${editingContent[`content${id}`]}</span>
                                    <span class=task-status title='Completed' id=statusUpdate${id} onclick=statusUpdator(${id})>${editingContent[`status${id}`]}</span>
                                    </div>`;

        }
        delete editingContent.content;
        delete editingContent.status;
    }    
}

function logoutUser(){
    window.location.href = "/logout";
}