import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthMiddleware } from '../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();
const authMiddleware = new AuthMiddleware();

// Auth routes
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/validate', authMiddleware.authenticate, authController.validate);

export default router; 