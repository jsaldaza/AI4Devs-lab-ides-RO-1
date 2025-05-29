import { DataSource } from 'typeorm';
import { TestDataSource } from '../test/config/test-db.config';
import { AppDataSource } from './typeorm.config';

// Exportar el DataSource para que pueda ser usado en los servicios
export const getDataSource = (): DataSource => {
  return process.env.NODE_ENV === 'test' ? TestDataSource : AppDataSource;
};

export const initDatabase = async () => {
  try {
    const connection = await AppDataSource.initialize();
    console.log('✅ Database connection established successfully');

    // Test the connection
    const testQuery = await connection.query('SELECT NOW()');
    console.log('📅 Database time:', testQuery[0].now);

    return connection;
  } catch (error) {
    console.error('❌ Error connecting to database:', error);
    throw error;
  }
};
