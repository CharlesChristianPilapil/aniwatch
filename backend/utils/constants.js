export const VERIFICATION_TYPE = {
    EMAIL_CODE: 'EMAIL_CODE',
    TOTP: 'TOTP',
}

export const MFA_TYPE = {
    LOGIN: 'login_mfa',
    REGISTER: 'register_mfa',
    UPDATE_EMAIL: 'update_email_mfa',
    RESET_PASSWORD: 'reset_password_mfa',
    CHANGE_PASSWORD: 'change_password_mfa',
}

export const ANIME_API = process.env.ANIME_API;

export const DOMAIN_URL = process.env.NODE_ENV === "production" ? ".cc-anistream.vercel.app" : undefined;