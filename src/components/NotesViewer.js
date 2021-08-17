import React, {useEffect, useState} from "react";
import {API} from "../Apiservice";


window.completedTasks = 0;
window.ongoingTasks = 0;

function NotesViewer(props){

    const [note, setNote] = useState("");
    const [newTask, setNewtask] = useState("");

    useEffect(()=>{
        countKeeper(window.completedTasks, window.ongoingTasks);
    },[])

    const countKeeper = (completedTasks, ongoingTasks) =>{
        props.note.tasks.forEach(task => {
            if(task.status === false){
                ongoingTasks += 1;
            }
            else if(task.status === true){
                completedTasks += 1;
            }
            window.ongoingTasks = ongoingTasks; 
            window.completedTasks = completedTasks; 
        })
        let ongoingTasksCount = document.getElementById("incompleteTaskCount");
        if(ongoingTasksCount) ongoingTasksCount.innerText = `❌ Ongoing (${window.ongoingTasks})`;
        let completedTasksCount = document.getElementById("completeTaskCount");
        if(completedTasksCount) completedTasksCount.innerHTML = `<span style={{color:"lightgreen"}} >✔ </span>Completed (${window.completedTasks})`;
    } 

    const expandTextarea = (event) =>{
        event.target.style.height="100px";
    }

    const noteContentarea = async(event) =>{
        if(note !== ""){
            try{
                let response = await API.UpdateNoteandTaskcontent({note_id: props.note.id, content: note});
                if(response.success === true){
                    setNote("");
                    let alerts = document.getElementById("alerts");
                    alerts.style.display = "block";
                    alerts.style.backgroundColor = "green";
                    alerts.innerText = "Note story updated";
                    setTimeout(()=>{
                        alerts.style.display = "none"
                    }, 1000)
                }
            }
            catch(error){
                console.error(error);
            }
        }
        else if(newTask !== ""){
            try{
                let response = await API.UpdateNoteandTaskcontent({note_id: props.note.id, description: newTask});
                if(response.success === true){
                    response.result.tasks.filter((task)=>{
                    if(task.description === newTask){
                        let incompleteTasks = document.getElementById("incompleteTasks");
                        
                        let taskStatusButton = document.createElement("span");
                        taskStatusButton.setAttribute("class", "modalIcon");
                        taskStatusButton.setAttribute("id", `span${task.task_id}`);
                        taskStatusButton.addEventListener("click", function(event){
                            checkStatus(props.note.id, task.task_id, event.target.innerText)
                        })
                        taskStatusButton.innerText = "❌";
                        
                        let taskDescription = document.createElement("textarea");
                        taskDescription.setAttribute("class", "taskTextarea");
                        taskDescription.setAttribute("id", `descript${task.task_id}`);
                        taskDescription.innerHTML = newTask;
                        taskDescription.addEventListener("blur", function(){
                            noteTaskarea(props.note.id, task.task_id)
                        })  
                        taskDescription.addEventListener("focusin", function(){
                            taskDescription.style.height = "100px";
                            incompleteTasks.scrollTop = incompleteTasks.scrollHeight;
                        })
                                                    
                        let taskDeleteButton = document.createElement("span");
                        taskDeleteButton.setAttribute("id", `trash${task.task_id}`);
                        taskDeleteButton.setAttribute("class", "modalIcon");
                        taskDeleteButton.innerText = "🗑️";
                        taskDeleteButton.addEventListener("click", function(){
                            taskRemover(props.note.id, task.task_id)
                        })
    
                        incompleteTasks.appendChild(taskStatusButton);
                        incompleteTasks.appendChild(taskDescription);
                        incompleteTasks.appendChild(taskDeleteButton);
                        incompleteTasks.scrollTop = incompleteTasks.scrollHeight;
    
                        let ongoingTasksCount = document.getElementById("incompleteTaskCount");
                        window.ongoingTasks = window.ongoingTasks + 1;
                        if(ongoingTasksCount) ongoingTasksCount.innerText = `❌ Ongoing (${window.ongoingTasks})`;
                    }})
                    setNewtask("");
                    let alerts = document.getElementById("alerts");
                    alerts.style.display = "block";
                    alerts.style.backgroundColor = "green";
                    alerts.innerText = "New task added.";
                    setTimeout(()=>{
                        alerts.style.display = "none"
                    }, 1000)
                }
            }
            catch(error){
                console.error(error);
            }
            
        }
    }

    const closeModal = () => {
        props.ModalClosed();
        window.completedTasks = 0;
        window.ongoingTasks = 0;
    }
    return(
        <React.Fragment>
            <br />
            <div className="alerts" id="alerts"></div>
            <button onClick={closeModal} className="modalCloseButton danger-btn">Close</button>
            <br />
            <div className="noteViewerGrid">
                <textarea className="noteContentTextarea" id="NoteContent" 
                          onBlur={noteContentarea} onChange={(e)=>setNote(e.target.value)}>{props.note.content}</textarea>
                <div className="ongoingTasks"  id="incompleteTaskCount"></div>
                <div className="categoryTasks" id="incompleteTasks">
                    {props.note.tasks && props.note.tasks.filter((task)=>task.status === false).map((task)=>{
                        return(
                        <React.Fragment>
                            <span id={`span${task.task_id}`} style={{textAlign: "center"}} className="modalIcon" 
                                    onClick={(e) => {checkStatus(props.note.id, task.task_id, e.target.innerText)}}>❌</span>
                            <textarea className="taskTextarea" 
                                        onBlur={()=>noteTaskarea(props.note.id, task.task_id)} 
                                        onSelect={expandTextarea} id={`descript${task.task_id}`}>{task.description}</textarea>
                            <span id={`trash${task.task_id}`} className="modalIcon" 
                                    onClick={()=>taskRemover(props.note.id, task.task_id)}>🗑️</span>
                        </React.Fragment>
                        )
                    })}
                </div>
                <br/>
                <div className="newTaskTextarea" style={{height: "55px"}}>
                    <textarea className="newtexareaPadding" style={{height: "50px"}} 
                              placeholder="Add new task here." value={newTask} 
                              onChange={(e)=>{setNewtask(e.target.value)}} ></textarea>
                              <button className="newNoteButtonAccept success-btn" onClick={noteContentarea} style={{fontSize:"10px"}}>Add</button>
                              <button className="newNoteButtonClear danger-btn" onClick={(e)=>setNewtask("")} style={{fontSize:"10px"}}>Cancel</button>
                </div>
                <br />
                <div className="completedTasks" id="completeTaskCount"></div>
                <div className="categoryTasks" id="completeTasks">
                    {props.note.tasks && props.note.tasks.filter((task)=>task.status === true).map((task)=>{
                        return(
                        <React.Fragment>
                            <span id={`span${task.task_id}`} className="modalIcon"
                                    onClick={(e) => {checkStatus(props.note.id, task.task_id, e.target.innerText)}}>✔</span>
                            <textarea className="taskTextarea" 
                                        onBlur={()=>noteTaskarea(props.note.id, task.task_id)} 
                                        onSelect={expandTextarea} id={`descript${task.task_id}`}>{task.description}</textarea>
                            <span id={`trash${task.task_id}`} className="modalIcon" 
                                    onClick={()=>taskRemover(props.note.id, task.task_id)}>🗑️</span>
                        </React.Fragment>
                        )
                    })}
                </div>
            </div>
        </React.Fragment>
    )
}

