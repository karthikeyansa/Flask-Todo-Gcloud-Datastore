import React, {useState} from "react";
import NotesCreator from "./components/NotesCreator";
import NotesGrid from "./components/NotesGrid";
import NotesViewer from "./components/NotesViewer";

function App() {
  const [note, setNote] = useState(null);
  const [notesGrid, setNotesgrid] = useState(true);
  const [notesCreator, setNotescreator] = useState(true);
  const [noteViewer, setNoteviewer] = useState(false);
  const [newNote, setNewNote] = useState(null);

  const NoteSelected = (note) =>{
    setNote(note);
    setNotesgrid(false);
    setNotescreator(false);
    setNoteviewer(true);
  }
  const ModalClosed = () => {
    setNote(null);
    setNotesgrid(true);
    setNotescreator(true);
    setNoteviewer(false);
    setNewNote(null);
  }
  const newAddednote = (note) =>{
    setNewNote(note)
  }

  return (
    <React.Fragment>
      {notesCreator && <NotesCreator newAddednote={newAddednote} />}
      {noteViewer && <NotesViewer note={note} ModalClosed={ModalClosed}/>}
      {notesGrid && <NotesGrid NoteSelected={NoteSelected} Newnote={newNote}/>}
    </React.Fragment>
  );
}

export default App;
