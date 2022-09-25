const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//Route1 , Get all the notes(will use get request as hume simply jo header hai usk andar se token lena hai) Login reqd
// using GET : "/api/auth/getuser"
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    //if the promise is not resolved/rejected the we catch the error and return accordingly
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
});

//Route2 , Add a new note using POST : "/api/auth/addnote" Login reqd

router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid Title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      //using destructuring
      const { title, description, tag } = req.body;
      //if there are errors the return bad request and the errors , the function will return and no further execution will take place
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      //now we will save a new note
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      //if the promise is not resolved/rejected the we catch the error and return accordingly
      console.error(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);

//Route3 , Update an existing note using PUT : "/api/auth/updatenote" Login reqd
//generally we use put request for updation
//
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    //destructuring
    const { title, description, tag } = req.body;
    //create a new note
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //find the note to be updated and update it
    let note = await Notes.findById(req.params.id); ///updatenote/:id , ye wali id hai jo hum update karna chahte h
    //if this note doesnt exist
    if (!note) {
      return res.status(404).send("not found");
    }

    //to verify user
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    ); //new true karne se agar koi naya contact ata hai to vo create ho jega
    res.json({ note });
  } catch (error) {
    //if the promise is not resolved/rejected the we catch the error and return accordingly
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
});

//Route4 , Delete an existing note using DELETE : "/api/auth/deletenote" Login reqd
//generally we use put request for deletion
//
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    //destructuring
    const { title, description, tag } = req.body;
    //create a new note
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //find the note to be deleted and delete it
    let note = await Notes.findById(req.params.id); ///updatenote/:id , ye wali id hai jo hum update karna chahte h
    //if this note doesnt exist
    if (!note) {
      return res.status(404).send("not found");
    }

    //Allow deletion only if user owns this node
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted", note: note });
  } catch (error) {
    //if the promise is not resolved/rejected the we catch the error and return accordingly
    console.error(error.message);
    res.status(500).send("Internal server error occured");
  }
});
module.exports = router;
