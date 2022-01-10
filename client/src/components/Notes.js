import React,{useContext} from "react";
import { AddNote } from "./AddNote";
import Noteitem from "./Noteitem";
import noteContext from "../context/notes/noteContext";


export default function Notes() {
    const context = useContext(noteContext);
    const { notes} = context;
  return (
    <>
      <AddNote />
      <div className="row my-3">
        <h1>Your Notes</h1>
        {notes.map((note) => {
          return <Noteitem key={note._id} note={note} />;
        })}
      </div>
    </>
  );
}
