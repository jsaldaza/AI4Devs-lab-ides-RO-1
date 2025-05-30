import React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';
import { AppError, ErrorType } from '../services/error.service';

interface ErrorDisplayProps {
    error: AppError | null;
    onClose?: () => void;
}

const getAlertSeverity = (errorType: ErrorType) => {
    switch (errorType) {
        case ErrorType.VALIDATION:
            return 'warning';
        case ErrorType.AUTHENTICATION:
        case ErrorType.AUTHORIZATION:
            return 'error';
        case ErrorType.NETWORK:
        case ErrorType.SERVER:
            return 'error';
        case ErrorType.RATE_LIMIT:
            return 'warning';
        default:
            return 'error';
    }
};

const getErrorTitle = (errorType: ErrorType) => {
    switch (errorType) {
        case ErrorType.VALIDATION:
            return 'Error de Validación';
        case ErrorType.AUTHENTICATION:
            return 'Error de Autenticación';
        case ErrorType.AUTHORIZATION:
            return 'Error de Autorización';
        case ErrorType.NETWORK:
            return 'Error de Red';
        case ErrorType.SERVER:
            return 'Error del Servidor';
        case ErrorType.RATE_LIMIT:
            return 'Límite Excedido';
        default:
            return 'Error';
    }
};

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onClose }) => {
    if (!error) return null;

    return (
        <Box sx={{ mb: 2 }}>
            <Alert
                severity={getAlertSeverity(error.type)}
                onClose={onClose}
                sx={{
                    '& .MuiAlert-message': {
                        width: '100%'
                    }
                }}
            >
                <AlertTitle>{getErrorTitle(error.type)}</AlertTitle>
                {error.message}
                {error.details && error.type === ErrorType.VALIDATION && (
                    <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                        {Object.entries(error.details).map(([field, errors]) => (
                            <li key={field}>
                                {field}: {Array.isArray(errors) ? errors.join(', ') : errors}
                            </li>
                        ))}
                    </Box>
                )}
            </Alert>
        </Box>
    );
}; 