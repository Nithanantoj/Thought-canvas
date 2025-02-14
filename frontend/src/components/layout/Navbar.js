import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Add as AddIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated) return null;

    return (
        <AppBar position="static" className="navbar">
            <Toolbar>
                <Typography variant="h6" component={Link} to="/" className="navbar-brand">
                    Thought Canvas
                </Typography>
                <div className="navbar-buttons">
                    <Button
                        component={Link}
                        to="/create"
                        color="inherit"
                        startIcon={<AddIcon />}
                        className="nav-button"
                    >
                        New Note
                    </Button>
                    <IconButton
                        color="inherit"
                        onClick={handleLogout}
                        className="logout-button"
                    >
                        <LogoutIcon />
                    </IconButton>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
