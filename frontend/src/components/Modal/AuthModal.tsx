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
import RegisterForm from "../Form/RegisterForm";
import ForgotPasswordForm from "../Form/ForgotPasswordForm";
import useAuthRefetch from "../../hooks/useAuthRefetch";
import VerifyCodeForm from "../Form/VerifyCodeForm";
import type { AuthProcessType } from "../../utils/types/auth.type";

type AuthModalType = {
    isOpen: boolean;
    onClose: () => void;
};


const AuthModal = (props: AuthModalType) => {
    const { refetch } = useAuthRefetch();

    const [disableModalActions, setDisableModalActions] =
        useState<boolean>(false);
    const [currentProcess, setCurrentProcess] = useState<AuthProcessType>("login");
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

    const handleProcessChange = (e: AuthProcessType) => {
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
                    <RegisterForm<RegisterFormData, AuthProcessType>
                        methods={registerMethod}
                        error={error}
                        onError={setError}
                        setUserId={setUserId}
                        onProcessChange={handleProcessChange}
                        disableModalActions={setDisableModalActions}
                    />
                )}
                {currentProcess === "login" && (
                    <LoginForm<LoginFormData, AuthProcessType>
                        methods={loginMethod}
                        error={error}
                        onError={setError}
                        setUserId={setUserId}
                        onProcessChange={handleProcessChange}
                        disableModalActions={setDisableModalActions}
                    />
                )}
                {currentProcess === "verify-code" && (
                    <VerifyCodeForm<VerifyFormData, AuthProcessType>
                        methods={verifyMethod}
                        error={error}
                        userId={userId ? userId : ""}
                        onChangeProcess={handleProcessChange}
                        disableModalActions={setDisableModalActions}
                        onError={setError}
                        onSuccess={() => {
                            handleCloseModal();
                            refetch();
                        }}
                    />
                )}
                {currentProcess === "forgot-password" && (
                    <ForgotPasswordForm  
                        onChangeProcess={handleProcessChange} 
                        disableModalActions={setDisableModalActions}
                    />
                )}
            </div>
        </Modal>
    );
};

export default AuthModal;
