import React, { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import {
    Box,
    Button,
    TextField,
    Typography,
    Tabs,
    Tab,
    Paper,
    CircularProgress,
    CssBaseline,
    ThemeProvider,
    createTheme,
    styled
} from '@mui/material';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Create a dark theme
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#f48fb1',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
    },
    typography: {
        fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif',
    },
});

// Dark gradient background component
const GradientBackground = styled(Box)({
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
});

// Styled Paper component with glass effect
const GlassPaper = styled(Paper)({
    background: 'rgba(30, 30, 30, 0.75)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px 0 rgba(11, 8, 42, 0.6)',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '420px',
});

// Gradient button component
const GradientButton = styled(Button)({
    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
    border: 0,
    borderRadius: '8px !important',
    color: 'white',
    height: 48,
    padding: '0 30px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 7px 14px rgba(0, 0, 0, 0.4)',
        background: 'linear-gradient(45deg, #5a6fd8 0%, #6a42a0 100%)',
    },
});

const Signin = () => {
    const [isSignup, setIsSignup] = useState(false);
    const socket = useMemo(() => io('http://localhost:3000'), []);
    const [SocketID, setSocketID] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
        },
        onSubmit: async (values) => {

            if (isSignup && !values.username) {
                toast.error('Username is required');
                return;
            }
            
            if (!values.email) {
                toast.error('Email is required');
                return;
            }

            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(values.email)) {
                toast.error('Please enter a valid email');
                return;
            }

            if (!values.password) {
                toast.error('Password is required');
                return;
            }




            setLoading(true);
            try {
                if (isSignup) {
                    values.SocketID = SocketID;
                    const res = await axios.post('http://localhost:3000/user/signup', values);
                    toast.success('Signup successful');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    const res = await axios.post('http://localhost:3000/user/login', values);
                    toast.success('Login successful');

                    localStorage.setItem("Token", res.data.token);
                    setTimeout(() => {
                        navigate('/home', { state: res.data.user });
                    }, 1000);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        },
    });

    useEffect(() => {
        socket.on('Welcome', (id) => {
            setSocketID(id);
            console.log(id);
        });
    }, [socket]);

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <GradientBackground>
                <GlassPaper elevation={3}>
                    <Typography
                        variant="h4"
                        textAlign="center"
                        mb={3}
                        sx={{
                            background: 'linear-gradient(45deg, #667eea 0%, #a78bfa 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: 'bold',
                            letterSpacing: '1px'
                        }}
                    >
                        {isSignup ? 'Create Account' : 'Welcome Back'}
                    </Typography>

                    <Tabs
                        value={isSignup ? 1 : 0}
                        onChange={(e, val) => setIsSignup(val === 1)}
                        centered
                        sx={{ mb: 3 }}
                        TabIndicatorProps={{
                            style: {
                                background: 'linear-gradient(45deg, #667eea 0%, #a78bfa 100%)',
                                height: '3px'
                            }
                        }}
                    >
                        <Tab
                            label="Login"
                            sx={{
                                fontWeight: 'bold',
                                '&.Mui-selected': { color: '#a78bfa' }
                            }}
                        />
                        <Tab
                            label="Sign Up"
                            sx={{
                                fontWeight: 'bold',
                                '&.Mui-selected': { color: '#a78bfa' }
                            }}
                        />
                    </Tabs>

                    <form onSubmit={formik.handleSubmit}>
                        {isSignup && (
                            <TextField
                                fullWidth
                                label="Username"
                                name="name"
                                variant="outlined"
                                margin="normal"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'rgba(255, 255, 255, 0.2)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#a78bfa',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#a78bfa',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'rgba(255, 255, 255, 0.7)',
                                    },
                                    '& .MuiInputLabel-root.Mui-focused': {
                                        color: '#a78bfa',
                                    },
                                }}
                            />
                        )}

                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            variant="outlined"
                            margin="normal"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.2)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#a78bfa',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#a78bfa',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#a78bfa',
                                },
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            variant="outlined"
                            margin="normal"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.2)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#a78bfa',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#a78bfa',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#a78bfa',
                                },
                            }}
                        />

                        <GradientButton
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{ mt: 3, py: 1.5 }}
                            disabled={loading}
                        >
                            {loading ? (
                                <CircularProgress size={24} sx={{ color: 'white' }} />
                            ) : (
                                isSignup ? 'Get Started' : 'Login'
                            )}
                        </GradientButton>
                    </form>
                </GlassPaper>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
            </GradientBackground>
        </ThemeProvider>
    );
};

export default Signin;