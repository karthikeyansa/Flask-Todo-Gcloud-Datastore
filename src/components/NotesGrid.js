import React, { useEffect, useState } from "react";
import {API} from "../Apiservice";


function NotesGrid(props){
    const [notes, setNotes] = useState(props.Newnote);

    useEffect(()=>{
        async function notesChecker(){
            try{
                if(props.Newnote){
                    setNotes([props.Newnote, ...notes]);
                }
                else{
                    let response = await API.GetNotes();
                    if(response.success === true){
                        setNotes(response.result);
                    }
                }
            }
            catch(error){
                console.error(error);
            }
        }
        notesChecker();   
    }, [props.Newnote])

    const selectedNote = (note) => (event) =>{
        props.NoteSelected(note);
    } 

    const NoteRemover = (id) => (event) =>{
        async function deleteNote(){
            try{
                let response = await API.DeleteNote({id : id});
                if(response.success === true){
                    let displaycellRemoved = document.getElementById(id);
                    displaycellRemoved.style.display = "none";
                }
            }
            catch(error){
                console.error(error);
            }
        }
        deleteNote();
    }

    return(
        <React.Fragment>
            <div style={{display: "block",height: "100px"}}></div>
            <div className="displaygrid" id="displaygrid">
                {notes && notes.map((note)=>{
                    let completedTasks = 0;
                    let inCompletedTasks = 0;
                    return(
                    <div key={note.id}>
                        <div className="displaygridcell" id={note.id}>
                            <div style={{cursor: "pointer"}} onClick={selectedNote(note)}>
                                {note.content}
                            </div>
                                {note.tasks && note.tasks.forEach((task)=>{
                                    if (task.status === true){
                                        completedTasks += 1;
                                    }
                                    else if (task.status === false){
                                        inCompletedTasks += 1;
                                    }                     
                                })}
                            <div>
                                <span className="danger-btn" onClick={NoteRemover(note.id)}>🗑️</span>&nbsp;
                                <span>Status: ❌Ongoing({inCompletedTasks}) <span style={{color: "lightgreen"}} >✔</span>Completed({completedTasks})</span>
                            </div>
                        </div>
                    </div>
                    )
                })}
            </div>
        </React.Fragment>
    )
}

export default NotesGrid;