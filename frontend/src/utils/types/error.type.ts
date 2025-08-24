export type CatchErrorType<T = undefined> = {
    status?: number;
    data?: {
        success: boolean;
        message: string;
        errors?: T
    };
};