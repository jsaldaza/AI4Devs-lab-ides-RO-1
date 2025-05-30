import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rate-limit.middleware';

const router = Router();
const authController = new AuthController();
const authMiddleware = new AuthMiddleware();

// Auth routes with rate limiting
router.post('/login', authLimiter, authController.login);
router.post('/register', authLimiter, authController.register);
router.get('/validate', authMiddleware.authenticate, authController.validate);
router.delete('/users/:email', authMiddleware.authenticate, authController.deleteUserByEmail);

export default router; 