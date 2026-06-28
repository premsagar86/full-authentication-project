import db from '../config/db.js';
//create user in db
export  const createUser = async (username, email, password,phoneno) => {
    try {
        const [result] = await db.execute(
            'INSERT INTO user (username, email, hashpassword,phoneno) VALUES (?, ?, ?, ?)',
            [username, email, password, phoneno]
        );
        return result;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};


// find the user in db
export const findUser = async (email) => {
    try {
        console.log("findUser email:", email);
        const [rows] = await db.execute(
            "SELECT * FROM user WHERE email=?",[email]
        );
        return rows[0];
     } catch (error) {
        console.error('Error finding user:', error);
        throw error;
    }
}
export const updatePassword = async (email, password) => {
    try {
        await db.execute(
            "UPDATE user SET hashpassword=? WHERE email=?",
            [password, email]
        );
    } catch (error) {
        console.error('Error updating password:', error);
        throw error;
    }
}

export const updateSignupOtp = async (email) => {
    try {
        await db.execute(
            "UPDATE user SET is_verified = true, signup_otp = NULL, otp_expires_at = NULL WHERE email = ?",
            [email]
        );
    } catch (error) {
        console.error('Error updating signup OTP:', error);
        throw error;
    }
};

export const findGoogleUser = async (googleId) => {
    try {
        const [rows] = await db.execute(
            "SELECT * FROM user WHERE google_id = ?",
            [googleId]
        );

        return rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    }
};

/* 
//insert token 
export const insertToken= async(userId, token, expiresAt)=>{
    try{
         await db.query(
            'INSERT INTO email_verification_tokens (user_id,token,expires_at) VALUES (?,?,?)',
            [userId, token, expiresAt]);
    }
    catch(error){
        throw error;
    }
}
export const findToken= async(token)=>{
    try{
         await db.query("SELECT * FROM email_verification_tokens WHERE token = ?", [token]);
    }
    catch(error){
        throw error;
    }
} */