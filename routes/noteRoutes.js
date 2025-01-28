const express = require('express');
const { createNote, getNotes, updateNote, deleteNote } = require('../controllers/noteController');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

// Protected routes
router.post('/', authenticate, createNote);        // Create a note
router.get('/', authenticate, getNotes);           // Get all notes
router.put('/:id', authenticate, updateNote);     // Update a specific note
router.delete('/:id', authenticate, deleteNote);  // Delete a specific note

module.exports = router;
