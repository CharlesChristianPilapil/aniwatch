import sql from "../config/pg-db.js";
import { MFA_TYPE } from "../utils/constants.js";
import checkUser from "../utils/helpers/checkUser.js";
import generateOtp from "../utils/helpers/generateOtp.js";
import { sendOTP } from "../utils/sendEmail.js";
// import { sanitizeObject } from "../utils/helpers/sanitizeObject.js";

export const getCurrentUser = async (req, res, next) => {
    const user = req.user;
    try {
        const [dbUser] = await sql`
            SELECT * FROM users
            WHERE id = ${user.id};
        `;

        if (!dbUser) {
            const error = new Error("User not found.");
            error.status = 404;
            return next(error);
        };

        const { password, is_verified, created_at, ...safeUser } = dbUser;

        return res.status(200).json({
            success: true,
            info: {joined: created_at, ...safeUser},
        });
    } catch (error) {
        console.error("Error fetching user", error);
        const err = new Error("Server error");
        return next(err); 
    }
};

export const getUserInfo = async (req, res, next) => {
    const { username } = req.params;
    try {
        const [user] = await sql`
            SELECT * FROM users
            WHERE username = ${username};
        `;

        if (!user) {
            const error = new Error("User not found.");
            error.status = 404;
            return next(error);
        }

        const { password, is_verified, created_at, ...safeUser } = user;

        return res.status(200).json({
            success: true,
            info: { joined: created_at, ...safeUser },
        });
    } catch (error) {
        console.error("Error fetching user info", error);
        const err = new Error("Server error");
        return next(err);  
    }
}

export const updateAvatar = async (req, res, next) => {
    try {
        if (!req.file) {
            const error = new Error("No image found.");
            error.status = 400;
            return next(error);
        }

        const avatarUrl = req.file.path;

        const [updatedUser] = await sql`
            UPDATE users
            SET avatar_image = ${avatarUrl}
            WHERE id = ${req.user.id}
            RETURNING id, username, avatar_image
        `;
    
        if (!updatedUser) {
            const error = new Error("User not found.");
            error.status = 404;
            return next(error);
        }

        return res.status(200).json({
            success: true,
            message: "Avatar updated successfully",
            info: updatedUser,
        });
    } catch (err) {
        console.error(err);
        const error = new Error("Failed to update avatar");
        return next(error);
    }
}

export const removeAvatar = async (req, res, next) => {
    try {
        const [updatedUser] = await sql`
            UPDATE users
            SET avatar_image = null
            WHERE id = ${req.user.id}
            RETURNING id, username, avatar_image
        `;

        if (!updatedUser) {
            const error = new Error("User not found.");
            error.status = 404;
            return next(error);
        }

        return res.status(200).json({
            success: true,
            message: "Avatar removed successfully",
            info: updatedUser,
        });
    } catch (err) {
        console.error(err);
        const error = new Error("Failed to remove avatar");
        return next(error);
    }
}

export const updateProfile = async (req, res, next) => {
    const updates = req.body;

    if (Object.keys(updates).length === 0) {
        const error = new Error("No fields to update.");
        error.status = 400;
        return next(error);
    };

    try {
        const [user] = await sql`
            UPDATE users
            SET ${sql(updates)}
            WHERE id = ${req.user.id}
            RETURNING *;
        `;

        if (!user) {
            const error = new Error("User not found.");
            error.status = 404;
            return next(error);
        }

        const { password, created_at, ...safeUser } = user;

        return res
            .status(200)
            .json({
                success: true,
                message: "Profile updated.",
                info: { joined: created_at, ...safeUser}
            });
    } catch (err) {
        const error = new Error("Failed to update profile.");
        console.error(err);
        return next(error);
    };
};

