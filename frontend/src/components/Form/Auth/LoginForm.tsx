import InputField from "../../InputField";
import { useForm, type Path } from "react-hook-form";
import Button from "../../Button";
import { useLoginMutation } from "../../../services/authService";
import type { CatchErrorType } from "../../../utils/types/error.type";
import type { LoginFormData } from "../../../utils/schema/auth.schema";
import formatTime from "../../../utils/helpers/formatTime";
import useTimerLockout from "../../../hooks/useTimerLockout";
import toast from "react-hot-toast";
import type { AuthProcessType } from "../../../utils/types/auth.type";
import type { MFAType } from "../../../utils/constants/utils";

type LoginFormType<T extends LoginFormData, P extends AuthProcessType> = {
    methods: ReturnType<typeof useForm<T>>;
    error?: string;
    onProcessChange: (e: P) => void;
    onError: (e: string | undefined) => void;
    disableModalActions: (e: boolean) => void;
    setUserId: (e: string | undefined) => void;
    setMfaType: (e: MFAType | "") => void;
};

const LoginForm = <T extends LoginFormData, P extends AuthProcessType>({
    methods,
    error,
    onError,
    onProcessChange,
    setUserId,
    disableModalActions,
    setMfaType,
}: LoginFormType<T, P>) => {
    const { timeLeft, reset } = useTimerLockout({
        key: "aniwatch_login_lockout",
        minimum: 0,
    });

    const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = methods;

    const handleLogin = async (data: T) => {
        disableModalActions(true);
        onError("");
        const toastId = toast.loading("Sending verification code...");
        try {
            const res = await loginMutation(data).unwrap();
            if (res.success) {
                onProcessChange("verify-code" as P);
                toast.success("Verification code sent to your email.", {
                    id: toastId,
                });
                setUserId(res?.user_id);
                setMfaType("login_mfa");
            }
        } catch (error: unknown) {
            toast.dismiss();
            const typesError = error as CatchErrorType;
            if (typesError.status === 429) {
                reset();
                return;
            }
            onError(typesError?.data?.message);
        } finally {
            disableModalActions(false);
        }
    };

    return (
        <div className="space-y-5 md:space-y-10 px-5 sm:px-10 py-10">
            <form onSubmit={handleSubmit(handleLogin)}>
                <div className="flex flex-col space-y-4 md:space-y-5 items-center w-full">
                    <h2 className="sub-header">Login</h2>
                    {timeLeft > 0 && (
                        <div className="w-full">
                            <p className="text-sm text-center bg-red-500 text-main w-full p-4 rounded-sm">
                                Too many attempts.
                            </p>
                            <p className="text-center text-sm mt-2">
                                Time remaining: {formatTime(timeLeft)}
                            </p>
                        </div>
                    )}
                    {error && !timeLeft && (
                        <p className="text-sm text-center bg-red-500 text-main w-full p-4 rounded-sm">
                            {error}
                        </p>
                    )}
                    <InputField
                        type="text"
                        label="Email or Username"
                        placeholder="email or username"
                        error={errors?.identifier?.message as string}
                        {...register("identifier" as Path<T>)}
                    />
                    <InputField
                        type="password"
                        label="Password"
                        placeholder="password"
                        error={errors?.password?.message as string}
                        {...register("password" as Path<T>)}
                    />
                    <Button
                        type="submit"
                        disabled={isLoginLoading || !timeLeft !== true}
                    >
                        Login
                    </Button>
                </div>
                <button
                    disabled={isLoginLoading}
                    type="button"
                    onClick={() => onProcessChange("forgot-password" as P)}
                    className="w-fit text-end mt-2 text-primary-accent cursor-pointer hover:underline focus:underline disabled:pointer-events-none"
                >
                    Forgot Password
                </button>
            </form>
            <div className="text-center text-sm">
                <p className="inline-block">{`Don't have an account?`} </p>{" "}
                <button
                    disabled={isLoginLoading}
                    onClick={() => onProcessChange("register" as P)}
                    className="text-primary-accent cursor-pointer hover:underline focus:underline disabled:pointer-events-none"
                >
                    Register
                </button>
            </div>
        </div>
    );
};

export default LoginForm;
