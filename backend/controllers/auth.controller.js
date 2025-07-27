import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import otpGenerator from 'otp-generator';
import { sendOTP } from "../utils/sendEmail.js";
import supabase from "../config/supabase.js";
import sql from "../config/pg-db.js";

export const login = async (req, res, next) => {
    const { identifier, password } = req.body;

    try {

        const users = await sql`
            SELECT * FROM users 
            WHERE username = ${identifier} OR email = ${identifier};
        `;

        if (!users.length) {
            const error = new Error("User not found.");
            error.status = 404;
            return next(error);
        }

        const user = users[0];

        const isMatch = bcrypt.compareSync(password, user.password);

        if (!isMatch) {
            const error = new Error("Invalid password.");
            error.status = 401;
            return next(error);
        }

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await sql`
            INSERT INTO email_code_mfa (user_id, code, expires_at)
            VALUES (${user.id}, ${otp}, ${expiresAt});
        `;

        await sendOTP(user.email, otp);

        return res.status(200).json({ message: "OTP sent to email" });
    } catch (err) {
        const error = new Error(`Login failed. ${err}`);
        return next(error);
    }
}

export const register = async (req, res, next) => {
    const { name, username, email, password } = req.body;

    try {
        const [existingUsername] = await sql`
            SELECT * FROM users 
            WHERE username = ${username} LIMIT 1;
        `;

        const [existingEmail] = await sql`
            SELECT * FROM users
            WHERE email = ${email} LIMIT 1;
        `;

        if (existingUsername) {
            const error = new Error('Username already exists.');
            error.status = 409;
            return next(error);
        }

        if (existingEmail) {
            const error = new Error('Email already exists.');
            error.status = 409;
            return next(error);
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        const [result] = await sql`
            INSERT INTO users (username, email, password, name, is_verified)
            VALUES (${username}, ${email}, ${hashedPassword}, ${name}, ${false})
            RETURNING *;
        `;

        const userId = result.id;

        await sql`
            INSERT INTO email_code_mfa (user_id, code, expires_at)
            VALUES (${userId}, ${otp}, ${expiresAt});
        `;

        await sendOTP(email, otp);

        return res.status(200).json("OTP send to email for verification.");
    } catch (err) {
        console.log(err);
        const error = new Error(`Register error ${err}`);
        return next(error);
    }
}

export const verify = async (req, res, next) => {
    const { code } = req.body;

    const signInHandler = async (record) => {
        const userId = record.user_id;
        
        const [user] = await sql`
            SELECT * FROM users
            WHERE id = ${userId};
        `;

        if (!user) {
            const error = new Error("Something went wrong." );
            error.status = 404;
            return next(error);
        }

        if (!user.is_verified) {
            await sql`
                UPDATE users
                SET is_verified = ${true}
                WHERE id = ${userId};
            `;
        }

        const token = jwt.sign({ id: user.id }, "secretkey");
        const { password: pass, is_verified, ...safeUser } = user;

        return res
            .cookie("accessToken", token, { httpOnly: true })
            .status(200)
            .json(safeUser);
    }

    try {
        const [record] = await sql`
            SELECT * FROM email_code_mfa
            WHERE code = ${code};
        `;

        if (!record) {
            const error = new Error("Invalid or expired OTP.");
            error.status = 400;
            return next(error);
        };

        const expiresAtUTC = new Date(record.expires_at + 'Z');
        const nowUTC = new Date();

        if (expiresAtUTC < nowUTC) {
            const error = new Error("OTP has expired.");
            error.status = 400;
            return next(error);
        }

        return signInHandler(record);
    } catch (err) {
        const error = new Error(`OTP verification failed. ${err}`);
        return next(error);
    }
}

export const logout = (req, res, next) => {
    try {
        return res
            .clearCookie("accessToken", {
                secure: true,
                sameSite: "none"
            })
            .status(200)
            .json("User has been logged out.");
    } catch (err) {
        const error = new Error(`Logout failed.`);
        return next(error);
    }
}