import React from "react";
import {API} from "../Apiservice";


var task_counter = {counter: 1};
var task_array = [1];

function NotesCreator(props){
    const initalTaskAdder = (event) => {
        if(event.keyCode === 13 && !event.shiftKey){
            event.preventDefault();
            taskadder();
        }
        else if(event.keyCode === 13 && event.shiftKey){
            event.target.style.cssText = "height:50px;"
            return false;
        }
    }

    const logoutUser = () => {
        window.location.href = "/logout";
    }

    const profileViewer = () => {
        window.location.href = "/profile";
    }

    const addedNewNote = async() =>{
        let submit = document.getElementById("submit");
        submit.setAttribute("disabled", true);
        let response = await AddNote();
        props.newAddednote({content: response.new_note.content, id: response.new_note.id,  tasks: response.new_note.tasks});
    }
    
    return (
        <React.Fragment>
            <h1 style={{textAlign:"center"}}>Welcome to Notes</h1>
            <button onClick={profileViewer} className="primary-btn" 
                    style={{right:"15%", position:"absolute"}}>Profile</button>
            <button onClick={logoutUser} className="danger-btn" 
                    style={{right:"10%", position:"absolute"}}>Logout</button>

            <div style={{display:"block", height:"25px"}}></div>
            <div className="alerts" id="alerts"></div>
            <div style={{display:"block", height:"40px"}}></div>

            <h5 style={{textAlign:"center"}}>Add here.</h5>
            <div className="maingrid" id="maingrid">
                <input type="text" className="input" name="content" id="content"
                       placeholder="Title" required/>&nbsp;
                <div id="inputTask">
                    <textarea type="text" className="textarea" 
                              placeholder="List item" id="task1"
                              onKeyDown={initalTaskAdder}></textarea>
                    <span id="span1" className="spanClose" onClick={() => inputAndSpanRemover(1)}>❌</span>
                </div>
                <br />
                <button className="primary-btn" id="submit" title="click to add to notes" 
                        onClick={addedNewNote}>➕Add to notes</button>
            </div>
        </React.Fragment>
    )
}

function taskadder() {
    var inputdiv = document.getElementById("inputTask")
    task_counter['counter'] += 1
    task_array.push(task_counter['counter'])
    if (task_array.length >= 5) {
        let maingrid = document.getElementById("maingrid");
        maingrid.style.height = "310px";
        maingrid.scrollTop = maingrid.scrollHeight;
    }

    let inputBox = document.createElement("textarea");
    inputBox.className = "textarea";
    inputBox.setAttribute("id", `task${task_counter['counter']}`);
    inputBox.placeholder = "List item";

    let spanClose = document.createElement("span");
    spanClose.setAttribute("id", `span${task_counter['counter']}`);
    spanClose.setAttribute("class", "spanClose")
    spanClose.addEventListener("click", function(event){
        let id = event.target.id;
        let value = id.replace("span", "");
        inputAndSpanRemover(value);
        
    })
    spanClose.textContent = "❌";

    inputdiv.appendChild(inputBox);
    inputdiv.appendChild(spanClose);

    let input = document.getElementById(`task${task_counter['counter']}`);
    input.focus();
    input.select();
    input.addEventListener("keydown", function (event) {
        if (event.keyCode === 13 && !event.shiftKey) {
            event.preventDefault();
            taskadder();
        }
        else if (event.keyCode === 13 && event.shiftKey) {
            event.target.style.cssText = "height:50px;"
            return false;
        }
    })
}

function inputAndSpanRemover(id){
    if (task_array.length === 1) {
        let inputTasks = document.getElementById("inputTask");
        let textarea = document.createElement("textarea");
        textarea.className = "textarea";
        textarea.placeholder = 'List item';
        textarea.setAttribute("id", 'task1');

        let spanClose = document.createElement("span");
        spanClose.setAttribute("id", "span1");
        spanClose.className = "spanClose";
        spanClose.textContent = "❌";
        spanClose.addEventListener("click", function(event){
            inputAndSpanRemover(1);            
        })

        textarea.addEventListener("keydown", function (event) {
            if (event.keyCode === 13 && !event.shiftKey) {
                event.preventDefault();
                taskadder();
            }
            else if (event.keyCode === 13 && event.shiftKey) {
                this.value += "\n";
                return false;
            }
        })
        inputTasks.innerHTML = ""
        inputTasks.appendChild(textarea);
        inputTasks.appendChild(spanClose);
    }
    else{
        let inputBox = document.getElementById(`task${id}`);
        let spanClose = document.getElementById(`span${id}`);
        inputBox.remove();
        spanClose.remove();
        let idNumber = Number(id);

        let indexToRemove = task_array.indexOf(idNumber);
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
        task_array.forEach((element) => {
            let task_content = document.getElementById(`task${element}`).value;
            if (task_content !== "") {
                tasks.push({ "description": task_content });
            }
        })
        if(note !== ""){
            let response = await API.AddNoteAPI({"content": note, "tasks": tasks});
            if(response.success === true){
                let title = document.getElementById('content');
                title.value = "";
                let inputTasks = document.getElementById("inputTask");
                task_array.splice(0, task_array.length);
                task_counter['counter'] = 1;
                task_array = [1];

                let textarea = document.createElement("textarea");
                textarea.className = "textarea";
                textarea.placeholder = 'List item';
                textarea.setAttribute("id", 'task1');

                let spanClose = document.createElement("span");
                spanClose.setAttribute("id", "span1");
                spanClose.className = "spanClose";
                spanClose.textContent = "❌";
                spanClose.addEventListener("click", function(event){
                    inputAndSpanRemover(1);            
                })

                textarea.addEventListener("keydown", function (event) {
                    if (event.keyCode === 13 && !event.shiftKey) {
                        event.preventDefault();
                        taskadder();
                    }
                    else if (event.keyCode === 13 && event.shiftKey) {
                        this.value += "\n";
                        return false;
                    }
                })
                inputTasks.innerHTML = ""
                inputTasks.appendChild(textarea);
                inputTasks.appendChild(spanClose);
                let maingrid = document.getElementById("maingrid");
                maingrid.style.height = "auto";
            }
            else if(response.success === false){
                let alerts = document.getElementById("alerts");
                alerts.style.display = "block";
                alerts.style.backgroundColor = "red";
                alerts.innerText = "Token missing kindly login again.";
                setTimeout(function(){
                    alerts.innerText = "";
                    alerts.style.backgroundColor = "white";
                    alerts.style.display = "none";
                }, 3000)
            }
            return response;
        }
        else if(note === ""){
            let alerts = document.getElementById("alerts");
            alerts.style.display = "block";
            alerts.style.backgroundColor = "red";
            alerts.innerText = "Title is empty.";
            setTimeout(function(){
                alerts.innerText = "";
                alerts.style.backgroundColor = "white";
                alerts.style.display = "none";
            }, 3000)
        }
    }
    catch(error){
        console.error(error);
    }
    finally{
        let sendnote = document.getElementById("submit");
        sendnote.removeAttribute("disabled");
    }
}

export default NotesCreator;