export const userUpdateRequestVerification = async (req, res, next) => {
    const { type, code } = req.body;
    const { id } = req.user;

    try {
        const user = await checkUser(id);

        const [record] = await sql`
            SELECT * FROM user_code_mfa
            WHERE user_id = ${user.id}
                AND code = ${code}
                AND is_used = false 
                AND type = ${type}
            ORDER BY created_at DESC
            LIMIT 1;
        `;

        if (!record || record.is_used) {
            const errors = { code: "Code does not exist" }
            const error = new Error("Code does not exist.");
            error.status = 400;
            error.errors = errors;
            return next(error);
        }

        const expiresAt = new Date(record.expires_at + "Z");
        const now = new Date();

        if (expiresAt < now) {
            const errors = { code: "Code has expired." }
            const error = new Error("Code has expired.");
            error.status = 400;
            error.errors = errors;
            return next(error);
        }

        const { result } = await sql.begin(async (tx) => {
            const [request] = await tx`
                UPDATE user_update_request
                SET is_used = true
                WHERE is_used = false
                    AND user_id = ${record.user_id}
                    AND code_id = ${record.id}
                    AND verification_code = ${record.code}
                RETURNING *;
            `;

            await tx`
                UPDATE user_code_mfa
                SET is_used = true
                WHERE id = ${record.id}
                    AND code = ${record.code};
            `;

            const [result] = await tx`
                UPDATE users
                SET ${sql(request.field_name)} = ${request.new_value}
                WHERE id = ${user.id}
                RETURNING *;
            `;

            return { result }
        });

        const { password, ...safeUser } = result;

        return res.status(200).json({
            success: true,
            message: "Profile updated succesfully.",
            info: safeUser,
        });
    } catch (err) {
        console.error(err);
        const error = new Error("Failed to verify code.");
        return next(error);
    }
}

export const resendUserUpdateVerification = async (req, res, next) => {
    const { type, field_name } = req.body;
    let { new_value } = req.body;
    const { id } = req.user;
    
    try {
        const user = await checkUser(id);

        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        if (field_name === "password") {
            const salt = await bcrypt.genSalt(10);
            new_value = await bcrypt.hash(new_value, salt);
        }

        await sendVerification({
            user_id: user.id,
            type,
            new_value,
            field_name,
            code: otp,
            expires_at: expiresAt,
        });

        await sendOTP(
            field_name === 'email' ? new_value : user.email, 
            otp, 
            type
        );

        const { password, ...safeUser } = user;

        return res.status(200).json({
            success: true,
            info: safeUser 
        });
    } catch (err) {
        console.error(err);
        const error = new Error("Failed to resend verification.");
        return next(error);
    }
}

export const updateEmail = async (req, res, next) => {
    const { email: new_email } = req.body;
    const { id } = req.user;

    const mfa_email = MFA_TYPE.UPDATE_EMAIL;

    try {
        const user = await checkUser(id);

        if (new_email === user.email) {
            const errors = { email: 'Email is unchanged.'}
            const error = new Error("Email is unchanged.");
            error.status = 409;
            error.errors = errors;
            return next(error);
        }

        const [existingUsers] = await sql`
            SELECT * FROM users
            WHERE email = ${new_email};
        `;

        if (existingUsers) {
            const errors = { email: 'Email already exist.'}
            const error = new Error("Email already exist.");
            error.status = 409;
            error.errors = errors;
            return next(error);
        }

        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await sendVerification({
            user_id: user.id,
            type: mfa_email,
            code: otp,
            new_value: new_email,
            field_name: "email",
            expires_at: expiresAt,
        });

        await sendOTP(new_email, otp, mfa_email);

        const { password, ...safeUser } = user;

        return res.status(200).json({
            success: true,
            message: "Request to update email sent.",
            info: safeUser
        });
    } catch (err) {
        console.error(err)
        const error = new Error("Failed to update email.");
        return next(error);
    }
}

const sendVerification = async ({
    type,
    user_id,
    code,
    expires_at,
    field_name,
    new_value
}) => {
    await sql.begin(async (tx) => {
        await tx`
            UPDATE user_code_mfa
            SET is_used = true
            WHERE type = ${type}
                AND user_id = ${user_id};
        `;

        const [mfa_code] = await tx`
            INSERT INTO user_code_mfa (user_id, code, type, expires_at)
            VALUES (${user_id}, ${code}, ${type}, ${expires_at})
            RETURNING *;
        `;

        await tx`
            UPDATE user_update_request
            SET is_used = true
            where user_id = ${user_id} 
                AND field_name = ${field_name};
        `;

        await tx`
            INSERT INTO user_update_request (user_id, code_id, field_name, new_value, verification_code, expires_at)
            VALUES (${user_id}, ${mfa_code.id} , ${field_name}, ${new_value}, ${mfa_code.code}, ${mfa_code.expires_at});
        `
    });
};