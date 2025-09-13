import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTP } from "../../utils/sendEmail.js";
import sql from "../../config/pg-db.js";
import handleFailedAttempt from "../../utils/helpers/handleFailedAttempt.js";
import parseAsUTC from "../../utils/helpers/parseAsUtc.js";
import generateOtp from "../../utils/helpers/generateOtp.js";
import { MFA_TYPE } from "../../utils/constants.js";

const LOCK_DURATION = (1 * 60 + 30) * 1000;
const ACCESS_TOKEN_DURATION = 15 * 60 * 1000;
const REFRESH_TOKEN_DURATION = 7 * 24 * 60 * 60 * 1000;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

// @desc    Login user
// @route   POST /auth/login
// @access  Public
export const login = async (req, res, next) => {
    const { identifier, password } = req.body;

    try {
        const now = new Date();

        const [attemptRow] = await sql`
            SELECT * FROM login_attempts 
            WHERE identifier = ${identifier};
        `;
        let updatedAttemptRow = attemptRow;

        if (attemptRow) {
            const lastAttempt = parseAsUTC(attemptRow.last_attempt);
            const lockedUntil = attemptRow.locked_until && parseAsUTC(attemptRow.locked_until);
            const timeSinceLastAttempt = now - lastAttempt;

            const isLockExpired = lockedUntil && lockedUntil <= now;
            const isInactive = timeSinceLastAttempt >= LOCK_DURATION;

            if (isLockExpired || isInactive) {
                await sql`DELETE FROM login_attempts WHERE identifier = ${identifier};`;
                updatedAttemptRow = null;
            }
        }

        if (
            updatedAttemptRow?.locked_until &&
            parseAsUTC(updatedAttemptRow.locked_until) > now
        ) {
            const error = new Error("Too many attempts. Try again later.");
            error.status = 429;
            return next(error);
        }

        const [user] = await sql`
            SELECT * FROM users 
            WHERE username = ${identifier} OR email = ${identifier};
        `;

        if (!user) {
            await handleFailedAttempt(
                identifier,
                updatedAttemptRow,
                now,
                LOCK_DURATION
            );
            const error = new Error("User not found.");
            error.status = 404;
            return next(error);
        }

        const isMatch = bcrypt.compareSync(password, user.password);

        if (!isMatch) {
            await handleFailedAttempt(
                identifier,
                updatedAttemptRow,
                now,
                LOCK_DURATION
            );
            const error = new Error("Invalid password.");
            error.status = 401;
            return next(error);
        }

        await sql`
            DELETE FROM login_attempts WHERE identifier = ${identifier}
        `;

        const otp = generateOtp();

        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await sql`
            INSERT INTO user_code_mfa (user_id, code, type, expires_at)
            VALUES (${user.id}, ${otp}, ${MFA_TYPE.LOGIN}, ${expiresAt});
        `;

        await sendOTP(user.email, otp);

        return res.status(200).json({
            success: true,
            message: "OTP sent to email",
            user_id: user.id,
        });
    } catch (err) {
        const error = new Error(`Login failed. ${err}`);
        return next(error);
    }
};


// @desc    Register user
// @route   POST /auth/register
// @access  Public
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
            const error = new Error("Username already exists.");
            error.status = 409;
            return next(error);
        }

        if (existingEmail) {
            const error = new Error("Email already exists.");
            error.status = 409;
            return next(error);
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const otp = generateOtp();

        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        const [result] = await sql`
            INSERT INTO users (username, email, password, name, is_verified)
            VALUES (${username}, ${email}, ${hashedPassword}, ${name}, ${false})
            RETURNING *;
        `;

        const userId = result.id;

        await sql`
            INSERT INTO user_code_mfa (user_id, code, type, expires_at)
            VALUES (${userId}, ${otp}, ${MFA_TYPE.REGISTER}, ${expiresAt});
        `;

        await sendOTP(email, otp);

        return res.status(200).json({
            success: true,
            message: "OTP sent to email for verification.",
            user_id: userId,
        });
    } catch (err) {
        console.error(err);
        const error = new Error(`Register error ${err}`);
        return next(error);
    }
};

// @desc    Verify OTP Code
// @route   POST /auth/verify
// @access  Public
export const verify = async (req, res, next) => {
    const { code, user_id } = req.body;

    const signInHandler = async (record) => {
        const userId = record.user_id;

        const [user] = await sql`
            SELECT * FROM users
            WHERE id = ${userId};
        `;

        if (!user) {
            const error = new Error("Something went wrong.");
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

        const accessToken = jwt.sign(
            { id: user.id }, 
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        const { password: pass, is_verified, ...safeUser } = user;

        const cookieOptions = {
            httpOnly: true,
            secure: IS_PRODUCTION,
            sameSite: IS_PRODUCTION ? "None" : "Lax",
            path: "/",
        }

        return res
            .cookie("accessToken", accessToken, {
                ...cookieOptions,
                maxAge: ACCESS_TOKEN_DURATION,
            })
            .cookie("refreshToken", refreshToken, {
                ...cookieOptions,
                maxAge: REFRESH_TOKEN_DURATION,
            })
            .status(200)
            .json({
                success: true,
                message: "Logged in successfully.",
                data: safeUser,
                accessToken,
                refreshToken,
            });
    };

    try {
        const [record] = await sql`
            SELECT * FROM user_code_mfa
            WHERE 
                code = ${code} 
                AND user_id = ${user_id}
                AND type IN (${MFA_TYPE.REGISTER}, ${MFA_TYPE.LOGIN}) 
                AND is_used = false;
        `;

        if (!record) {
            const error = new Error("Invalid or expired OTP.");
            error.status = 400;
            return next(error);
        }

        const expiresAtUTC = new Date(record.expires_at + "Z");
        const nowUTC = new Date();

        if (expiresAtUTC < nowUTC) {
            const error = new Error("OTP has expired.");
            error.status = 400;
            return next(error);
        }

        await sql`
            UPDATE user_code_mfa
            SET is_used = true
            WHERE id = ${record.id}
        `;

        return signInHandler(record);
    } catch (err) {
        console.error(err);
        const error = new Error(`OTP verification failed. ${err}`);
        return next(error);
    }
};


// @desc    Resend OTP Code
// @route   POST /auth/resend
// @access  Public
export const resendVerification = async (req, res, next) => {
    const { user_id, type } = req.body;

    try {
        await sql`
            DELETE FROM user_code_mfa
            WHERE user_id = ${user_id}
        `;

        const [user] = await sql`
            SELECT * FROM users
            WHERE id = ${user_id};
        `;

        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await sql`
            INSERT INTO user_code_mfa (user_id, code, type, expires_at)
            VALUES (${user_id}, ${otp}, ${type}, ${expiresAt});
        `;

        await sendOTP(user.email, otp);

        return res.status(200).json({
            success: true,
            message: `OTP has been resent to your email.`,
        });
    } catch (err) {
        const error = new Error("Failed to resend OTP code.");
        return next(error);
    }
};

// @desc    Logout user
// @route   POST /auth/logout
// @access  Private
export const logout = (_req, res, next) => {
    try {
        return res
            .clearCookie("accessToken", {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            })
            .clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            })
            .status(200)
            .json("User has been logged out.");
    } catch (err) {
        const error = new Error(`Logout failed.`);
        return next(error);
    }
};