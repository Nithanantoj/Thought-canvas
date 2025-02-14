const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Note = require('../models/Note');
const axios = require('axios');
const nodemailer = require('nodemailer');


// Get all notes for a user
router.get('/', auth, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a note
router.post('/', [
    auth,
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, content } = req.body;
        const note = new Note({
            title,
            content,
            user: req.user.id
        });

        await note.save();
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a note
router.put('/:id', [
    auth,
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, content } = req.body;
        let note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        note = await Note.findByIdAndUpdate(
            req.params.id,
            { title, content },
            { new: true }
        );

        res.json(note);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a note
router.delete('/:id', auth, async (req, res) => {
    try {
        console.log('Attempting to delete note with ID:', req.params.id);
        const note = await Note.findById(req.params.id);
        
        if (!note) {
            console.log('Note not found');
            return res.status(404).json({ message: 'Note not found' });
        }

        // Optional: Check if the user is authorized to delete the note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await note.deleteOne(); // Use deleteOne instead of remove
        console.log('Note removed successfully');
        res.json({ message: 'Note removed' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ message: 'Server error' });
    }
});




module.exports = router;
