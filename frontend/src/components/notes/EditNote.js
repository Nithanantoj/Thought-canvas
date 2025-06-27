import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../utils/axios';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    CircularProgress,
} from '@mui/material';
import './EditNote.css';
import { toast } from 'react-toastify';

const EditNote = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();

    const fetchNote = useCallback(async () => {
        try {
            const response = await axios.get(`/notes/${id}`);
            const { title, content } = response.data;
            setTitle(title);
            setContent(content);
        } catch (err) {
            setError('Failed to fetch note');
            console.error('Error fetching note:', err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchNote();
    }, [fetchNote]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Editing note with ID:', id);
            await axios.put(`/notes/${id}`, { title, content });
            toast.success('Note updated successfully!');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update note');
            console.error('Error updating note:', err);
        }
    };

    if (loading) {
        return (
            <Container className="edit-note-loading">
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="edit-note-error">
                <Typography color="error" variant="h6">
                    {error}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/')}
                    className="back-button"
                >
                    Back to Notes
                </Button>
            </Container>
        );
    }

    return (
        <Container component="main" maxWidth="md" className="edit-note-container">
            <Paper elevation={3} className="edit-note-paper">
                <Typography component="h1" variant="h5">
                    Edit Note
                </Typography>
                <form onSubmit={handleSubmit} className="edit-note-form">
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="title"
                        label="Title"
                        name="title"
                        autoFocus
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="content"
                        label="Content"
                        id="content"
                        multiline
                        rows={8}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <div className="form-actions">
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={() => navigate('/')}
                            className="action-button"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className="action-button"
                        >
                            Update Note
                        </Button>
                    </div>
                </form>
            </Paper>
        </Container>
    );
};

export default EditNote;
