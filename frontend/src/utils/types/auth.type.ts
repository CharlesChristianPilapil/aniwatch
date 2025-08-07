export type LoginResponseType = {
    success: boolean;
    message: boolean;
    user_id: string;
};

export type VerificationResponseType = {
    id: number;
    username: string;
    email: string;
};

export type AuthProcessType = "login" | "register" | "verify-code" | "forgot-password";
