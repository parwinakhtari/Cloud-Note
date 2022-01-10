const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

// ROUTE 1 : get all notes of an exisitng user: Login required
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Oops internal server error occured");
  }
});

// ROUTE 2 : Add a new note: Login required
router.post(
  "/addnote",
  body("title", "Enter a valid title").isLength({ min: 3 }),
  body("description", "Description must be atleast 5 characters").isLength({
    min: 5,
  }),
  fetchUser,
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { title, description, tag } = req.body;
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Oops internal server error occured");
    }
  }
);

// ROUTE 3 : update existing notes of a user: Login required
router.put("/updatenote/:id", fetchUser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    //create new note object
    let newnote = {};
    if (title) {
      newnote.title = title;
    }
    if (description) {
      newnote.description = description;
    }
    if (tag) {
      newnote.tag = tag;
    }
    //find the note to be updated and then update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Such Note not found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Permission not granted");
    }
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newnote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Oops internal server error occured");
  }
});

// ROUTE 4 : delete existing notes of a user: Login required
router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  try {
    //find the note to be deleted and then delete it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Such Note not found");
    }
    //if selected note is the loin users note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Permission not granted");
    }
    note = await Note.findByIdAndDelete(req.params.id);
    res.send('Success!! Note deleted succesfully')
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Oops internal server error occured");
  }
});

module.exports = router;
