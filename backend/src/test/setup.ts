import { TestDataSource } from './config/test-db.config';
import * as dotenv from 'dotenv';

// Configurar variables de entorno para pruebas
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key';

// Cargar variables de entorno
dotenv.config({ path: '.env.test' });

// Mock de bcryptjs
jest.mock('bcryptjs', () => ({
    genSalt: jest.fn().mockResolvedValue('salt'),
    hash: jest.fn().mockImplementation((password) => Promise.resolve(`hashed_${password}`)),
    compare: jest.fn().mockImplementation((password, hash) => {
        return Promise.resolve(hash === `hashed_${password}`);
    }),
}));

// Mock de jsonwebtoken
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockImplementation((payload) => `token_${JSON.stringify(payload)}`),
    verify: jest.fn().mockImplementation((token) => {
        if (!token.startsWith('token_')) {
            throw new Error('Invalid token');
        }
        return JSON.parse(token.substring(6));
    }),
}));

// Configuración global antes de todas las pruebas
beforeAll(async () => {
    try {
        if (!TestDataSource.isInitialized) {
            await TestDataSource.initialize();
            console.log('Test database initialized');
        }
    } catch (error) {
        console.error('Error initializing test database:', error);
        throw error;
    }
});

// Configuración global antes de cada prueba
beforeEach(async () => {
    // Limpiar todas las tablas
    const entities = TestDataSource.entityMetadatas;
    for (const entity of entities) {
        const repository = TestDataSource.getRepository(entity.name);
        await repository.clear();
    }
    // Limpiar todos los mocks
    jest.clearAllMocks();
});

// Configuración global después de todas las pruebas
afterAll(async () => {
    if (TestDataSource.isInitialized) {
        await TestDataSource.destroy();
        console.log('Test database connection closed');
    }
}); 