import { AppDataSource } from './typeorm.config';

export const initDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('📡 Conexión a PostgreSQL con TypeORM exitosa');
  } catch (err) {
    console.error('❌ Error al conectar con la base de datos usando TypeORM:', err);
  }
};
