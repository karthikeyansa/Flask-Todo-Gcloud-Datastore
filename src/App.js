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
  const [noteUpdate, setNoteupdate] = useState(null);
  const [allNotesData, setAllnotesData] = useState([]);

  const NoteSelected = (note) =>{
    setNote(note);
    setNotesgrid(false);
    setNotescreator(false);
    setNoteviewer(true);
    setNoteupdate(null);
  }
  const ModalClosed = (updatedNote) => {
    setNote(null);
    setNotesgrid(true);
    setNotescreator(true);
    setNoteviewer(false);
    setNewNote(null);
    setNoteupdate(updatedNote);
  }
  const newAddednote = (note) =>{
    setNewNote(note)
  }

  const notesData = (notes) => {
    setAllnotesData(notes);
  }

  return (
    <React.Fragment>
      {notesCreator && <NotesCreator newAddednote={newAddednote} />}
      {noteViewer && <NotesViewer note={note} ModalClosed={ModalClosed}/>}
      {notesGrid && <NotesGrid NoteSelected={NoteSelected} Newnote={newNote}
                               pushUpdatedNote={noteUpdate} notesData={notesData} allNotesData={allNotesData}/>}
    </React.Fragment>
  );
}

export default App;
