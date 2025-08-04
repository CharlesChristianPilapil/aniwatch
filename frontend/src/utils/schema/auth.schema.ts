import * as z from "zod";

export const loginSchema = z.object({
    identifier: z.string().nonempty("This field is required."),
    password: z.string().nonempty("Password is required."),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const verifySchema = z.object({
    code: z
        .string()
        .nonempty("OTP Code is required.")
        .min(6, "OTP must be 6 characters.")
        .max(6, "OTP must be 6 characters."),
});

export type VerifyFormData = z.infer<typeof verifySchema>;

export const registerSchema = z
    .object({
        name: z
            .string()
            .nonempty("Name is required.")
            .min(3, "Name must be atleast 3 characters.")
            .max(15, "Name must not exceed 15 characters."),
        username: z
            .string()
            .nonempty("Username is required.")
            .min(5, "Username must be atleast 5 characters.")
            .max(15, "Username must not exceed 15 characters."),
        email: z.email().nonempty("Email is required."),
        password: z
            .string()
            .nonempty("Password is required.")
            .min(8, "Password must be atleast 8 characters.")
            .max(15, "Password must not exceed 15 characters.")
            .regex(
                /[A-Z]/,
                "Password must contain at least one uppercase letter."
            )
            .regex(/[0-9]/, "Password must contain at least one number."),
        repeat_password: z.string().nonempty("Please confirm your password."),
    })
    .refine((data) => data.password === data.repeat_password, {
        message: "Password does not match.",
        path: ["repeat_password"],
    });

export type RegisterFormData = z.infer<typeof registerSchema>;
