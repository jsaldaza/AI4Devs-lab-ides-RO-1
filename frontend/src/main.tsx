import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './config/axios';  // Importar configuración de axios
import App from './App';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find root element');

const root = createRoot(container);

root.render(
    <StrictMode>
        <App />
    </StrictMode>
); 