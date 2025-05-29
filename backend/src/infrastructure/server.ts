import express, { Express } from 'express';
import cors from 'cors';
import { getDataSource } from './database';
import authRoutes from './routes/authRoutes';
import candidateRoutes from './routes/candidateRoutes';

export const createServer = async (): Promise<Express> => {
    const app = express();

    // Configuración de CORS
    app.use(cors({
        origin: 'http://localhost:5173', // URL del frontend
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }));

    // Middleware
    app.use(express.json());

    // Configurar el DataSource correcto según el entorno
    const dataSource = getDataSource();

    try {
        if (!dataSource.isInitialized) {
            await dataSource.initialize();
            console.log('Database initialized successfully');
        }
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }

    // Routes with /api prefix
    app.use('/api/auth', authRoutes);
    app.use('/api/candidates', candidateRoutes);

    return app;
}; 