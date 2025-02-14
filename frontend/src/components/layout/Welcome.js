import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { NoteAdd, Person } from '@mui/icons-material';
import './Welcome.css';

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="welcome-container">
            <Container maxWidth="md">
                <div elevation={3} className="welcome-content">
                    <Typography variant="h2" component="h1" className="welcome-title">
                        Welcome to Thought Canvas
                    </Typography>
                    <Typography variant="h5" className="welcome-subtitle">
                        Your Digital Space for Creative Ideas
                    </Typography>
                    
                    <Box className="welcome-buttons">
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            startIcon={<Person />}
                            onClick={() => navigate('/login')}
                            className="welcome-button"
                        >
                            Sign In
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            size="large"
                            startIcon={<NoteAdd />}
                            onClick={() => navigate('/register')}
                            className="welcome-button"
                        >
                            Get Started
                        </Button>
                    </Box>
                </div>
            </Container>
        </div>
    );
};

export default Welcome;
