/* import dotenv from 'dotenv';
dotenv.config();
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import db from "../config/db.js";
import { findGoogleUser } from "../models/usermodel.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL|| "http://localhost:3000/api/auth/google/callback",
        },

        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                const googleId = profile.id;
                const name = profile.displayName;

                let [googleuser] = await db.execute(
            "SELECT * FROM user WHERE google_id = ?",
            [googleId]
        );

                if (!googleuser) {
                    const [users] = await db.query(
                        "SELECT * FROM user WHERE email=?",
                        [email]
                    );

                    if (users.length > 0) {
                        await db.query(
                            "UPDATE user SET google_id=? WHERE email=?",
                            [googleId, email]
                        );

                        googleuser = users;
                    } else {

                        const [result] = await db.query(
                            'INSERT INTO user(name,email,google_id) VALUES (?,?,?)',
                            [name, email, googleId]
                        );

                        googleuser = [
                            {
                                id: result.insertId,
                                name,
                                email,
                                google_id: googleId,
                            },
                        ];
                        console.log("ACCESS TOKEN:", accessToken);
                        console.log("PROFILE:", profile);
                    }
                }

                return done(null, googleuser[0]);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

export default passport; */
import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import db from "../config/db.js";


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:3000/api/auth/google/callback",
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        const username = profile.displayName;

        console.log("Google Login User:", email);

        // Check existing Google user
        const [googleUsers] = await db.execute(
          "SELECT * FROM user WHERE google_id = ?",
          [googleId]
        );

        if (googleUsers.length > 0) {
          return done(null, googleUsers[0]);
        }

        // Check existing email user
        const [emailUsers] = await db.execute(
          "SELECT * FROM user WHERE email = ?",
          [email]
        );

        if (emailUsers.length > 0) {
          await db.execute(
            "UPDATE user SET google_id = ? WHERE email = ?",
            [googleId, email]
          );

          const updatedUser = {
            ...emailUsers[0],
            google_id: googleId,
          };

          return done(null, updatedUser);
        }

        // Create new Google user
        const [result] = await db.execute(
          `
          INSERT INTO user
          (username, email, google_id)
          VALUES (?, ?, ?)
          `,
          [username, email, googleId]
        );

        const newUser = {
          id: result.insertId,
          username,
          email,
          google_id: googleId,
        };

        return done(null, newUser);
      } catch (error) {
        console.error("Google OAuth Error:", error);
        return done(error, null);
      }
    }
  )
);

export default passport;