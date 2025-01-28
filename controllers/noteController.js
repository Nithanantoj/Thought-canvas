const Note = require('../models/Note');

// Create a Note
const createNote = async (req, res) => {
  const { title, content } = req.body;

  try {
    const newNote = new Note({
      title,
      content,
      userId: req.user.userId, // userId comes from the JWT token
    });

    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ message: 'Error creating note', error: err.message });
  }
};

// Get all Notes for the logged-in user
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.userId }); // Fetch notes by userId
    res.status(200).json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notes', error: err.message });
  }
};

// Update a Note
const updateNote = async (req, res) => {
  const { title, content } = req.body;
  const noteId = req.params.id;

  try {
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { title, content },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json(updatedNote);
  } catch (err) {
    res.status(500).json({ message: 'Error updating note', error: err.message });
  }
};

// Delete a Note
const deleteNote = async (req, res) => {
  const noteId = req.params.id;

  try {
    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting note', error: err.message });
  }
};

module.exports = { createNote, getNotes, updateNote, deleteNote };
