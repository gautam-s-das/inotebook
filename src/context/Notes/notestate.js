import NoteContext from "./notecontext";
import { useState } from "react";
const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesinitial = []
  const [notes, setNotes] = useState(notesinitial);

  //get all note
  const getNotes = async () => {
    //api call for add note
    const response = await fetch(`${host}/api/auth/fetchallnotes`, {
     method: "GET",
     headers: {
       "Content-Type": "application/json",
       "auth-token":
         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU3YWE0OGU2YTBlNmQ4YWJmNTYyOTEyIn0sImlhdCI6MTcwMjcwMTAwMH0.m2ZYKleniJWf4OisaRNZ-3pTkZMFRoJcK4ek8IXve50",
     },
    });
    const json=await response.json();
    console.log(json);
    setNotes(json)
 };
  //Add a note
  const addNote = async (title, description, tag) => {
     //api call for add note
     const response = await fetch(`${host}/api/auth/addnotes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU3YWE0OGU2YTBlNmQ4YWJmNTYyOTEyIn0sImlhdCI6MTcwMjcwMTAwMH0.m2ZYKleniJWf4OisaRNZ-3pTkZMFRoJcK4ek8IXve50",
      },
      body: JSON.stringify({title,description,tag}),
    });
    const note=await response.json()
    setNotes(notes.concat(note));
  };
  //Delete a note
  const deleteNote = async(id) => {
    const response = await fetch(`${host}/api/auth/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU3YWE0OGU2YTBlNmQ4YWJmNTYyOTEyIn0sImlhdCI6MTcwMjcwMTAwMH0.m2ZYKleniJWf4OisaRNZ-3pTkZMFRoJcK4ek8IXve50",
      },
    });
    const json=await response.json()
    console.log("note is deleted"+json)
    const newNote = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNote);
  };
  //Edit a note

  //edit a note using client side
  const editNote = async (id, title, description, tag) => {
    //api call for edit
    const response = await fetch(`${host}/api/auth/updatenotes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU3YWE0OGU2YTBlNmQ4YWJmNTYyOTEyIn0sImlhdCI6MTcwMjcwMTAwMH0.m2ZYKleniJWf4OisaRNZ-3pTkZMFRoJcK4ek8IXve50",
      },
      body: JSON.stringify({title,description,tag})
    });
    const json=await response.json()
    console.log("note is edited",json)
    const newNotes=await JSON.parse(JSON.stringify(notes))
    for (let index = 0; index < notes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
      setNotes(newNotes)
    }
  };
  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote,getNotes}}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
