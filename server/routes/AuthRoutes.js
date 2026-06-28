import express from 'express';
import { login, register ,getMe , logout,refreshtokenrotation,forgotPassword,verifyOtp,resetPassword , authrateLimiter ,verifySignupOtp,sendSignupOtp} from '../controller/AuthControllers.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import passport from '../config/passport.js';
import { Session } from 'node:inspector';
const router = express.Router();

router.post('/register',authrateLimiter, register);
router.post('/login', authrateLimiter, login);
router.post("/signup/send-otp",sendSignupOtp);
router.post("/signup/verify-otp",verifySignupOtp);
router.get('/me',verifyToken,getMe);
router.post('/logout', logout);
router.post('/refresh-token',  refreshtokenrotation);
router.post("/forgot-password",authrateLimiter, forgotPassword);
router.post("/verify-otp",authrateLimiter, verifyOtp);
router.post("/reset-password",authrateLimiter, resetPassword);
export default router;