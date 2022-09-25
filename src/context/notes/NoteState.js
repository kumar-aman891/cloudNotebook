import React from "react";
import { useState } from "react";
import NoteContext from "./noteContext";
//we made a NoteContext and then made a function named NoteState and usme hume jo b value deni hai vo humne .provider kar k value me daal di
//issey ye hoga ki jab bhi hum kisi ko bhi iss context k andar kisi bhi cheez ko wrap karenge,usk beech me automatically sare k sare children aa jenge
const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInitial = []

  const [notes, setNotes] = useState(notesInitial);


  //Get all notes

    //add a new note
    const getNotes = async() => {
      //API call
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token":localStorage.getItem('token'),
        },
      });

      const json = await response.json();
      console.log(json);
      setNotes(json)
    };

  //add a new note
  const addNote = async(title, description, tag) => {
    //API call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token'),
      },
      body: JSON.stringify({title,description,tag}),
    });
    const note = await response.json();
    setNotes(notes.concat(note));//notes array me push kar do note ko and notes state ko update kar do
    //concat returns an array whereas push updates an array
  };

  //delete a note
  const deleteNote = async(id) => {
    //API call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token'),
      },
    });
    const json = await response.json();
    console.log(json);
    setNotes(json);
    console.log("deleting the node with id" + id);
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    }); //id wale note ko hata dega and bakiyon ko newNotes me save kar dega
    setNotes(newNotes);
  };

  //edit a note

  const editNote = async (id, title, description, tag) => {
    //API call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token'),
      },
      body: JSON.stringify({title,description,tag}),
    });
    const json = await response.json();
    console.log(json);

    //logic to edit in client
    let newNotes = JSON.parse(JSON.stringify(notes))//aisa karne se notes ki deep copy ban jegi,so that front end me bhi immidiately update kar paye
    for (let index = 0; index < newNotes.length; index++) {
      if (newNotes[index]._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
      
    }
    setNotes(newNotes);
  };
  return (
    //value humari NoteState provide kar rahi hai,,,,same as state:state update:update
    <NoteContext.Provider
      value={{ notes, setNotes, addNote, deleteNote, editNote,getNotes }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
