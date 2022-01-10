import NoteContext from "./noteContext";
import React, { useState } from "react";

export default function NoteState(props) {
  const notesInitial = [
    {
      _id: "61dc3e891c06c78518c976dd",
      user: "61dbe8d31cd58bd626cca9d8",
      title: "my title",
      description: "please wake up late",
      tag: "personalbruh",
      date: "2022-01-10T14:11:21.953Z",
      __v: 0,
    },
    {
      _id: "61dc3e981c06c78518c976df",
      user: "61dbe8d31cd58bd626cca9d8",
      title: "my title",
      description: "please wake up late",
      tag: "personalbruh",
      date: "2022-01-10T14:11:36.990Z",
      __v: 0,
    },
  ];
  const [notes, setnotes] = useState(notesInitial);
  //add a note
  const addNote = (title, description, tag) => {
    console.log("adding new note is called");
    //call api for creating note
    let note = {
      _id: "61dc3e981c06c78518c4df",
      user: "61dbe8d31cd58bd626cca9d8",
      title: title,
      description: description,
      tag: tag,
      date: "2022-01-10T14:11:36.990Z",
      __v: 0,
    };
    setnotes(notes.concat(note));
  };
  //delete note
  const deleteNote = (id) => {
    console.log("deleting the note with id " + id);
    //call api for deleting note
    let newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setnotes(newNotes)
  };
  //edit note
  const editNote = () => {};
  return (
    <NoteContext.Provider
      value={{ notes, setnotes, addNote, deleteNote, editNote }}
    >
      {props.children}
    </NoteContext.Provider>
  );
}