async function checkStatus(note_id, task_id, status){
    var response = {};
    try{
        if(status === '✔'){
            response = await API.StatusUpdate({note_id: note_id, task_id: task_id, status: false})
        }
        else if(status === '❌'){
            response = await API.StatusUpdate({note_id: note_id, task_id: task_id, status: true})
        }
    }
    catch(error){
        console.error(error);
    }
    if(response.success === true){
        let taskStatusButton = document.getElementById(`span${task_id}`);
        let taskdescript = document.getElementById(`descript${task_id}`);
        let trashButton = document.getElementById(`trash${task_id}`);
        taskStatusButton.remove();
        taskdescript.remove();
        trashButton.remove();
        if (taskStatusButton.innerText === "❌") {
            taskStatusButton.innerText = "✔";
            let completedTasks = document.getElementById("completeTasks");
            completedTasks.appendChild(taskStatusButton);
            completedTasks.appendChild(taskdescript);
            completedTasks.appendChild(trashButton);
            completedTasks.scrollTop = completedTasks.scrollHeight;
            let completedTasksCount = document.getElementById("completeTaskCount");
            window.completedTasks = window.completedTasks + 1;
            if(completedTasksCount) completedTasksCount.innerHTML = `<span style={{color:"lightgreen"}} >✔ </span>Completed (${window.completedTasks})`;
            // deducte by one
            let ongoingTasksCount = document.getElementById("incompleteTaskCount");
            window.ongoingTasks = window.ongoingTasks - 1;
            if(ongoingTasksCount) ongoingTasksCount.innerText = `❌ Ongoing (${window.ongoingTasks})`;
        
        }
        else if (taskStatusButton.innerText === "✔") {
            taskStatusButton.innerText = "❌";
            let ongoingTasks = document.getElementById("incompleteTasks")
            ongoingTasks.appendChild(taskStatusButton);
            ongoingTasks.appendChild(taskdescript);
            ongoingTasks.appendChild(trashButton);
            ongoingTasks.scrollTop = ongoingTasks.scrollHeight;
            let ongoingTasksCount = document.getElementById("incompleteTaskCount");
            window.ongoingTasks = window.ongoingTasks + 1;
            if(ongoingTasksCount) ongoingTasksCount.innerText = `❌ Ongoing (${window.ongoingTasks})`;
            // deducte by one
            let completedTasksCount = document.getElementById("completeTaskCount");
            window.completedTasks = window.completedTasks - 1;
            if(completedTasksCount) completedTasksCount.innerHTML = `<span style={{color:"lightgreen"}} >✔ </span>Completed (${window.completedTasks})`;
           
        }    
    }
}

