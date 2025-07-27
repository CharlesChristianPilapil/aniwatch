import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendOTP = async (to, otp) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject: "Your OTP Code",
            html: `<p>Your OTP code is: <b>${otp}</b>. It will expire in 5 minutes.</p>`,
        });
        console.log("Email sent: ", info.response, to, otp);
    } catch (error) {
        console.error("Failed to send OTP email:", error);
        throw error;
    }
};