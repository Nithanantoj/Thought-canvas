import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardActions,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Share as ShareIcon,
    WhatsApp as WhatsAppIcon,
    Email as EmailIcon,
} from '@mui/icons-material';
import './NotesList.css';
import { toast } from 'react-toastify';

const NotesList = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [shareEmail, setShareEmail] = useState('');
    const [sharePhone, setSharePhone] = useState('');

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/notes', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotes(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch notes');
            setLoading(false);
        }
    };

    const handleDelete = async (noteId) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/notes/${noteId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success('Note deleted successfully!');
                setNotes(notes.filter(note => note._id !== noteId));
            } catch (err) {
                setError('Failed to delete note');
            }
        }
    };

    const handleShareClick = (note) => {
        setSelectedNote(note);
        setShareDialogOpen(true);
    };

    const handleShareEmail = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:5000/api/notes/${selectedNote._id}/share/email`,
                { email: shareEmail },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setShareDialogOpen(false);
            setShareEmail('');
        } catch (err) {
            setError('Failed to share note via email');
        }
    };

    const handleShareWhatsApp = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:5000/api/notes/${selectedNote._id}/share/whatsapp`,
                { phoneNumber: sharePhone },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setShareDialogOpen(false);
            setSharePhone('');
        } catch (err) {
            setError('Failed to share note via WhatsApp');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Container className="notes-container">
            <Grid container spacing={3}>
                {notes.map((note) => (
                    <Grid item xs={12} sm={6} md={4} key={note._id}>
                        <Card className="note-card">
                            <CardContent>
                                <Typography variant="h6" component="h2">
                                    {note.title}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {note.content}
                                </Typography>
                            </CardContent>
                            <CardActions className="note-actions">
                                <IconButton
                                    component={Link}
                                    to={`/edit/${note._id}`}
                                    size="small"
                                    color="primary"
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleDelete(note._id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)}>
                <DialogTitle>Share Note</DialogTitle>
                <DialogContent>
                    <div className="share-dialog-content">
                        <div className="share-option">
                            <TextField
                                label="Email Address"
                                value={shareEmail}
                                onChange={(e) => setShareEmail(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <Button
                                startIcon={<EmailIcon />}
                                variant="contained"
                                onClick={handleShareEmail}
                                disabled={!shareEmail}
                            >
                                Share via Email
                            </Button>
                        </div>
                        <div className="share-option">
                            <TextField
                                label="Phone Number (with country code)"
                                value={sharePhone}
                                onChange={(e) => setSharePhone(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <Button
                                startIcon={<WhatsAppIcon />}
                                variant="contained"
                                onClick={handleShareWhatsApp}
                                disabled={!sharePhone}
                            >
                                Share via WhatsApp
                            </Button>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShareDialogOpen(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default NotesList;
