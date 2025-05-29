import { TestDataSource } from '../src/test/config/test-db.config';

async function setupTestDatabase() {
    try {
        await TestDataSource.initialize();
        console.log('✅ Test database initialized successfully');

        // Crear la base de datos de prueba si no existe
        await TestDataSource.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'candidates_test') THEN
                    CREATE DATABASE candidates_test;
                END IF;
            END $$;
        `);

        console.log('✅ Test database created/verified');

        // Sincronizar el esquema
        await TestDataSource.synchronize(true);
        console.log('✅ Database schema synchronized');

    } catch (error) {
        console.error('❌ Error setting up test database:', error);
        throw error;
    } finally {
        await TestDataSource.destroy();
    }
}

setupTestDatabase().catch(console.error); 