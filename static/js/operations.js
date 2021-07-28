var task_counter = { counter: 1 };
var task_array = [1];

let input = document.getElementById("task1");
input.addEventListener("keydown", function (event) {
    if (event.keyCode == 13 && !event.shiftKey) {
        event.preventDefault();
        taskadder();
    }
    else if (event.keyCode == 13 && event.shiftKey) {
        this.style.cssText = "height:50px;"
        return false;
    }
})

let sendnote = document.getElementById("submit");
sendnote.addEventListener("click", function(){
    this.setAttribute("disabled", true);
    AddNote();
})


async function fetchTodoList() {
    try {
        let url = "/v2/todos";
        let requestSettings = {
            "method": "GET",
            "headers": { "Content-Type": "application/json" }
        }
        let response = await fetcher(url, requestSettings);
        if (response.success === true) {
            let displaygrid = document.getElementById("displaygrid");
            response.result.forEach((element) => {
                let displaycell = document.createElement("DIV");
                displaycell.className = "displaygridcell";
                displaycell.setAttribute("id", `displaycell${element.id}`);
                let contentarea = document.createElement("DIV");
                contentarea.innerText = element.content;
                contentarea.style.cursor = "pointer";
                contentarea.setAttribute("onclick", `modelRender(${JSON.stringify(element)})`)
                displaycell.appendChild(contentarea);
                let completedTasks = 0;
                let inCompletedTasks = 0;
                element.tasks.forEach((task) => {
                    if (task.status == true) {
                        completedTasks += 1;
                    }
                    else if (task.status == false) {
                        inCompletedTasks += 1;
                    }
                })
                let deatailArea = document.createElement("div");
                deatailArea.innerHTML = `<span class='danger-btn' onclick=NoteRemover(${element.id})>🗑️</span>
                                             <span>Status: ❌Ongoing(${inCompletedTasks}) ✔Completed(${completedTasks})</span>`
                displaycell.appendChild(deatailArea);
                displaygrid.appendChild(displaycell);
            })
        }
    }
    catch (error) {
        console.error(error);
    }
}

fetchTodoList()

