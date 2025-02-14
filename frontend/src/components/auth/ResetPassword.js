import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Container, Paper, TextField, Button, Typography, Box } from '@mui/material';
import './ResetPassword.css';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { token } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await resetPassword(token, password);
            toast.success('Your password has been reset successfully!');
            navigate('/login'); // Redirect to login after successful reset
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <Container component="main" maxWidth="xs" className="reset-password-container">
            <Paper elevation={3} className="reset-password-paper">
                <Box component="form" onSubmit={handleSubmit} className="reset-password-form">
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="New Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm New Password"
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className="submit-button"
                    >
                        Reset Password
                    </Button>
                    <Box className="links-container">
                        <Link to="/login" className="auth-link">
                            Back to Sign In
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default ResetPassword;
