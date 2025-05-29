import request from 'supertest';
import { Express } from 'express';
import { TestDataSource } from '../config/test-db.config';
import { createServer } from '../../infrastructure/server';
import { User } from '../../domain/entities/User';

describe('Auth Integration Tests', () => {
    let app: Express;
    let userRepository: any;

    beforeAll(async () => {
        // Asegurarse de que la base de datos esté inicializada
        if (!TestDataSource.isInitialized) {
            await TestDataSource.initialize();
        }
        app = await createServer();
        userRepository = TestDataSource.getRepository(User);
    });

    afterAll(async () => {
        if (TestDataSource.isInitialized) {
            await TestDataSource.destroy();
        }
    });

    beforeEach(async () => {
        // Limpiar la base de datos antes de cada prueba
        await userRepository.clear();
    });

    describe('POST /api/auth/register', () => {
        const validUser = {
            email: 'test@example.com',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User',
        };

        it('should register a new user successfully', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send(validUser);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.token).toBeDefined();
            expect(response.body.data.user.email).toBe(validUser.email);

            // Verificar que el usuario se guardó en la base de datos
            const savedUser = await userRepository.findOne({
                where: { email: validUser.email }
            });
            expect(savedUser).toBeDefined();
            expect(savedUser?.email).toBe(validUser.email);
        });

        it('should not register user with existing email', async () => {
            // Primero registramos un usuario
            await request(app)
                .post('/api/auth/register')
                .send(validUser);

            // Intentamos registrar el mismo usuario
            const response = await request(app)
                .post('/api/auth/register')
                .send(validUser);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('User with this email already exists');
        });
    });

    describe('POST /api/auth/login', () => {
        const user = {
            email: 'test@example.com',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User',
        };

        beforeEach(async () => {
            // Registrar un usuario antes de las pruebas de login
            await request(app)
                .post('/api/auth/register')
                .send(user);
        });

        it('should login successfully with valid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: user.email,
                    password: user.password,
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.token).toBeDefined();
            expect(response.body.data.user.email).toBe(user.email);
        });

        it('should not login with invalid password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: user.email,
                    password: 'wrongpassword',
                });

            // Verificar la respuesta
            const responseBody = response.body;
            console.log('Response:', {
                status: response.status,
                body: responseBody
            });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Invalid credentials');
        });
    });

    describe('GET /api/auth/validate', () => {
        let authToken: string;
        let registeredUser: any;

        beforeEach(async () => {
            // Registrar y login para obtener token
            const user = {
                email: 'test@example.com',
                password: 'password123',
                firstName: 'Test',
                lastName: 'User',
            };

            // Registrar usuario
            const registerResponse = await request(app)
                .post('/api/auth/register')
                .send(user);

            // Verificar que el registro fue exitoso
            expect(registerResponse.status).toBe(201);
            expect(registerResponse.body.success).toBe(true);
            expect(registerResponse.body.data.token).toBeDefined();

            authToken = registerResponse.body.data.token;
            registeredUser = registerResponse.body.data.user;

            // Verificar que el token es válido
            const validateResponse = await request(app)
                .get('/api/auth/validate')
                .set('Authorization', `Bearer ${authToken}`);

            console.log('Validate Response:', {
                status: validateResponse.status,
                body: validateResponse.body
            });
        });

        it('should validate token successfully', async () => {
            const response = await request(app)
                .get('/api/auth/validate')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toBeDefined();
            expect(response.body.data.email).toBe(registeredUser.email);
        });

        it('should not validate with invalid token', async () => {
            const response = await request(app)
                .get('/api/auth/validate')
                .set('Authorization', 'Bearer invalid_token');

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });

        it('should not validate without token', async () => {
            const response = await request(app)
                .get('/api/auth/validate');

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });
}); 