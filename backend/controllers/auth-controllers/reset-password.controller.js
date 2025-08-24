import sql from "../../config/pg-db.js";
import { MFA_TYPE } from "../../utils/constants.js";
import { sendOTP } from "../../utils/sendEmail.js";
import generateOtp from "../../utils/helpers/generateOtp.js";
import bcrypt from "bcryptjs";

// @desc    Reset password request code
// @route   POST /auth/reset-password/request
// @access  Public
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
            INSERT INTO user_code_mfa (user_id, code, type, expires_at)
            VALUES (${user.id}, ${otp}, ${MFA_TYPE.RESET_PASSWORD}, ${expiresAt});
        `;

        await sendOTP(user.email, otp, MFA_TYPE.RESET_PASSWORD);

        return res.status(200).json({
            success: true,
            message: "OTP has been resent to your email.",
            user_id: user.id
        });
    } catch (err) {
        console.error(err);
        const error = new Error("Something went wrong.");
        return next(error)
    }
}

// @desc    Verify reset password request otp
// @route   POST /auth/reset-password/verify
// @access  Public
export const verifyPasswordReset = async (req, res, next) => {
    const { code, user_id } = req.body;
    
    try {
        const [request] = await sql`
            SELECT * FROM user_code_mfa
            WHERE code = ${code} 
            AND user_id = ${user_id} 
            AND type = ${MFA_TYPE.RESET_PASSWORD};
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
            UPDATE user_code_mfa 
            SET is_expired = true, is_used = true
            WHERE code = ${code} 
            AND user_id = ${user_id}
            AND type = ${MFA_TYPE.RESET_PASSWORD};
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

// @desc    Resend reset password request code
// @route   POST /auth/reset-password/resend-code
// @access  Public
export const resendResetRequestCode = async (req, res, next) => {
    const { user_id } = req.body;
    
    try {
        await sql`
            DELETE FROM user_code_mfa
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
            INSERT INTO user_code_mfa (user_id, code, type, expires_at)
            VALUES (${user_id}, ${otp}, ${MFA_TYPE.RESET_PASSWORD}, ${expiresAt});
        `;

        await sendOTP(user.email, otp, MFA_TYPE.RESET_PASSWORD);

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


// @desc    Resend reset password request code
// @route   POST /auth/reset-password/reset
// @access  Public
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
};