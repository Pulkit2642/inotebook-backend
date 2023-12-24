const express = require('express');
const Note = require('../models/notes');
const router = express.Router();
const fetchuser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');

// ROUTE 1: Fetch all notes of the current user - GET /api/notes/fetchallnotes - Requires login
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ owner: req.user });
        res.json({success: true, data:notes});
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server side error", details: err })
    }
});

// ROUTE 2: Add a new Note - POST /api/notes/addnote - Requires login
router.post('/addnote', [body('title', 'Title must be atleast 3 characters').isLength({ min: 3 }),
body('description', 'Description must be atleast 3 characters').isLength({ min: 3 })]
    , fetchuser, async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // Check  for errors in incoming data
                return res.status(400).json({ error: "Please check your input", details: errors.array() });
            } else {
                const { title, description, tag } = req.body;
                const newNote = new Note({ title, description, tag, owner: req.user });
                const savedNote = await newNote.save();
                res.json({ success: true, data: savedNote })
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Server side error", details: err })
        }
    });

// ROUTE 3: Update an existing Note - PUT /api/notes/updatenote/:id - Login required.
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        let newNote = {};
        const { title, description, tag } = req.body;
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ error: "Note not found" })
        } else if (note.owner.toString() !== req.user) {
            return res.status(401).json({ error: "Not allowed" })
        } else {
            note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote, new: true });
            return res.json({ success: true, data: note });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server side error", details: err })
    }
});

// ROUTE 4: Delete an existing Note - DELETE /api/notes/deletenote/:id - Login required.
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ error: "Note not found" })
        } else if (note.owner.toString() !== req.user) {
            return res.status(401).json({ error: "Not allowed" })
        } else {
            note = await Note.findByIdAndDelete(req.params.id);
            return res.json({ status: "Note deleted successfully", data: note });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server side error", details: err })
    }
});

module.exports = router;