async function modelRender(result) {
    let modal = document.getElementById("modal");
    modal.innerHTML += "<h1 class='Modalclose' onclick=closeModal()>&times</h1>"
    let maingrid = document.createElement("div");
    maingrid.className = "maingrid";
    maingrid.style.cssText = "border:3px solid white;padding:10px 10px 10px;background-color:black;";
    //count
    var taskCounterKeeper = { ongoing: 0, completed: 0 };
    // title modal
    let title = document.createElement("textarea");
    title.setAttribute("id", `modalTitle${result.id}`);
    title.setAttribute("class", "modalTextarea");
    title.setAttribute("placeholder", "Title")
    title.style.cssText = "background-color:black;color:white;";
    title.value = result.content;
    title.addEventListener("change", function (event) {
        if (this.value !== "") {
            event.preventDefault();
            this.blur();
            updateNoteTitle(note_id = result.id, value = title.value);
        }
        else if (event.keyCode === 13) {
            this.style.height = `${this.scrollHeight}px`;
            return false;
        }
    })
    title.addEventListener("click", function(){
        this.style.height = `${this.scrollHeight}px`;
        this.selectionStart = this.selectionEnd = this.value.length;
    })
    title.addEventListener("blur", function(){
        this.style.cssText = "height:40px";
    })

    maingrid.appendChild(title);
    modal.appendChild(maingrid);
    // end title
    // task categories
    let taskCategory = document.createElement("div");
    taskCategory.className = "taskcategoryModal";

    let inCompletedTasksCount = document.createElement("label");
    inCompletedTasksCount.className = "modalLabelCount";
    inCompletedTasksCount.setAttribute("id", "inCompletedTasksCountModal")
    taskCategory.appendChild(inCompletedTasksCount);
    let ongoingTasks = document.createElement("div");
    ongoingTasks.setAttribute("id", "ongoingModal");
    ongoingTasks.className = "categoryModal";
    taskCategory.appendChild(ongoingTasks);

    let inputTextarea = document.createElement("textarea");
    inputTextarea.placeholder = "List item";
    inputTextarea.className = "modalTextarea";
    inputTextarea.id = "taskmodal1";
    inputTextarea.style.cssText = "width:100%;border-width: 0 0 1px;border-color: blue;"
    inputTextarea.addEventListener("change", function (event) {
            if (inputTextarea.value !== "") {
                event.preventDefault();
                sendToTaskAdder(note_id = result.id, value = inputTextarea.value);
                this.value = "";
                return false;
            }
            else if (event.keyCode === 13) {
                this.style.height = `50px`;
                return false;
            }
    })
    inputTextarea.addEventListener("blur", function(){
        this.style.cssText = "height:40px";
    })
    
    let spanarea = document.createElement("span");
    spanarea.id = "spanmodal1";
    spanarea.innerText = "🗑️";
    spanarea.style.cssText = "color: white;cursor: pointer;font-size: xx-large;text-align:center;"
    spanarea.addEventListener("click", function (event) {
        event.preventDefault();
        inputTextarea.value = "";
        inputTextarea.select();
        inputTextarea.focus();
    })

    let addNewTaskDiv = document.createElement("div");
    addNewTaskDiv.className = "modalNewItem"
    addNewTaskDiv.appendChild(inputTextarea);
    addNewTaskDiv.appendChild(spanarea);

    taskCategory.appendChild(addNewTaskDiv);

    let completedTasksCount = document.createElement("label");
    completedTasksCount.className = "modalLabelCount";
    completedTasksCount.setAttribute("id", "completedTasksCountModal")
    taskCategory.appendChild(completedTasksCount)
    let completedTasks = document.createElement("div");
    completedTasks.setAttribute("id", "completedModal");
    completedTasks.className = "categoryModal";
    taskCategory.appendChild(completedTasks);
    maingrid.appendChild(taskCategory)

    result.tasks.forEach((element) => {
        if (element.status === false) {
            let checker = document.createElement("div");
            checker.innerText = "❌";
            checker.className = "modalIcon"
            checker.setAttribute("id", `checkerid${element.task_id}`)
            checker.setAttribute("onclick", `checkerfunct(note_id=${result.id}, task_id=${element.task_id}, status='❌')`);
            let taskdesc = document.createElement("textarea");
            taskdesc.value = element.description;
            taskdesc.setAttribute("id", `taskdescid${element.task_id}`)
            taskdesc.className = "modalTextarea";
            taskdesc.addEventListener("change", function (event){
                if (taskdesc.value !== "") {
                    event.preventDefault();
                    taskdesc.blur();
                    updateTododesc(note_id = result.id, todo_id = element.task_id, value = taskdesc.value);
                }
                else if (event.keyCode === 13) {
                    this.style.height = `${this.scrollHeight}px`;
                    return false;
                }
            })
            taskdesc.addEventListener("click", function(){
                this.style.height = `${this.scrollHeight}px`;
                this.selectionStart = this.selectionEnd = this.value.length;
            })
            taskdesc.addEventListener("blur", function(){
                this.style.cssText = "height:40px";
            })
            let trash = document.createElement("div");
            trash.innerText = "🗑️"
            trash.className = "modalIcon";
            trash.setAttribute("id", `trashcanid${element.task_id}`);
            trash.setAttribute("onclick", `trashfunct(note_id=${result.id}, task_id=${element.task_id})`);
            ongoingTasks.appendChild(checker);
            ongoingTasks.appendChild(taskdesc);
            ongoingTasks.appendChild(trash);
            taskCounterKeeper['ongoing'] += 1;
        }
        else if (element.status === true) {
            let checker = document.createElement("div");
            checker.innerText = "✔";
            checker.className = "modalIcon";
            checker.setAttribute("id", `checkerid${element.task_id}`)
            checker.setAttribute("onclick", `checkerfunct(note_id=${result.id}, task_id=${element.task_id}, status='✔')`);
            let taskdesc = document.createElement("textarea");
            taskdesc.value = element.description;
            taskdesc.setAttribute("id", `taskdescid${element.task_id}`)
            taskdesc.className = "modalTextarea";
            taskdesc.addEventListener("keydown", function (event) {
                if (taskdesc.value !== "") {
                    event.preventDefault();
                    taskdesc.blur();
                    updateTododesc(note_id = result.id, todo_id = element.task_id, value = taskdesc.value);
                }
                else if (event.keyCode === 13) {
                    this.style.height = `${this.scrollHeight}px`;
                    return false;
                }
            })
            taskdesc.addEventListener("click", function(){
                this.style.height = `${this.scrollHeight}px`;
                this.selectionStart = this.selectionEnd = this.value.length;
            })
            taskdesc.addEventListener("blur", function(){
                this.style.cssText = "height:40px";
            })
            let trash = document.createElement("div");
            trash.innerText = "🗑️"
            trash.className = "modalIcon";
            trash.setAttribute("id", `trashcanid${element.task_id}`);
            trash.setAttribute("onclick", `trashfunct(note_id=${result.id},task_id=${element.task_id})`);
            completedTasks.appendChild(checker);
            completedTasks.appendChild(taskdesc);
            completedTasks.appendChild(trash);
            taskCounterKeeper['completed'] += 1;
        }
    })
    if (taskCounterKeeper['ongoing'] <= 3) {
        ongoingTasks.style.height = "150px";
    }
    else {
        ongoingTasks.style.height = "220px";
    }
    if (taskCounterKeeper['completed'] <= 3) {
        completedTasks.style.height = "150px";
    }
    else {
        completedTasks.style.height = "220px";
    }
    inCompletedTasksCount.innerText = `❌Ongoing(${taskCounterKeeper['ongoing']})`;
    completedTasksCount.innerText = `✔Completed(${taskCounterKeeper['completed']})`;
    modal.style.display = "block";
}
async function updateNoteTitle(note_id, value) {
    let url = `/v2/todos/note/${note_id}`;
    let requestSettings = {
        "method": "PUT",
        "headers": { "Content-Type": "application/json" },
        "body": JSON.stringify({ "content": value })
    };
    let response = await fetcher(url, requestSettings);
    if (response.success === true) {
        let displaycell = document.getElementById(`displaycell${response.result.id}`);
        displaycell.children[0].innerText = response.result.content;
        displaycell.children[0].setAttribute("onclick", `modelRender(${JSON.stringify(response.result)})`);
    }
}

