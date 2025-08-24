import nodemailer from 'nodemailer';
import { MFA_TYPE } from './constants.js';

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendOTP = async (to, otp, type = "otp") => {
    const subjects = {
        [MFA_TYPE.RESET_PASSWORD]: "Your Password Reset Code",
        [MFA_TYPE.CHANGE_PASSWORD]: "Your Change Password Code",
        [MFA_TYPE.UPDATE_EMAIL]: "Your Email Update Code",
        default: "Your One-Time Password (OTP)",
    }

    const actions = {
        [MFA_TYPE.RESET_PASSWORD]: "You have requested to reset your password.",
        [MFA_TYPE.CHANGE_PASSWORD]: "You have requested to change your password.",
        [MFA_TYPE.UPDATE_EMAIL]: "You have requested to update your email.",
    }

    const subject = subjects[type] || subjects.default;
    const action = actions[type] || "";

    const message = `
        <p>Hello,</p>
        ${action ? `<p>${action}</p>` : ""}
        <p>Your verification code is: <strong>${otp}</strong>.</p>
        <p>This code will expire in 5 minutes. If you did not request this, please ignore this email.</p>
        <p>Thank you.</p>
    `;

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject: subject,
            html: message,
        });
    } catch (error) {
        console.error("Failed to send OTP email:", error);
        throw error;
    }
};