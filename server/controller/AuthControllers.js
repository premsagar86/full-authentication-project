import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUser, createUser, updatePassword, updateSignupOtp } from '../models/usermodel.js';
import { transporter } from '../config/mailer.js';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import passport from '../config/passport.js';
import db from '../config/db.js';
import redisClient from '../config/redis.js';
import { handleLoginfailed, isAccountlock, resetLoginAttempts, isTokenBlacklisted } from '../models/securemodel.js';


const CLIENT_URL = process.env.CLIENT_URL;
// Signup logic
export const register = async (req, res) => {
    try {
        const { username, email, password, phoneno } = req.body;
        console.log('Register request body:', req.body);
        if (!username || !email || !password || !phoneno) {
            return res.status(400).json({ message: "All fields are required", received: { username, email, password: !!password, phoneno } });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }
        const isExistUser = await findUser(email);
        if (isExistUser) {
            return res.status(400).json({ message: "User already exist" });
        }
        const hashedpassword = await bcrypt.hash(password, 12);

        const user = await createUser(username, email, hashedpassword, phoneno);

        const userId = user.insertId;
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);
        console.log("userid", userId);
        console.log("token", token);
        console.log("expiresat", expiresAt)
        res.status(201).json({
            message: "Account created. Check your email."
        })
        console.log(user);
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
// Email verification logic
export const sendSignupOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email required"
            });
        }

        console.log('Email received for signup OTP:', email); // Debug log

        const existingUser = await findUser(email);
        const existingSignupData = await redisClient.get(`signup:${email}`);
        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }
        if (existingSignupData) {
            return res.status(400).json({
                message: "OTP already sent. Check your email."
            });
        }
        const otp = crypto
            .randomInt(100000, 999999)
            .toString();
        console.log(`Generated OTP for ${email}:`, otp); // Debug log

        await redisClient.set(
            `signup:${email}`,
            JSON.stringify({
                otp,
                verified: false
            }),
            {
                EX: 60
            }
        );
        await transporter.sendMail({
            from: process.env.Auth_mail,
            to: email,
            subject: "Email Verification OTP",
            html: `
                <h2>Email Verification</h2>
                <h1>${otp}</h1>
                <p>Valid for 1 minute</p>
            `
        });

        return res.status(200).json({
            message: "OTP sent successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server Error"
        });
    }
};

export const verifySignupOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const data = await redisClient.get(
            `signup:${email}`
        );

        if (!data) {
            return res.status(400).json({
                message: "OTP expired"
            });
        }

        const record = JSON.parse(data);

        if (record.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        record.verified = true;

        await redisClient.set(
            `signup:${email}`,
            JSON.stringify(record),
            {
                EX: 60
            }
        );

        return res.status(200).json({
            message: "Email verified"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};
// Signin logic
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login request body:', req.body);
        await redisClient.get(`signup:${email}`);
        const user = await findUser(email);

        if (!user) {
            await handleLoginfailed(email);
            return res.status(400).json({ message: "User not found" });
        }
        if (!email) {
            return res.status(400).json({ message: "Email is required" })
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required" })
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "password length must be at least 8 characters " })
        }
        const locked = await isAccountlock(email);
        if (locked) {
            return res.status(429).json({
                success: false,
                message: "Account locked due to too many failed login attempts. Please try again after 15 minutes."
            });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.hashpassword);

        if (!isPasswordCorrect) {
            await handleLoginfailed(user.email);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        await resetLoginAttempts(user.email);

        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role
        };

        const accesstoken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
        const refreshtoken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });


        res.cookie("accessToken", accesstoken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 2 * 60 * 1000,
        });
        res.cookie("refreshToken", refreshtoken, {
            httpOnly: true,
            secure: false,     // only HTTPS
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            message: 'Login successful',
            token: accesstoken
        });
        console.log(accesstoken);

    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
        console.log(error);
    }
};
// is that user authenticated or not
export const getMe = (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ isAuthenticated: false });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.json({ isAuthenticated: true, user: decoded });
    } catch {
        return res.status(401).json({ isAuthenticated: false });
    }
};
// logout logic
export const logout = async (req, res) => {

    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        const expiresIn = parseInt(process.env.REFRESH_TOKEN_EXPIRATION, 10) || 604800;

        await redisClient.set(`blacklist:${refreshToken}`,
            'true', {
            EX: expiresIn
        }
        )
    }

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    res.status(200).json({ message: "Logged out successfully" });
};
// refresh token logic
export const refreshtokenrotation = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({
            message: "No refreshToken provided"
        })
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const payload = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role
        }
        const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 2 * 60 * 1000
        })
        res.status(200).json({
            message: "Access token refreshed",
            accessToken: newAccessToken
        });
        console.log("New access token:", newAccessToken);
        console.log("Access token refreshed at:", new Date().toLocaleTimeString());
    }
    catch (error) {
        console.error("Error refreshing access token:", error);
        return res.status(403).json({
            message: "Invalid refresh token or refresh token expired"
        })
    }
}; const otpStore = {}; // TEMP (use DB in production)