async function updateTododesc(note_id, todo_id, value) {
    let url = `/v2/todos/note/${note_id}/todo/${todo_id}`;
    let requestSettings = {
        "method": "PUT",
        "headers": { "Content-Type": "application/json" },
        "body": JSON.stringify({ "description": value })
    };
    let response = await fetcher(url, requestSettings);
    if (response.success === true) {
        let displaycell = document.getElementById(`displaycell${response.result.id}`);
        displaycell.children[0].innerText = response.result.content;
        displaycell.children[0].setAttribute("onclick", `modelRender(${JSON.stringify(response.result)})`);
    }
}

async function sendToTaskAdder(note_id, value) {
    let url = `/v2/todos/note/${note_id}`;
    let requestSettings = {
        "method": "PUT",
        "headers": { "Content-Type": "application/json" },
        "body": JSON.stringify({ "description": value })
    };

    let response = await fetcher(url, requestSettings);
    if (response.success === true) {
        let ongoingTasks = document.getElementById("ongoingModal");
        response.result.tasks.forEach((element) => {
            if (element.description === value) {
                let checker = document.createElement("div");
                checker.innerText = "❌";
                checker.className = "modalIcon";
                checker.setAttribute("id", `checkerid${element.task_id}`)
                checker.setAttribute("onclick", `checkerfunct(note_id=${note_id}, task_id=${element.task_id}, status='❌')`);
                let taskdesc = document.createElement("textarea");
                taskdesc.value = value;
                taskdesc.setAttribute("id", `taskdescid${element.task_id}`)
                taskdesc.className = "modalTextarea"
                taskdesc.addEventListener("change", function (event){
                    if (taskdesc.value !== "") {
                        event.preventDefault();
                        taskdesc.blur();
                        updateTododesc(note_id = result.id, todo_id = element.task_id, value = taskdesc.value);
                    }
                    else if (event.keyCode === 13) {
                        this.style.height = `${this.scrollHeight}px`;
                        return false;
                    }
                })
                taskdesc.addEventListener("click", function(){
                    this.style.height = `${this.scrollHeight}px`;
                    this.selectionStart = this.selectionEnd = this.value.length;
                })
                taskdesc.addEventListener("blur", function(){
                    this.style.cssText = "height:40px";
                })
                let trash = document.createElement("div");
                trash.innerText = "🗑️"
                trash.className = "modalIcon";
                trash.setAttribute("id", `trashcanid${element.task_id}`);
                trash.setAttribute("onclick", `trashfunct(note_id=${note_id}, task_id=${element.task_id})`);
                ongoingTasks.appendChild(checker);
                ongoingTasks.appendChild(taskdesc);
                ongoingTasks.appendChild(trash);
                ongoingTasks.scrollTop = ongoingTasks.scrollHeight;
            }
        })
        let displaycell = document.getElementById(`displaycell${response.result.id}`);
        displaycell.children[0].setAttribute("onclick", `modelRender(${JSON.stringify(response.result)})`);
        let completedTasks = 0;
        let inCompletedTasks = 0;
        response.result.tasks.forEach((task) => {
            if (task.status == true) {
                completedTasks += 1;
            }
            else if (task.status == false) {
                inCompletedTasks += 1;
            }
        })
        if (inCompletedTasks <= 3) {
            ongoingTasks.style.height = "150px";
        }
        else {
            ongoingTasks.style.height = "220px";
        }
        let inCompletedTasksCount = document.getElementById("inCompletedTasksCountModal");
        let completedTasksCount = document.getElementById("completedTasksCountModal");
        inCompletedTasksCount.innerText = `❌Ongoing(${inCompletedTasks})`;
        completedTasksCount.innerText = `✔Completed(${completedTasks})`;
        let deatailArea = document.createElement("div");
        deatailArea.innerHTML = `<span class='danger-btn' onclick=NoteRemover(${response.result.id})>🗑️</span>
                                     <span>Status: ❌Ongoing(${inCompletedTasks}) ✔Completed(${completedTasks})</span>`
        displaycell.children[1].innerHTML = "";
        displaycell.children[1].appendChild(deatailArea);
    }

}

