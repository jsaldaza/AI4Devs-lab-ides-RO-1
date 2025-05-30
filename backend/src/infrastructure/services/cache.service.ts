import { Redis } from 'ioredis';
import { RedisConfig } from '../../config/redis.config';
import { Logger } from '../../utils/logger';

export interface CacheOptions {
    ttl?: number; // Time to live in seconds
    nullable?: boolean; // Whether to cache null values
}

export class CacheService {
    private static instance: CacheService;
    private readonly redis: Redis | null;
    private readonly logger = Logger.getInstance();
    private readonly defaultTTL = 3600; // 1 hour in seconds
    private readonly isAvailable: boolean;

    private constructor() {
        this.redis = RedisConfig.getInstance();
        this.isAvailable = this.redis !== null;
        if (!this.isAvailable) {
            this.logger.warn('Cache service initialized without Redis - all cache operations will be no-op');
        }
    }

    public static getInstance(): CacheService {
        if (!CacheService.instance) {
            CacheService.instance = new CacheService();
        }
        return CacheService.instance;
    }

    /**
     * Get a value from cache
     * @param key Cache key
     * @returns Cached value or null if not found
     */
    public async get<T>(key: string): Promise<T | null> {
        if (!this.isAvailable) return null;
        try {
            const value = await this.redis!.get(key);
            if (!value) return null;
            return JSON.parse(value) as T;
        } catch (error) {
            this.logger.error('Error getting value from cache:', error);
            return null;
        }
    }

    /**
     * Set a value in cache
     * @param key Cache key
     * @param value Value to cache
     * @param options Cache options
     */
    public async set(key: string, value: any, options: CacheOptions = {}): Promise<void> {
        if (!this.isAvailable) return;
        try {
            if (value === null && !options.nullable) {
                return;
            }

            const ttl = options.ttl || this.defaultTTL;
            await this.redis!.set(key, JSON.stringify(value), 'EX', ttl);
        } catch (error) {
            this.logger.error('Error setting value in cache:', error);
        }
    }

    /**
     * Delete a value from cache
     * @param key Cache key
     */
    public async delete(key: string): Promise<void> {
        if (!this.isAvailable) return;
        try {
            await this.redis!.del(key);
        } catch (error) {
            this.logger.error('Error deleting value from cache:', error);
        }
    }

    /**
     * Get or set cache value with callback
     * @param key Cache key
     * @param callback Function to get value if not in cache
     * @param options Cache options
     */
    public async getOrSet<T>(
        key: string,
        callback: () => Promise<T>,
        options: CacheOptions = {}
    ): Promise<T | null> {
        if (!this.isAvailable) {
            try {
                return await callback();
            } catch (error) {
                this.logger.error('Error executing callback without cache:', error);
                return null;
            }
        }

        try {
            const cachedValue = await this.get<T>(key);
            if (cachedValue !== null) {
                return cachedValue;
            }

            const value = await callback();
            await this.set(key, value, options);
            return value;
        } catch (error) {
            this.logger.error('Error in getOrSet operation:', error);
            return null;
        }
    }

    /**
     * Clear all cache
     */
    public async clear(): Promise<void> {
        if (!this.isAvailable) return;
        try {
            await this.redis!.flushall();
        } catch (error) {
            this.logger.error('Error clearing cache:', error);
        }
    }

    /**
     * Check if key exists in cache
     * @param key Cache key
     */
    public async exists(key: string): Promise<boolean> {
        if (!this.isAvailable) return false;
        try {
            const exists = await this.redis!.exists(key);
            return exists === 1;
        } catch (error) {
            this.logger.error('Error checking key existence:', error);
            return false;
        }
    }

    /**
     * Set multiple values in cache
     * @param entries Array of key-value pairs
     * @param options Cache options
     */
    public async mset(
        entries: Array<{ key: string; value: any }>,
        options: CacheOptions = {}
    ): Promise<void> {
        if (!this.isAvailable) return;
        try {
            const pipeline = this.redis!.pipeline();
            const ttl = options.ttl || this.defaultTTL;

            entries.forEach(({ key, value }) => {
                if (value !== null || options.nullable) {
                    pipeline.set(key, JSON.stringify(value), 'EX', ttl);
                }
            });

            await pipeline.exec();
        } catch (error) {
            this.logger.error('Error in bulk cache operation:', error);
        }
    }
} 