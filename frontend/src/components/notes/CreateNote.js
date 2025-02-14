import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
} from '@mui/material';
import './CreateNote.css';
import { toast } from 'react-toastify';

const CreateNote = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/api/notes',
                { title, content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('Note created successfully!');
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create note');
        }
    };

    return (
        <Container component="main" maxWidth="md" className="create-note-container">
            <Paper elevation={3} className="create-note-paper">
                <Typography component="h1" variant="h5">
                    Create New Note
                </Typography>
                {error && (
                    <Typography color="error" variant="body2">
                        {error}
                    </Typography>
                )}
                <form onSubmit={handleSubmit} className="create-note-form">
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
                            Create Note
                        </Button>
                    </div>
                </form>
            </Paper>
        </Container>
    );
};

export default CreateNote;