async function checkerfunct(note_id, task_id, status) {
    let url = `/v2/todos/note/${note_id}/todo/${task_id}/update`;
    if (status === '❌') {
        var requestSettings = {
            "method": "PUT",
            "headers": { "Content-Type": "application/json" },
            "body": JSON.stringify({ "status": true })
        };
    }
    else if (status === '✔') {
        var requestSettings = {
            "method": "PUT",
            "headers": { "Content-Type": "application/json" },
            "body": JSON.stringify({ "status": false })
        };
    }
    let response = await fetcher(url, requestSettings);
    if (response.success === true) {
        let checker = document.getElementById(`checkerid${task_id}`);
        let taskdesc = document.getElementById(`taskdescid${task_id}`);
        let trashcan = document.getElementById(`trashcanid${task_id}`);
        checker.remove();
        taskdesc.remove();
        trashcan.remove();
        if (checker.innerText === "❌") {
            checker.innerText = "✔";
            checker.setAttribute("onclick", `checkerfunct(note_id=${note_id}, task_id=${task_id}, status='✔')`);
            let completedTasks = document.getElementById("completedModal");
            completedTasks.appendChild(checker);
            completedTasks.appendChild(taskdesc);
            completedTasks.appendChild(trashcan);
            completedTasks.scrollTop = completedTasks.scrollHeight;
        }
        else if (checker.innerText === "✔") {
            checker.innerText = "❌";
            checker.setAttribute("onclick", `checkerfunct(note_id=${note_id}, task_id=${task_id}, status='❌')`);
            let ongoingTasks = document.getElementById("ongoingModal")
            ongoingTasks.appendChild(checker);
            ongoingTasks.appendChild(taskdesc);
            ongoingTasks.appendChild(trashcan);
            ongoingTasks.scrollTop = ongoingTasks.scrollHeight;
        }
        let displaycell = document.getElementById(`displaycell${response.result.id}`);
        displaycell.children[0].setAttribute("onclick", `modelRender(${JSON.stringify(response.result)})`);
        let completedTasks = 0;
        let inCompletedTasks = 0;
        response.result.tasks.forEach((task) => {
            if (task.status === true) {
                completedTasks += 1;
            }
            else if (task.status === false) {
                inCompletedTasks += 1;
            }
        })
        let ongoingTasks = document.getElementById("ongoingModal");
        if (inCompletedTasks <= 3) {
            ongoingTasks.style.height = "150px";
        }
        else {
            ongoingTasks.style.height = "220px";
        }
        let completedmodalTasks = document.getElementById("completedModal");
        if (completedTasks <= 3) {
            completedmodalTasks.style.height = "150px";
        }
        else {
            completedmodalTasks.style.height = "220px";
        }
        let inCompletedTasksCount = document.getElementById("inCompletedTasksCountModal");
        let completedTasksCount = document.getElementById("completedTasksCountModal");
        inCompletedTasksCount.innerText = `❌Ongoing(${inCompletedTasks})`;
        completedTasksCount.innerText = `✔Completed(${completedTasks})`;

        let deatailArea = document.createElement("div");
        deatailArea.innerHTML = `<span class='danger-btn' onclick=NoteRemover(${response.result.id})>🗑️</span>
                                     <span>Status: ❌Ongoing(${inCompletedTasks}) ✔Completed(${completedTasks})</span>`
        displaycell.children[1].innerHTML = "";
        displaycell.children[1].appendChild(deatailArea);
    }
}