// STEP 1 → SEND OTP
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({ message: "Email is required" })
        }
        const user = await findUser(email);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const existingOtpData = await redisClient.get(`reset:${email}`);

        if (existingOtpData) {
            return res.status(400).json({ message: "OTP already sent. Check your email." });
        }
        const username = user.username;
        const otp = crypto.randomInt(100000, 999999).toString();
        console.log(`Generated OTP for ${email}:`, otp); // Debug log
        await redisClient.set(
            `reset:${email}`,
            JSON.stringify({
                otp,
                verified: false
            }),
            {
                EX: 60
            }
        );

        const htmlContent = `
        <div style="font-family: Arial, sans-serif; background-linear-gradient(to bottom, #f8f9fa, #e9ecef); padding: 20px; text-align: center;">
        <div style="display: inline-block; background-color: #fff; padding: 20px; border-radius: 10px;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p style="color: #666;">Hi ${username},</p>
            <p style="color: #666;">We received a request to reset your password. Use the OTP below to reset it:</p>
            <div style="display: inline-block; text-align: center; border: 1px dashed #ccc; background-color: #007BFF; opacity: 0.8; color: #fff; padding: 10px 20px; font-size: 24px; letter-spacing: 4px; margin: 20px 0; border-radius: 5px;">
                ${otp}  
            </div>
            <p style="color: #666;">This OTP is valid for 5 minutes.</p>
            <p style="color: #666;">If you didn't request a password reset, please ignore this email.</p>
        </div>
        </div>
        `;

        await transporter.sendMail({
            from: process.env.Auth_mail,
            to: email,
            subject: "Your OTP Code",
            html: htmlContent
        });

        res.json({ message: "OTP sent to your email" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};



// STEP 2 → VERIFY OTP
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required"
            });
        }

        const data = await redisClient.get(
            `reset:${email}`
        );

        if (!data) {
            return res.status(400).json({
                message: "OTP expired"
            });
        }

        const record = JSON.parse(data);

        if (record.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }
        if (!record.otp || record.expires < Date.now()) {
            return res.status(400).json({
                message: "OTP expired"
            })
        }

        record.verified = true;

        await redisClient.set(
            `reset:${email}`,
            JSON.stringify(record),
            {
                EX: 60
            }
        );

        return res.status(200).json({
            message: "OTP verified successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};
// STEP 3 → RESET PASSWORD
export const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const data = await redisClient.get(
            `reset:${email}`
        );

        if (!data) {
            return res.status(400).json({
                message: "OTP verification required"
            });
        }

        const record = JSON.parse(data);

        if (!record.verified) {
            return res.status(400).json({
                message: "Please verify OTP first"
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            12
        );

        await updatePassword(
            email,
            hashedPassword
        );

        await redisClient.del(
            `reset:${email}`
        );

        return res.status(200).json({
            message: "Password updated successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Server Error"
        });
    }
};

// rate limiter

export const authrateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 12, // limit each IP to 5 requests per windowMs
    handler: (req, res) => {
        res.status(429).json({ message: "Too many requests, please try again later." })
    }
});
