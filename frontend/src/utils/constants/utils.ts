export const BREAKPOINTS = {
    XS: 640,
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    "2XL": 1536,
};

export const MFA_TYPE = {
    LOGIN: 'login_mfa',
    REGISTER: 'register_mfa',
    UPDATE_EMAIL: 'update_email_mfa',
    RESET_PASSWORD: 'reset_password_mfa',
    CHANGE_PASSWORD: 'change_password_mfa',
} as const;

export type MFAType = typeof MFA_TYPE[keyof typeof MFA_TYPE];