async function trashfunct(note_id, task_id) {
    console.log(note_id, task_id);
    let url = `/v2/todos/note/${note_id}/todo/${task_id}`;
    let requestSettings = {
        "method": "DELETE",
        "headers": { "Content-Type": "application/json" }
    };
    let response = await fetcher(url, requestSettings);
    if (response.success === true) {
        let checker = document.getElementById(`checkerid${task_id}`);
        let taskdesc = document.getElementById(`taskdescid${task_id}`);
        let trashcan = document.getElementById(`trashcanid${task_id}`);
        checker.remove();
        taskdesc.remove();
        trashcan.remove();
        let displaycell = document.getElementById(`displaycell${response.result.id}`);
        displaycell.children[0].setAttribute("onclick", `modelRender(${JSON.stringify(response.result)})`);
        let completedTasks = 0;
        let inCompletedTasks = 0;
        response.result.tasks.forEach((task) => {
            if (task.status == true) {
                completedTasks += 1;
            }
            else if (task.status == false) {
                inCompletedTasks += 1;
            }
        })
        let ongoingTasks = document.getElementById("ongoingModal");
        if (inCompletedTasks <= 3) {
            ongoingTasks.style.height = "150px";
        }
        else {
            ongoingTasks.style.height = "220px";
        }
        let completedmodalTasks = document.getElementById("completedModal");
        if (completedTasks <= 3) {
            completedmodalTasks.style.height = "150px";
        }
        else {
            completedmodalTasks.style.height = "220px";
        }
        let inCompletedTasksCount = document.getElementById("inCompletedTasksCountModal");
        let completedTasksCount = document.getElementById("completedTasksCountModal");
        inCompletedTasksCount.innerText = `❌Ongoing(${inCompletedTasks})`;
        completedTasksCount.innerText = `✔Completed(${completedTasks})`;
        let deatailArea = document.createElement("div");
        deatailArea.innerHTML = `<span class='danger-btn' onclick=NoteRemover(${response.result.id})>🗑️</span>
                                     <span>Status: ❌Ongoing(${inCompletedTasks}) ✔Completed(${completedTasks})</span>`
        displaycell.children[1].innerHTML = "";
        displaycell.children[1].appendChild(deatailArea);
    }
}

function closeModal() {
    let modal = document.getElementById("modal");
    modal.innerHTML = "";
    modal.style.display = "none";
}

async function NoteRemover(id) {
    let displaycell = document.getElementById(`displaycell${id}`);
    let url = `/v2/todos/note/${id}`;
    let requestSettings = {
        "method": "DELETE",
        "headers": { "Content-Type": "application/json" }
    }
    let response = await fetcher(url, requestSettings);
    if (response.success === true) {
        displaycell.remove();
    }
}

