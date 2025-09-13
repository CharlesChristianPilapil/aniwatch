import Button from "../../Button";
import InputField from "../../InputField";
import formatTime from "../../../utils/helpers/formatTime";
import useTimerLockout from "../../../hooks/useTimerLockout";
import {
    useResendVerificationMutation,
    useVerifyMutation,
} from "../../../services/authService";
import type { CatchErrorType } from "../../../utils/types/error.type";
import toast from "react-hot-toast";
import type { Path, useForm } from "react-hook-form";
import type { VerifyFormData } from "../../../utils/schema/auth.schema";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../../slices/authSlice";

type VerifyFormType<T extends VerifyFormData, P> = {
    methods: ReturnType<typeof useForm<T>>;
    userId: string;
    error?: string;
    onError: (e: string | undefined) => void;
    onSuccess: () => void;
    onChangeProcess: (e: P) => void;
    disableModalActions?: (e: boolean) => void;
    mfaType: string;
};

const VerifyCodeForm = <T extends VerifyFormData, P>({
    userId,
    methods,
    error,
    onSuccess,
    onError,
    onChangeProcess,
    disableModalActions,
    mfaType,
}: VerifyFormType<T, P>) => {
    const { reset, timeLeft, isLocked } = useTimerLockout({ key: "anistream_otp_lockout", initialValue: 3 });
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = methods;

    const [resendVerification, resendMethods] = useResendVerificationMutation();
    const [verifyMutation, verifyMethods] = useVerifyMutation();

    const handleResend = async () => {
        disableModalActions?.(true);
        const toastId = toast.loading("Sending new code verification.");
        try {
            await resendVerification({ user_id: +userId, type: mfaType }).unwrap();
            toast.success("Verification code sent to your email.", { id: toastId });
            reset();
        } catch (error: unknown) {
            toast.error("Failed to send verification code. Please try again.", { id: toastId });
            const typesError = error as CatchErrorType;
            onError(typesError.data?.message);
        } finally {
            disableModalActions?.(false);
        }
    };

    const handleVerify = async (data: VerifyFormData) => {
        disableModalActions?.(true);

        const payload = { ...data, user_id: userId };
        const toastId = toast.loading("Verifying account...");
        try {
            const res = await verifyMutation(payload).unwrap();

            if (res.accessToken && res.refreshToken) {
                localStorage.setItem("accessToken", res.accessToken);
                localStorage.setItem("refreshToken", res.refreshToken);
            }

            toast.success("Account logged in.", { id: toastId });
            dispatch(setCredentials(res.data));
            onSuccess();
        } catch (error) {
            toast.dismiss();
            const typesError = error as CatchErrorType;
            onError(typesError.data?.message);
        } finally {
            disableModalActions?.(false);
        }
    };

    const isLoading = resendMethods.isLoading || verifyMethods.isLoading;

    return (
        <div className="space-y-5 md:space-y-10 p-10">
            <form onSubmit={handleSubmit(handleVerify)} className="space-y-4">
                <h2 className="sub-header text-center"> Verify </h2>
                {error && (
                    <p className="text-sm text-center bg-red-500 text-main w-full p-4 rounded-sm">
                        {error}
                    </p>
                )}
                <div className="space-y-1">
                    <InputField
                        placeholder="code"
                        error={errors?.code?.message as string | undefined}
                        {...register("code" as Path<T>)}
                    />
                    <div className="flex justify-between text-sm w-full">
                        {isLocked && (
                            <p>Time Remaining: {formatTime(timeLeft)}</p>
                        )}
                        <button
                            onClick={handleResend}
                            disabled={isLocked || isLoading}
                            type="button"
                            className="ml-auto cursor-pointer hover:text-primary-accent focus:text-primary-accent disabled:pointer-events-none hover:underline focus:underline outline-none disabled:opacity-50"
                        >
                            Resend
                        </button>
                    </div>
                </div>
                <Button disabled={isLoading}>Submit</Button>
            </form>
            <p className="text-center text-sm">
                Back to{" "}
                <button
                    disabled={isLoading}
                    onClick={() => onChangeProcess("login" as P)}
                    className="text-primary-accent hover:underline focus:underline hover:text-primary-accent focus:text-primary-accent cursor-pointer disabled:pointer-events-none disabled:opacity-50"
                >
                    Login
                </button>
            </p>
        </div>
    );
};

export default VerifyCodeForm;
