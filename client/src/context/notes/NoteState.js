import NoteContext from "./noteContext";
import React, { useState } from "react";

export default function NoteState(props) {
  const host = "http://localhost:5000";
  const notesInitial = [];
  const [notes, setnotes] = useState(notesInitial);
  //get all notes
  const getNotes = async () => {
    try {
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      const json = await response.json();
      setnotes(json);
    } catch (error) {
      return error.message;
    }
  };
  //add a note
  const addNote = async (title, description, tag) => {
    try {
      //call api for creating note
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ title, description, tag }),
      });
      const note = await response.json();
      setnotes(notes.concat(note));
    } catch (error) {
      return error;
    }
  };
  //delete note
  const deleteNote = async (id) => {
    //call api for deleting note
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    console.log(response);
   const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setnotes(newNotes);
  };
  //edit note
  const editNote = async (id, title, description, tag) => {
    //call api for editing note
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();
    console.log(json);
    let newNotes = JSON.parse(JSON.stringify(notes));
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setnotes(newNotes);
  };
  return (
    <NoteContext.Provider
      value={{ notes, setnotes, addNote, deleteNote, editNote, getNotes }}
    >
      {props.children}
    </NoteContext.Provider>
  );
}
