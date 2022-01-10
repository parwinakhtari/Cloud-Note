import React, { useContext } from "react";
import noteContext from "../context/notes/noteContext";

export default function Noteitem(props) {
  const context = useContext(noteContext);
  const { deleteNote } = context;
  let { note } = props;
  return (
    <div className="col-md-3">
      <div className="card my-3">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <h5 className="card-title">{note.title}</h5>
            <i
              className="fas fa-trash-alt mx-2"
              onClick={()=>{deleteNote(note._id)}}
            ></i>
            <i className="far fa-edit"></i>
          </div>
          <p className="card-text">{note.description}</p>
        </div>
      </div>
    </div>
  );
}
