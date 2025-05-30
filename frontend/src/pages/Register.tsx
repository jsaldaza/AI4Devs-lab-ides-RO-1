import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Paper
} from '@mui/material';
import { AppError, ErrorType } from '../services/error.service';
import { ErrorDisplay } from '../components/ErrorDisplay';

export const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState<AppError | null>(null);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar errores cuando el usuario empieza a escribir
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError({
                type: ErrorType.VALIDATION,
                message: 'Las contraseñas no coinciden',
                details: {
                    confirmPassword: ['Las contraseñas no coinciden']
                }
            });
            return;
        }

        try {
            await register(
                formData.firstName,
                formData.lastName,
                formData.email,
                formData.password
            );
            navigate('/dashboard');
        } catch (err) {
            setError(err as AppError);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                        Sign Up
                    </Typography>

                    <ErrorDisplay
                        error={error}
                        onClose={() => setError(null)}
                    />

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="firstName"
                            label="First Name"
                            autoFocus
                            value={formData.firstName}
                            onChange={handleChange}
                            error={error?.type === 'VALIDATION' && error.details?.firstName !== undefined}
                            helperText={error?.type === 'VALIDATION' ? error.details?.firstName : ''}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="lastName"
                            label="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            error={error?.type === 'VALIDATION' && error.details?.lastName !== undefined}
                            helperText={error?.type === 'VALIDATION' ? error.details?.lastName : ''}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="email"
                            label="Email Address"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={error?.type === 'VALIDATION' && error.details?.email !== undefined}
                            helperText={error?.type === 'VALIDATION' ? error.details?.email : ''}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            error={error?.type === 'VALIDATION' && error.details?.password !== undefined}
                            helperText={error?.type === 'VALIDATION' ? error.details?.password : ''}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={error?.type === 'VALIDATION' && error.details?.confirmPassword !== undefined}
                            helperText={error?.type === 'VALIDATION' ? error.details?.confirmPassword : ''}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            onClick={() => navigate('/login')}
                        >
                            Already have an account? Sign In
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}; 