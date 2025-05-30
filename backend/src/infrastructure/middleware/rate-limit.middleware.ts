import rateLimit, { RateLimitRequestHandler, Options } from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '../logging/Logger';

const logger = Logger.getInstance();

interface LimiterOptions {
    windowMs: number;
    max: number;
    message: string;
    path: string;
}

// Base limiter configuration
const createLimiter = (options: LimiterOptions): RateLimitRequestHandler => {
    const { path, windowMs, max, message } = options;

    return rateLimit({
        windowMs,
        max,
        message: { success: false, message },
        handler: (req: Request, res: Response, _next: NextFunction, rateLimitOptions: Options) => {
            logger.warn('Rate limit exceeded', {
                path,
                ip: req.ip,
                windowMs: rateLimitOptions.windowMs,
                max: rateLimitOptions.max
            });
            res.status(429).json({ success: false, message });
        },
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    });
};

// Configuración según el ambiente
const isDevelopment = process.env.NODE_ENV === 'development';

// Limiter para autenticación
export const authLimiter = createLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: isDevelopment ? 100 : 5, // 100 intentos en desarrollo, 5 en producción
    message: isDevelopment
        ? 'Demasiados intentos de autenticación. Por favor, espere un momento.'
        : 'Demasiados intentos de autenticación. Por favor, intente nuevamente en 15 minutos.',
    path: '/auth'
});

// Limiter general para API
export const apiLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    max: isDevelopment ? 1000 : 100,
    message: isDevelopment
        ? 'Demasiadas solicitudes. Por favor, espere un momento.'
        : 'Demasiadas solicitudes. Por favor, intente nuevamente más tarde.',
    path: '/api'
});

// Limiter para cambio de contraseña
export const passwordLimiter = createLimiter({
    windowMs: 60 * 60 * 1000,
    max: isDevelopment ? 50 : 3,
    message: isDevelopment
        ? 'Demasiados intentos de cambio de contraseña. Por favor, espere un momento.'
        : 'Demasiados intentos de cambio de contraseña. Por favor, intente nuevamente en 1 hora.',
    path: '/password'
}); 