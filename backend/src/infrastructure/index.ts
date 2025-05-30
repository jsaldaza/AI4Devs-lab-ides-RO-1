import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { initDatabase } from './database';
import candidateRoutes from './routes/candidateRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

// Forzar modo desarrollo
process.env.NODE_ENV = 'development';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Ruta para probar conexión a la base de datos
app.get('/db-test', async (_req, res) => {
  try {
    const result = await initDatabase();
    res.json({ success: true, time: result });
  } catch (err) {
    console.error('❌ Error al conectar con la base de datos:', err);
    res.status(500).json({
      success: false,
      message: 'Error en consola, revisa logs'
    });
  }
});

// Inicializar base de datos y servidor
const startServer = async () => {
  try {
    await initDatabase();

    // Configurar rutas después de inicializar la base de datos
    app.use('/api/auth', authRoutes);
    app.use('/api/candidates', candidateRoutes);

    app.listen(PORT, () => {
      console.log(`🚀 Servidor iniciado en http://localhost:${PORT} en modo ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Error al inicializar la aplicación:', error);
    process.exit(1);
  }
};

startServer();
