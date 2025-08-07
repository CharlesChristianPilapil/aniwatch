import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendOTP = async (to, otp, type = "otp") => {
    const subject =
        type === "otp"
            ? "Your One-Time Password (OTP)"
            : "Your Password Reset Code";

    const message =
        type === "otp"
            ? `
                <p>Hello,</p>
                <p>Your One-Time Password (OTP) is: <strong>${otp}</strong>.</p>
                <p>This code will expire in 5 minutes. Please do not share this code with anyone.</p>
                <p>Thank you.</p>
            `
            : `
                <p>Hello,</p>
                <p>You have requested to reset your password.</p>
                <p>Your verification code is: <strong>${otp}</strong>.</p>
                <p>This code will expire in 5 minutes. If you did not request this, please ignore this email.</p>
                <p>Thank you.</p>
            `;

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject: subject,
            html: message,
        });
        console.log("Email sent: ", info.response, to, otp);
    } catch (error) {
        console.error("Failed to send OTP email:", error);
        throw error;
    }
};