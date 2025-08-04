import type { Path, useForm } from "react-hook-form";
import type { RegisterFormData } from "../../utils/schema/auth.schema";
import InputField from "../InputField";
import Button from "../Button";
import { useRegisterMutation } from "../../services/authService";
import type { CatchErrorType } from "../../utils/types/error.type";
import toast from "react-hot-toast";

type RegisterFormType<T extends RegisterFormData, P> = {
    methods: ReturnType<typeof useForm<T>>;
    error?: string;
    onProcessChange: (e: P) => void;
    onError: (e: string | undefined) => void;
    disableModalActions: (e: boolean) => void;
    setUserId: (e: string | undefined) => void;
};

const RegisterForm = <T extends RegisterFormData, P>({
    methods,
    error,
    onProcessChange,
    onError,
    disableModalActions,
    setUserId,
}: RegisterFormType<T, P>) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = methods;

    const [registerMutation] = useRegisterMutation();

    const handleRegister = async (data: RegisterFormData) => {
        const payload = {
            name: data.name,
            username: data.username,
            email: data.email,
            password: data.password,
        };
        disableModalActions(true);
        const toastId = toast.loading("Validating registration data...");
        try {
            const res = await registerMutation(payload).unwrap();
            if (res.success) {
                onProcessChange("verify" as P);
                toast.success("Verification code sent to your email.", {
                    id: toastId,
                });
                setUserId(res?.user_id);
            }
        } catch (error: unknown) {
            toast.dismiss();
            const typesError = error as CatchErrorType;
            const additional_message =
                typesError.status === 409
                    ? "Try logging in or verifying your account."
                    : "";
            onError(`${typesError.data?.message} ${additional_message}`);
        } finally {
            disableModalActions(false);
        }
    };

    return (
        <div className="space-y-5 md:space-y-10 px-5 sm:px-10 py-10">
            <form onSubmit={handleSubmit(handleRegister)}>
                <div className="flex flex-col space-y-4 md:space-y-5 items-center w-full">
                    <h2 className="sub-header">Register</h2>
                    {error && (
                        <p className="text-sm text-center bg-red-500 text-main w-full p-4 rounded-sm">
                            {error}
                        </p>
                    )}
                    <InputField
                        type="text"
                        label="Name"
                        placeholder="John Doe"
                        error={errors?.name?.message as string}
                        {...register("name" as Path<T>)}
                    />
                    <InputField
                        type="text"
                        label="Username"
                        placeholder="@username"
                        error={errors?.username?.message as string}
                        {...register("username" as Path<T>)}
                    />
                    <InputField
                        type="text"
                        label="Email"
                        placeholder="user@email.com"
                        error={errors?.email?.message as string}
                        {...register("email" as Path<T>)}
                    />
                    <InputField
                        type="password"
                        label="Password"
                        placeholder="password"
                        error={errors?.password?.message as string}
                        {...register("password" as Path<T>)}
                    />
                    <InputField
                        type="password"
                        label="Repeat Password"
                        placeholder="password"
                        error={errors?.repeat_password?.message as string}
                        {...register("repeat_password" as Path<T>)}
                    />
                    <Button type="submit">Login</Button>
                </div>
            </form>
            <div className="text-sm text-center">
                <p className="inline-block">{`Already have an account?`}</p>{" "}
                <button
                    onClick={() => onProcessChange("login" as P)}
                    className="text-primary-accent cursor-pointer hover:underline focus:underline disabled:pointer-events-none"
                >
                    Login
                </button>
            </div>
        </div>
    );
};
export default RegisterForm;
