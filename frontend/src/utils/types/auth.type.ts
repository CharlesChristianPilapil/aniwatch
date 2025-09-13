import type { UserInfoType } from "./users.type";

export type LoginResponseType = {
    success: boolean;
    message: boolean;
    user_id: string;
};

export type VerificationResponseType = {
    success: boolean;
    message: string;
    data: UserInfoType;
    accessToken?: string;
    refreshToken?: string;
};

export type AuthProcessType = "login" | "register" | "verify-code" | "forgot-password";