async function taskRemover(note_id, task_id){
    try{
        let response = await API.RemoveTask({note_id: note_id, task_id: task_id});
        if(response.success === true){
            let taskStatusButton = document.getElementById(`span${task_id}`);
            let taskdescript = document.getElementById(`descript${task_id}`);
            let taskDeleteButton = document.getElementById(`trash${task_id}`);
            taskStatusButton.remove();
            taskdescript.remove();
            taskDeleteButton.remove();
            let alerts = document.getElementById("alerts");
            alerts.style.display = "block";
            alerts.style.backgroundColor = "green";
            alerts.innerText = "Task removed successfully";
            setTimeout(()=>{
                alerts.style.display = "none"
            }, 1000)
            if(taskStatusButton.innerText === "❌"){
                let ongoingTasksCount = document.getElementById("incompleteTaskCount");
                window.ongoingTasks = window.ongoingTasks - 1;
                if(ongoingTasksCount) ongoingTasksCount.innerText = `❌ Ongoing (${window.ongoingTasks})`;
            }
            else if(taskStatusButton.innerText === "✔"){
                let completedTasksCount = document.getElementById("completeTaskCount");
                window.completedTasks = window.completedTasks - 1;
                if(completedTasksCount) completedTasksCount.innerHTML = `<span style={{color:"lightgreen"}} >✔ </span>Completed (${window.completedTasks})`;
            }
        }
    }
    catch(error){
        console.error(error);
    }

}

async function noteTaskarea(note_id=0, task_id=0){
    let taskarea = document.getElementById(`descript${task_id}`);
    taskarea.style.height = "25px";
    if(taskarea.value !== ""){
        try{
            let response = await API.UpdateTaskDescription({note_id: note_id, task_id: task_id, description: taskarea.value});
            if(response.success === true){
                let alerts = document.getElementById("alerts");
                alerts.style.display = "block";
                alerts.style.backgroundColor = "green";
                alerts.innerText = "Task updated";
                setTimeout(()=>{
                    alerts.style.display = "none"
                }, 1000)
            }
        }
        catch(error){
            console.error(error);
        }
    }
}

export default NotesViewer;