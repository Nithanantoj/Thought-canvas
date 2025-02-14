import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Container, Paper, TextField, Button, Typography, Box } from '@mui/material';
import './Login.css';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success('Successfully logged in!');
            navigate('/');
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        }
    };

    return (
        <Container component="main" maxWidth="xs" className="login-container">
            <Paper elevation={3} className="login-paper">
                <Typography component="h1" variant="h5">
                    Sign In
                </Typography>
                {error && (
                    <Typography color="error" variant="body2">
                        {error}
                    </Typography>
                )}
                <Box component="form" onSubmit={handleSubmit} className="login-form">
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className="submit-button"
                    >
                        Sign In
                    </Button>
                    <Box className="links-container">
                        <Link to="/forgot-password" className="auth-link">
                            Forgot password?
                        </Link>
                        <Link to="/register" className="auth-link">
                            Don't have an account? Sign Up
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;
