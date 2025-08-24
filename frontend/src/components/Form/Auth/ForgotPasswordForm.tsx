import { useState } from "react";
import InputField from "../../InputField";
import Button from "../../Button";
import type { AuthProcessType } from "../../../utils/types/auth.type";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangePasswordRequestMutation, useResendResetRequestMutation, useResetPasswordMutation, useVerifyResetRequestMutation } from "../../../services/authService";
import toast from "react-hot-toast";
import type { CatchErrorType } from "../../../utils/types/error.type";
import useTimerLockout from "../../../hooks/useTimerLockout";
import formatTime from "../../../utils/helpers/formatTime";

type ForgotPasswordFormType = {
    onChangeProcess: (e: AuthProcessType) => void;
    disableModalActions: (e: boolean) => void;
};

const requestSchema = z.object({
    email: z.email().nonempty("Email is required.")
});

type RequestFormData = z.infer<typeof requestSchema>;

const verifySchema = z.object({
    code: z
        .string()
        .nonempty("Code is required.")
        .min(6, "Should not be less than 6 characters.")
        .max(6, "Should not exceed 6 characters.")
});

type VerifyFormData = z.infer<typeof verifySchema>;

const resetPasswordSchema = z.object({
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
}).refine((data) => data.password === data.repeat_password, {
    message: "Password does not match.",
    path: ["repeat_password"],
});

type resetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ForgotPasswordForm = ({
    onChangeProcess,
    disableModalActions,
}: ForgotPasswordFormType) => {

    const { timeLeft, reset: resetLockout } = useTimerLockout({ key: "aniwatch_reset_password_request" });

    const [step, setStep] = useState<"request" | "verify" | "reset">("request");
    const [userId, setUserId] = useState<number | null>(null);

    const [requestMutation, requestMutationMethods] = useChangePasswordRequestMutation();
    const [verifyMutation, verifyMutationMethods] = useVerifyResetRequestMutation();
    const [resendMutation, resendMutationMethods] = useResendResetRequestMutation();
    const [resetMutation, resetMutationMethods] = useResetPasswordMutation();

    const isLoading = requestMutationMethods.isLoading || verifyMutationMethods.isLoading || resetMutationMethods.isLoading;

    const requestMethod = useForm<RequestFormData>({
        resolver: zodResolver(requestSchema),
        reValidateMode: "onSubmit"
    });

    const verifyMethod = useForm<VerifyFormData>({
        resolver: zodResolver(verifySchema),
        reValidateMode: "onSubmit"
    });

    const resetMethod = useForm<resetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        reValidateMode: "onSubmit"
    });

    const handleReset = () => {
        requestMethod.reset();
        verifyMethod.reset();
        resetMethod.reset();
        setStep("request");
        setUserId(null);
    };

    const checkUserSession = () => {
        if (!userId) {
            toast.error("User session expired.\nPlease restart the reset process.");
            console.error("User session expired");
            return;
        }

        return +userId;
    }

    const handleRequest = async (data: RequestFormData) => {
        disableModalActions(true);
        const toastId = toast.loading("Sending request verification code...");
        try {
            const res = await requestMutation(data).unwrap();
            toast.success("Reset password code sent to your email.", { id: toastId });
            setStep("verify");
            requestMethod.reset();
            setUserId(+res.user_id);
        } catch (error) {
            console.error(error);
            const typesError = error as CatchErrorType;
            if (typesError.status === 404) {
                toast.dismiss();
                requestMethod.setError("email", {
                    type: "manual",
                    message: typesError.data?.message || "Email not found",
                });
            } else {
                toast.error("Failed to send verification.", { id: toastId });
            }
        } finally {
            disableModalActions(false);
        }
    };

    const handleVerify = async (data: VerifyFormData) => {
        const user_id = checkUserSession();
        if (!user_id) return;

        const payload = {
            ...data,
            user_id
        }

        const toastId = toast.loading("Verifying request code...");
        disableModalActions(true);
        try {
            const res = await verifyMutation(payload).unwrap();
            toast.success("Request code verified.", { id: toastId });
            setStep("reset");
            verifyMethod.reset();
            setUserId(+res.user_id);
        } catch (error) {
            console.error(error);
            const typesError = error as CatchErrorType;
            if (typesError.status !== 500) {
                toast.dismiss();
                verifyMethod.setError("code", {
                    type: "manual",
                    message: typesError.data?.message || "Invalid code.",
                });
            } else {
                toast.error("Failed to verify code.", { id: toastId });
            }
        } finally {
            disableModalActions(false);
        }
    }

    const handleResendCode = async () => {
        const user_id = checkUserSession();
        if (!user_id) return;

        const toastId = toast.loading("Resending verification code...");
        try {
            await resendMutation({ user_id }).unwrap();
            resetLockout();
            toast.success("A new code has been sent to your email.", { id: toastId });
        } catch (error) {
            console.error(error);
            toast.error("Failed to resend the verification code.\nPlease try again.", { id: toastId });
        }
    };

    const handleResetPassword = async (data: resetPasswordFormData) => {
        const user_id = checkUserSession();
        if (!user_id) return;

        const payload = {
            user_id,
            password: data.password
        };
        disableModalActions(true);
        const toastId = toast.loading("Validating your new password...");
        try {
            await resetMutation(payload).unwrap();
            handleReset();
            resetMethod.reset();
            toast.success("All set! Your password is now updated.", { id: toastId });
            onChangeProcess("login");
        } catch (error) {
            console.error(error);
            toast.error("Failed to reset password.\nPlease try again.", { id: toastId });
        } finally {
            disableModalActions(false);
        }
    }

    return (
        <div className="space-y-5 md:space-y-10 px-5 sm:px-10 py-10">
            {step === "request" && (
                <form onSubmit={requestMethod.handleSubmit(handleRequest)} className="space-y-4">
                    <h2 className="sub-header text-center"> Request Code </h2>
                    <InputField 
                        label="Email"
                        placeholder="user@email.com"
                        {...requestMethod.register("email")}
                        error={requestMethod.formState.errors.email?.message}
                    />
                    <Button disabled={requestMutationMethods.isLoading}>
                        Submit
                    </Button>
                </form>
            )}
            {step === "verify" && (
                <form onSubmit={verifyMethod.handleSubmit(handleVerify)} className="space-y-4">
                    <h2 className="sub-header text-center"> Request Code </h2>
                    <div className="space-y-1">
                        <InputField 
                            label="Code"
                            placeholder="Enter 6 digit code."
                            {...verifyMethod.register("code")}
                            error={verifyMethod.formState.errors.code?.message}
                        />
                        <div className="flex justify-between text-sm w-full">
                            {timeLeft !== 0 && (
                                <p>Time Remaining: {formatTime(timeLeft)}</p>
                            )}
                            <button
                                onClick={handleResendCode}
                                disabled={timeLeft !== 0 || resendMutationMethods.isLoading}
                                type="button"
                                className="ml-auto cursor-pointer hover:text-primary-accent focus:text-primary-accent disabled:pointer-events-none disabled:opacity-50 hover:underline focus:underline outline-none"
                            >
                                Resend
                            </button>
                        </div>
                    </div>
                    <Button disabled={verifyMutationMethods.isLoading}>
                        Submit
                    </Button>
                </form>
            )}
            {step === "reset" && (
                <form onSubmit={resetMethod.handleSubmit(handleResetPassword)} className="space-y-4">
                    <h2 className="sub-header text-center"> Request Code </h2>
                    <InputField 
                        label="Password"
                        type="password"
                        placeholder="Password."
                        {...resetMethod.register("password")}
                        error={resetMethod.formState.errors.password?.message}
                    />
                    <InputField 
                        label="Repeat Password"
                        type="password"
                        placeholder="Repeat password."
                        {...resetMethod.register("repeat_password")}
                        error={resetMethod.formState.errors.repeat_password?.message}
                    />
                    <Button disabled={resetMutationMethods.isLoading}>
                        Submit
                    </Button>
                </form>
            )}
            <p className="text-center text-sm"> 
                Go back to{' '} 
                <button 
                    disabled={isLoading}
                    onClick={() => onChangeProcess("login")}
                    className="text-primary-accent cursor-pointer hover:underline focus:underline hover:text-primary-accent focus:text-primary-accent outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                    Login
                </button> 
            </p>
        </div>
    );
};

export default ForgotPasswordForm;