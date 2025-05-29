import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../application/services/auth.service';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export class AuthMiddleware {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    authenticate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return res.status(401).json({
                    success: false,
                    message: 'No authorization token provided'
                });
            }

            // Extract token from Bearer header
            const parts = authHeader.split(' ');

            if (parts.length !== 2 || parts[0] !== 'Bearer') {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid authorization format. Use Bearer token'
                });
            }

            const token = parts[1];

            try {
                // Validate token
                const decoded = await this.authService.validateToken(token);
                req.user = decoded;
                next();
            } catch (error) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid or expired token'
                });
            }
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Authentication failed'
            });
        }
    };

    requireAdmin = (req: Request, res: Response, next: NextFunction) => {
        if (!req.user?.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }
        next();
    };
} 