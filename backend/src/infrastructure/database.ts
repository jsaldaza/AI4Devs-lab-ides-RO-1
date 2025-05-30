import { DataSource } from 'typeorm';
import { TestDataSource } from '../test/config/test-db.config';
import { AppDataSource } from './typeorm.config';

let dataSource: DataSource;

export const getDataSource = (): DataSource => {
  if (!dataSource) {
    dataSource = process.env.NODE_ENV === 'test' ? TestDataSource : AppDataSource;
  }
  return dataSource;
};

export const initDatabase = async () => {
  try {
    const connection = getDataSource();

    if (!connection.isInitialized) {
      await connection.initialize();
      console.log('✅ Database connection established successfully');

      // Test the connection
      const testQuery = await connection.query('SELECT NOW()');
      console.log('📅 Database time:', testQuery[0].now);
    }

    return connection;
  } catch (error) {
    console.error('❌ Error connecting to database:', error);
    throw error;
  }
};
