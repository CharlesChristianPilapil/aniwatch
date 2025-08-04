import { Modal } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LoginForm from "../Form/LoginForm";
import {
    type LoginFormData,
    loginSchema,
    type RegisterFormData,
    registerSchema,
    type VerifyFormData,
    verifySchema,
} from "../../utils/schema/auth.schema";
import VerifyForm from "../Form/VerifyForm";
import RegisterForm from "../Form/RegisterForm";
import ForgotPasswordForm from "../Form/ForgotPasswordForm";

type AuthModalType = {
    isOpen: boolean;
    onClose: () => void;
};

type ProcessType = "login" | "register" | "verify" | "forgot-password";

const AuthModal = (props: AuthModalType) => {
    const [disableModalActions, setDisableModalActions] =
        useState<boolean>(false);
    const [currentProcess, setCurrentProcess] = useState<ProcessType>("login");
    const [error, setError] = useState<string | undefined>("");
    const [userId, setUserId] = useState<string | undefined>("");

    const registerMethod = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        reValidateMode: "onSubmit",
    });

    const loginMethod = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        reValidateMode: "onSubmit",
    });

    const verifyMethod = useForm<VerifyFormData>({
        resolver: zodResolver(verifySchema),
    });

    const handleReset = () => {
        setError("");
        registerMethod.reset();
        loginMethod.reset();
        verifyMethod.reset();
        setCurrentProcess("login");
    };

    const handleCloseModal = () => {
        if (disableModalActions) return;

        handleReset();
        props.onClose();
    };

    const handleProcessChange = (e: ProcessType) => {
        handleReset();
        setCurrentProcess(e);
    };

    return (
        <Modal
            open={props.isOpen}
            onClose={handleCloseModal}
            className="flex items-center justify-center px-5 py-10 overflow-y-scroll overflow-x-hidden"
        >
            <div className="bg-background/75 backdrop-blur-sm rounded-2xl w-full min-[440px]:max-w-[476px] my-auto">
                {currentProcess === "register" && (
                    <RegisterForm<RegisterFormData, ProcessType>
                        methods={registerMethod}
                        error={error}
                        onError={setError}
                        setUserId={setUserId}
                        onProcessChange={handleProcessChange}
                        disableModalActions={setDisableModalActions}
                    />
                )}
                {currentProcess === "login" && (
                    <LoginForm<LoginFormData, ProcessType>
                        methods={loginMethod}
                        error={error}
                        onError={setError}
                        setUserId={setUserId}
                        onProcessChange={handleProcessChange}
                        disableModalActions={setDisableModalActions}
                    />
                )}
                {currentProcess === "verify" && (
                    <VerifyForm<VerifyFormData, ProcessType>
                        methods={verifyMethod}
                        error={error}
                        userId={userId ? userId : ""}
                        onError={setError}
                        onSuccess={handleCloseModal}
                        onChangeProcess={handleProcessChange}
                        disableModalActions={setDisableModalActions}
                    />
                )}
                {currentProcess === "forgot-password" && <ForgotPasswordForm />}
            </div>
        </Modal>
    );
};

export default AuthModal;
