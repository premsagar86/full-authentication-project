import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import bodyParser from 'body-parser';
import AuthRoutes from './routes/AuthRoutes.js';
import cookieParser from 'cookie-parser';
import passport from './config/passport.js';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL, 
  methods:'*',
  credentials: true
}));
app.use(passport.initialize());
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/api/auth', AuthRoutes);
app.listen(3000, () => {
  console.log('listening on http://localhost:3000');
});