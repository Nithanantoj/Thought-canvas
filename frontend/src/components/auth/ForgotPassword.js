import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { forgotPassword } from '../../api'; // Adjust the import based on your API setup
import { Container, TextField, Button, Typography } from '@mui/material';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await forgotPassword(email);
            toast.success('Check your email for password reset instructions');
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <Container>
            <Typography variant="h4">Forgot Password</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                />
                <Button type="submit" variant="contained" color="primary">
                    Send Reset Link
                </Button>
            </form>
        </Container>
    );
};

export default ForgotPassword;