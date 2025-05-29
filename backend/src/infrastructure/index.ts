import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { initDatabase } from './database';
import { AppDataSource } from './typeorm.config';
import candidateRoutes from './routes/candidateRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
}));

// Middleware para procesar JSON
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);

// Ruta raíz
app.get('/', (_req, res) => {
  res.send('API del ATS funcionando correctamente 🎯');
});

// Ruta para probar conexión a la base de datos
app.get('/db-test', async (_req, res) => {
  try {
    const result = await AppDataSource.query('SELECT NOW()');
    res.json({ success: true, time: result[0] });
  } catch (err) {
    console.error('❌ Error al conectar con la base de datos:', err);
    res.status(500).json({
      success: false,
      message: 'Error en consola, revisa logs'
    });
  }
});

// Manejo de errores global
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Inicializar base de datos y servidor
AppDataSource.initialize()
  .then(() => {
    console.log('📡 Conexión a PostgreSQL con TypeORM exitosa');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor iniciado en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al inicializar la base de datos:', error);
    process.exit(1);
  });