async function TaskRemover(rownumber, noteid, taskid) {
    let textarea = document.getElementById(`taskModal${rownumber}`);
    let spanClose = document.getElementById(`spanModal${rownumber}`);
    let url = `/v2/todos/note/${noteid}/todo/${taskid}`;
    let requestSettings = {
        "method": "DELETE",
        "headers": { "Content-Type": "application/json" }
    }
    let response = await fetcher(url, requestSettings);
    if (response.success === true) {
        textarea.remove();
        spanClose.remove();
        let displaycell = document.getElementById(`displaycell${response.result.id}`);
        displaycell.children[0].setAttribute("onclick", `modelRender(${JSON.stringify(response.result)})`);
        let completedTasks = 0;
        let inCompletedTasks = 0;
        response.result.tasks.forEach((task) => {
            if (task.status == true) {
                completedTasks += 1;
            }
            else if (task.status == false) {
                inCompletedTasks += 1;
            }
        })
        let deatailArea = document.createElement("div");
        deatailArea.innerHTML = `<span class='danger-btn' onclick=NoteRemover(${response.result.id})>🗑️</span>
                                     <span>Status: ❌Ongoing(${inCompletedTasks}) ✔Completed(${completedTasks})</span>`
        displaycell.children[1].innerHTML = "";
        displaycell.children[1].appendChild(deatailArea);

    }
}


async function fetcher(url, requestSettings) {
    try {
        let request = await fetch(url, requestSettings);
        let response = await request.json();
        return response;
    }
    catch (error) {
        console.error(error);
    }
}

function taskadder() {
    var inputdiv = document.getElementById("inputTask")
    task_counter['counter'] += 1
    task_array.push(task_counter['counter'])
    if (task_array.length >= 5) {
        let maingrid = document.getElementById("maingrid");
        maingrid.style.height = "40%";
        maingrid.scrollTop = maingrid.scrollHeight;
    }

    let inputBox = document.createElement("textarea");
    inputBox.type = "text";
    inputBox.className = "textarea";
    inputBox.setAttribute("id", `task${task_counter['counter']}`);
    inputBox.placeholder = "List item";

    let spanClose = document.createElement("span");
    spanClose.setAttribute("id", `span${task_counter['counter']}`);
    spanClose.setAttribute("onclick", `inputAndSpanRemover(${task_counter['counter']})`);
    spanClose.setAttribute("class", "spanClose")
    spanClose.textContent = "❌";

    inputdiv.appendChild(inputBox);
    inputdiv.appendChild(spanClose);

    let input = document.getElementById(`task${task_counter['counter']}`);
    input.focus();
    input.select();
    input.addEventListener("keydown", function (event) {
        if (event.keyCode == 13 && !event.shiftKey) {
            event.preventDefault();
            taskadder();
        }
        else if (event.keyCode == 13 && event.shiftKey) {
            this.style.cssText = "height:50px;"
            return false;
        }
    })
}

function inputAndSpanRemover(id) {
    if (task_array.length === 1) {
        let inputTasks = document.getElementById("inputTask");
        let textarea = document.createElement("textarea");
        textarea.type = "text";
        textarea.className = "textarea";
        textarea.placeholder = 'List item';
        textarea.setAttribute("id", 'task1');
        //textarea.value = task_array[0];

        let spanClose = document.createElement("span");
        spanClose.setAttribute("id", "span1");
        spanClose.className = "spanClose";
        spanClose.setAttribute("onclick", "inputAndSpanRemover(1)");
        spanClose.textContent = "❌";

        textarea.addEventListener("keydown", function (event) {
            if (event.keyCode == 13 && !event.shiftKey) {
                event.preventDefault();
                taskadder();
            }
            else if (event.keyCode == 13 && event.shiftKey) {
                this.value += "\n";
                return false;
            }
        })
        inputTasks.innerHTML = ""
        inputTasks.appendChild(textarea);
        inputTasks.appendChild(spanClose);
    }
    else {
        let inputBox = document.getElementById(`task${id}`);
        let spanClose = document.getElementById(`span${id}`);
        inputBox.remove();
        spanClose.remove();
        let indexToRemove = task_array.indexOf(id);
        task_array.splice(indexToRemove, 1);
    }
    if (task_array.length < 5) {
        let maingrid = document.getElementById("maingrid");
        maingrid.style.height = "auto";
    }

}

