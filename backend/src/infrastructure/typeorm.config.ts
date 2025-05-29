import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config();

// Verificar variables de entorno requeridas
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Variable de entorno ${envVar} no está definida`);
  }
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV === 'development', // Solo sincronizar en desarrollo
  dropSchema: process.env.NODE_ENV === 'development', // Eliminar schema en desarrollo
  logging: process.env.NODE_ENV === 'development',
  entities: [path.join(__dirname, '../domain/entities/**/*.{ts,js}')],
  migrations: [path.join(__dirname, './migrations/**/*.{ts,js}')],
  subscribers: [path.join(__dirname, './subscribers/**/*.{ts,js}')],
  // Opciones adicionales para mejor rendimiento y seguridad
  ssl: process.env.DB_SSL === 'true',
  cache: true,
  poolSize: 10,
  connectTimeoutMS: 10000,
});
