import redisClient from "../config/redis.js";
import dotenv from 'dotenv';
dotenv.config();

const MAX_ATTEMPTS = parseInt(process.env.MAX_LOGIN_ATTEMPTS, 10) || 5;
const LOCKOUT_DURATION = parseInt(process.env.LOCKOUT_DURATION, 10) || 900; 

export const handleLoginfailed = async (email) => {
    try {
        const key = `login_failed:${email}`;
        const attempts = await redisClient.incr(key);
        if (attempts === 1) {
            await redisClient.expire(key, LOCKOUT_DURATION);
        }
        if (attempts >= MAX_ATTEMPTS) {
            await redisClient.expire(key, LOCKOUT_DURATION);
        }

        return attempts; 
    } catch (error) {
        console.error('Error handling login failed:', error);
        throw error;
    }
}

export const isAccountlock = async (email) => {
    try {
        const key = `login_failed:${email}`;
        const attempts = await redisClient.get(key);
        if (attempts >= MAX_ATTEMPTS) {
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error checking account lock status:', error);
        throw error;
    }
}

export const resetLoginAttempts = async (email) => {
    try {
        const key = `login_failed:${email}`;
        await redisClient.del(key);
    } catch (error) {
        console.error('Error resetting login attempts:', error);
        throw error;
    }
};


export const isTokenBlacklisted = async (token) => {
    try {
        const isBlacklisted = await redisClient.get(`blacklist:${token}`);
        return isBlacklisted === 'true';
    } catch (error) {
        console.error('Error checking token in Redis:', error);
        throw error;
    }
}