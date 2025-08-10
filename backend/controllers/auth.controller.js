import bcrypt, { hash, truncates } from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOTP } from "../utils/sendEmail.js";
import sql from "../config/pg-db.js";
import handleFailedAttempt from "../utils/helpers/handleFailedAttempt.js";
import parseAsUTC from "../utils/helpers/parseAsUtc.js";
import generateOtp from "../utils/helpers/generateOtp.js";

const LOCK_DURATION = (1 * 60 + 30) * 1000;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

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
            INSERT INTO email_code_mfa (user_id, code, expires_at)
            VALUES (${user.id}, ${otp}, ${expiresAt});
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
            INSERT INTO email_code_mfa (user_id, code, expires_at)
            VALUES (${userId}, ${otp}, ${expiresAt});
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

        const token = jwt.sign({ id: user.id }, "secretkey");
        const { password: pass, is_verified, ...safeUser } = user;

        return res
            .cookie("accessToken", token, {
                httpOnly: true,
                secure: IS_PRODUCTION,
                sameSite: IS_PRODUCTION ? "None" : "Lax",
                maxAge: 24 * 60 * 60 * 1000,
            })
            .status(200)
            .json({
                success: true,
                message: "Logged in successfully.",
                data: safeUser,
            });
    };

    try {
        const [record] = await sql`
            SELECT * FROM email_code_mfa
            WHERE code = ${code} AND user_id = ${user_id} AND is_used = false;
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
            UPDATE email_code_mfa
            SET is_used = true
            WHERE id = ${record.id};
        `;

        return signInHandler(record);
    } catch (err) {
        const error = new Error(`OTP verification failed. ${err}`);
        return next(error);
    }
};

export const resendVerification = async (req, res, next) => {
    const { user_id } = req.body;

    try {
        await sql`
            DELETE FROM email_code_mfa
            WHERE user_id = ${user_id}
        `;

        const [user] = await sql`
            SELECT * FROM users
            WHERE id = ${user_id};
        `;

        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await sql`
            INSERT INTO email_code_mfa (user_id, code, expires_at)
            VALUES (${user_id}, ${otp}, ${expiresAt});
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

export const logout = (req, res, next) => {
    try {
        return res
            .clearCookie("accessToken", {
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

export const session = (req, res, next) => {
    try {
        return res.status(200).json({
            is_authenticated: true,
            user: req.user,
        });
    } catch (err) {
        const error = new Error("Something went wrong.");
        return next(error);
    }
};

export const resetPasswordRequest = async (req, res, next) => {
    const { email } = req.body;

    try {
        if (!email) {
            const error = new Error("Email is required.");
            error.status = 400;
            return next(error);
        }

        const [user] = await sql`
            SELECT * FROM users
            WHERE email = ${email};
        `;

        if (!user) {
            const error = new Error("User doesn't exist.");
            error.status = 404;
            return next(error)
        }

        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await sql`
            INSERT INTO reset_password_codes (user_id, code, expires_at)
            VALUES (${user.id}, ${otp}, ${expiresAt});
        `;

        await sendOTP(user.email, otp, "reset-password-otp");

        return res.status(200).json({
            success: true,
            message: "OTP has been resent to your email.",
            user_id: user.id
        });
    } catch (err) {
        const error = new Error("Something went wrong.");
        return next(error)
    }
}

export const verifyPasswordReset = async (req, res, next) => {
    const { code, user_id } = req.body;
    
    try {
        const [request] = await sql`
            SELECT * FROM reset_password_codes
            WHERE code = ${code} AND user_id = ${user_id};
        `;

        if (!request) {
            const error = new Error("Invalid request code.");
            error.status = 400;
            return next(error);
        }

        const expiresAt = new Date(request.expires_at);
        const now = new Date();

        if (now >= expiresAt || request.is_expired) {
            const error = new Error("Code expired. Request a new one.");
            error.status = 400;
            return next(error);
        }

        await sql`
            UPDATE reset_password_codes 
            SET is_expired = true
            WHERE code = ${code} AND user_id = ${user_id};
        `;

        return res.status(200).json({
            success: true,
            message: "Verification successful. You may now reset your password.",
            user_id: user_id
        });
    } catch (err) {
        const error = new Error("Something went wrong.");
        return next(error)
    }
}

export const resendResetRequestCode = async (req, res, next) => {
    const { user_id } = req.body;
    
    try {
        await sql`
            DELETE FROM reset_password_codes
            WHERE user_id = ${user_id};
        `;

        const [user] = await sql`
            SELECT * FROM users
            WHERE id = ${user_id};
        `;

        if (!user) {
            const error = new Error(`User with ID of ${user_id} not found.`);
            error.status = 404;
            return next(error);
        }

        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await sql`
            INSERT INTO reset_password_codes (user_id, code, expires_at)
            VALUES (${user_id}, ${otp}, ${expiresAt});
        `;

        await sendOTP(user.email, otp, "reset-password-otp");

        return res.status(200).json({
            success: true,
            message: "A new request code has been sent to your email.",
            user_id: user.id
        });
    } catch (err) {
        const error = new Error("Failed to resend request code.");
        next(error);
    }
}

export const resetPassword = async (req, res, next) => {
    const { user_id, password } = req.body;

    if (!user_id || !password) {
        const error = new Error("User ID and password are required.");
        error.status = 400;
        return next(error);
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await sql`
            UPDATE users
            SET password = ${hashedPassword}
            WHERE id = ${user_id}
            RETURNING id;
        `;

        if (!result) {
            const error = new Error("User not found or password not updated.");
            error.status = 404;
            return next(error);
        }

        return res.status(200).json({
            success: true,
            message: "Password successfully reset.",
        });
    } catch (err) {
        const error = new Error("Something went wrong while resetting password.");
        return next(error);
    }
}