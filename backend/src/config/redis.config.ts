import Redis from 'ioredis';
import { Logger } from '../utils/logger';

export class RedisConfig {
    private static instance: Redis | null = null;
    private static readonly logger = Logger.getInstance();
    private static retryCount = 0;
    private static readonly MAX_RETRIES = 3;

    private static readonly config = {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        maxRetriesPerRequest: 3,
        retryStrategy: (times: number) => {
            if (process.env.NODE_ENV === 'development') {
                RedisConfig.logger.warn('Redis connection failed in development mode. Continuing without Redis...');
                return null;
            }
            RedisConfig.retryCount++;
            const delay = Math.min(times * 50, 2000);
            RedisConfig.logger.warn(`Retrying Redis connection in ${delay}ms... (Attempt ${RedisConfig.retryCount}/${RedisConfig.MAX_RETRIES})`);
            return delay;
        }
    };

    public static getInstance(): Redis | null {
        if (RedisConfig.instance === null) {
            if (process.env.NODE_ENV === 'development') {
                RedisConfig.logger.warn('Running in development mode without Redis');
                return null;
            }

            try {
                RedisConfig.instance = new Redis(RedisConfig.config);

                RedisConfig.instance.on('error', (error) => {
                    RedisConfig.logger.error('Redis connection error:', error);
                    if (process.env.NODE_ENV === 'development') {
                        RedisConfig.instance = null;
                    }
                });

                RedisConfig.instance.on('connect', () => {
                    RedisConfig.logger.info('Successfully connected to Redis');
                    RedisConfig.retryCount = 0;
                });

                RedisConfig.instance.on('ready', () => {
                    RedisConfig.logger.info('Redis is ready to accept commands');
                });
            } catch (error) {
                RedisConfig.logger.error('Failed to initialize Redis:', error);
                if (process.env.NODE_ENV === 'development') {
                    RedisConfig.logger.warn('Continuing without Redis in development mode...');
                    return null;
                }
                throw error;
            }
        }

        return RedisConfig.instance;
    }
} 