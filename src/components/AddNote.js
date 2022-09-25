import React, {useContext} from "react";
import { useState } from "react";
import noteContext from "../context/notes/noteContext";

const AddNote = (props) => {
    const context = useContext(noteContext);
    const {addNote} = context;//destructuring
    
    const[note,setNote]=useState({title:"",description:"",tag:""})

    const handleClick = (e)=>{
        e.preventDefault()//so that page reload na ho
        addNote(note.title,note.description,note.tag);
        setNote({title:"",description:"",tag:""});
        props.showAlert("Added successfully","success")  
    }
    const onChange = (e)=>{
        setNote({...note,[e.target.name]:e.target.value})//already jo cheezen hain note me,unme or cheezen add ho jengi,jo bhi change ho raha hai uska name uski value k barabar ho jae 

    }
  return (
    <div>
      <div className="container my-3">
        <h2>Add a Note</h2>
        <form className="my-3">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"value={note.title} 
              onChange={onChange}
              minLength={5} required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label" >
              Description
            </label>
            <input
              type="text"
              className="form-control"
              id="description"
              name="description"value={note.description}
              onChange={onChange}
              minLength={5} required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="tag" className="form-label" >
              Tag
            </label>
            <input
              type="text"
              className="form-control"
              id="tag"
              name="tag"value={note.tag}
              onChange={onChange}
              minLength={5} required
            />
          </div>
          <button disabled={note.title.length<5||note.description.length<5} type="submit" onClick={handleClick} className="btn btn-primary">
            Add Note
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNote;
