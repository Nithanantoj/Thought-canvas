import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




// Components
import Navbar from './components/layout/Navbar';
import Welcome from './components/layout/Welcome';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import NotesList from './components/notes/NotesList';
import CreateNote from './components/notes/CreateNote';
import EditNote from './components/notes/EditNote';


const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/welcome" />;
};

const AuthRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" /> : children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <ToastContainer />
          <Routes>
            <Route path="/welcome" element={<AuthRoute><Welcome /></AuthRoute>} />
            <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
            <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
            <Route path="/forgot-password" element={<AuthRoute><ForgotPassword /></AuthRoute>} />
            <Route path="/reset-password" element={<AuthRoute><ResetPassword /></AuthRoute>} />
            <Route path="/" element={<PrivateRoute><NotesList /></PrivateRoute>} />
            <Route path="/create" element={<PrivateRoute><CreateNote /></PrivateRoute>} />
            <Route path="/edit/:id" element={<PrivateRoute><EditNote /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/welcome" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