async function AddNote() {
    try {
        let note = document.getElementById("content").value;
        let tasks = [];
        task_array.forEach((element, idx) => {
            let task_content = document.getElementById(`task${element}`).value;
            if (task_content !== "") {
                tasks.push({ "description": task_content });
            }
            console.log(tasks);
        })

        let url = "/v2/todos/note";
        let requestSettings = {
            "method": "POST",
            "headers": { "Content-Type": "application/json" },
            "body": JSON.stringify({ "content": note, "tasks": tasks })
        }
        if (note !== "") {
            let response = await fetcher(url, requestSettings);
            if (response.success === true) {
                let displaygrid = document.getElementById("displaygrid");
                let displaycell = document.createElement("DIV");
                displaycell.className = "displaygridcell";
                displaycell.setAttribute("id", `displaycell${response.new_note.id}`);
                let contentarea = document.createElement("DIV");
                contentarea.innerText = response.new_note.content;
                contentarea.style.cursor = "pointer";
                contentarea.setAttribute("onclick", `modelRender(${JSON.stringify(response.new_note)})`)
                displaycell.appendChild(contentarea);
                let completedTasks = 0;
                let inCompletedTasks = 0;
                response.new_note.tasks.forEach((task) => {
                    if (task.status == true) {
                        completedTasks += 1;
                    }
                    else if (task.status == false) {
                        inCompletedTasks += 1;
                    }
                })
                let deatailArea = document.createElement("div");
                deatailArea.innerHTML = `<span class='danger-btn' onclick=NoteRemover(${response.new_note.id})>🗑️</span>
                                             <span>Status: ❌Ongoing(${inCompletedTasks}) ✔Completed(${completedTasks})</span>`
                displaycell.appendChild(deatailArea);
                displaygrid.insertAdjacentElement("afterbegin", displaycell);

                let title = document.getElementById('content');
                title.value = "";
                let inputTasks = document.getElementById("inputTask");
                task_array.splice(0, task_array.length);
                task_counter['counter'] = 1;
                task_array = [1];

                let textarea = document.createElement("textarea");
                textarea.type = "text";
                textarea.className = "textarea";
                textarea.placeholder = 'List item';
                textarea.setAttribute("id", 'task1');

                let spanClose = document.createElement("span");
                spanClose.setAttribute("id", "span1");
                spanClose.className = "spanClose";
                spanClose.setAttribute("onclick", "inputAndSpanRemover(1)");
                spanClose.textContent = "❌";

                textarea.addEventListener("keydown", function (event) {
                    if (event.keyCode == 13 && !event.shiftKey) {
                        event.preventDefault();
                        taskadder();
                    }
                    else if (event.keyCode == 13 && event.shiftKey) {
                        this.value += "\n";
                        return false;
                    }
                })
                inputTasks.innerHTML = ""
                inputTasks.appendChild(textarea);
                inputTasks.appendChild(spanClose);
                let maingrid = document.getElementById("maingrid");
                maingrid.style.height = "auto";
                console.log("done");
            }
        }else{
            let alerts = document.getElementById("alerts");
            alerts.style.display = "block";
            alerts.innerHTML = "<span>Title is empty.</span>";
            setTimeout(function(){
                alerts.innerText = "";
                alerts.style.display = "none";
            }, 3000)
        }
    }
    catch (error) {
        console.error(error);
    }
    finally{
        let sendnote = document.getElementById("submit");
        sendnote.removeAttribute("disabled");
    }
}
function logoutUser() {
    window.location.href = "/logout";
}

async function deleteUser(){
    let url = "/profile";
    let requestSettings = {
        "method": "POST",
        "headers": { "Content-Type": "application/json" }};
    let response = await fetcher(url, requestSettings);
    if(response.success === true){
        logoutUser();
    }
    }
    