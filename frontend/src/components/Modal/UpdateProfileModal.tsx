import { Fade, Modal } from "@mui/material"
import InputField from "../InputField";
import Button from "../Button";
import type { MFAType } from "../../utils/constants/utils";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useTimerLockout from "../../hooks/useTimerLockout";
import formatTime from "../../utils/helpers/formatTime";
import { useResendUpdateVerificationMutation, useVerifyUpdateMutation } from "../../services/userServices";
import toast from "react-hot-toast";
import type { CatchErrorType } from "../../utils/types/error.type";
import { useEffect } from "react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    type: MFAType;
    field_name: string;
    new_value: string;
    onSuccess: () => void;
}

const VerificationSchema = z.object({
    code: z.string()
        .nonempty("Code is required")
        .min(6, "Code should be 6 digits")
        .max(6, "Code should be 6 digits"),
    type: z.string().nonempty("Type is required")
});

type VerificationFormData = z.infer<typeof VerificationSchema>

const UpdateProfileModal = ({
    isOpen,
    onClose,
    type,
    field_name,
    new_value,
    onSuccess
}: Props) => {
    const { 
        timeLeft, 
        reset: resetTimer, 
        isLocked,
        resetInitialCountdown 
    } = useTimerLockout({ key: `${type}_lockout`, initialValue: 3 });

    useEffect(() => {
        if (!isOpen) return;
        resetInitialCountdown();
    }, [isOpen, resetInitialCountdown])

    const { 
        reset: resetFieldTimer, 
    } = useTimerLockout({ key: `${type}_lockout` });

    const { 
        register, 
        handleSubmit, 
        reset, 
        formState: { errors, isDirty, },
        setError,
    } = useForm<VerificationFormData>({
        resolver: zodResolver(VerificationSchema),
        defaultValues: {
            code: "",
            type: type
        }
    });


    const [resendMutation, resendMutationMethods] = useResendUpdateVerificationMutation();
    const [verifyMuration, verifyMutationMethods] = useVerifyUpdateMutation();

    const loading = resendMutationMethods.isLoading || verifyMutationMethods.isLoading;

    const handleClose = () => {
        if (loading) return;
        onClose();
        reset({ type: type, code: "" });
    }

    const handleResend = async () => {
        const toastId = toast.loading("Resending verification code.");
        try {
            const res = await resendMutation({ type: type, field_name, new_value }).unwrap();
            if (res.success) {
                toast.success("Verification code sent", { id: toastId });
                resetFieldTimer();
                resetTimer();
            }
        } catch (error) {
            toast.error("Failed to send verification code", { id: toastId });
            console.error(error);
        }
    }

    const onSubmit = async (data: VerificationFormData) => {
        const toastId = toast.loading("Verifying code.");

        try {
            const res = await verifyMuration(data).unwrap();
            if (res.success) {
                reset();
                onSuccess();
                toast.success(`
                    ${field_name === 'email' ? 'Email' : 'Password'} updated successfully!`, 
                    { id: toastId }
                );
            }
        } catch (error) {
            const typesError = error as CatchErrorType<{ code: string }>;
            const errors = typesError.data?.errors;
            console.error(error);

            if (errors) {
                setError("code", { message: errors?.code });
                toast.error(errors.code, { id: toastId });
                return;
            }

            toast.error(
                `Failed to update ${field_name === 'email' ? 'email' : 'password'}. Please try again.`, 
                { id: toastId }
            );
        }
    }

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            closeAfterTransition
            className="flex items-center justify-center px-5 py-10 overflow-y-scroll overflow-x-hidden"
        >
            <Fade in={isOpen} timeout={300}>
                <div className="bg-background/75 backdrop-blur-sm rounded-2xl w-full min-[440px]:max-w-[476px] my-auto">
                    <form 
                        onSubmit={handleSubmit(onSubmit)} 
                        className="space-y-4 px-5 sm:px-10 py-10"
                    >
                        <div className="space-y-1">
                            <InputField 
                                label="Code"
                                placeholder="enter 6 digits code"
                                {...register("code")}
                                error={errors.code?.message}
                            />
                            <div className="flex justify-between text-sm w-full">
                                {isLocked && (
                                    <p>Time Remaining: {formatTime(timeLeft)}</p>
                                )}
                                <button
                                    onClick={handleResend}
                                    disabled={isLocked || loading}
                                    type="button"
                                    className="ml-auto cursor-pointer hover:text-primary-accent focus:text-primary-accent disabled:pointer-events-none disabled:opacity-50 hover:underline focus:underline outline-none"
                                >
                                    Resend
                                </button>
                            </div>
                        </div>
                        <Button disabled={!isDirty || loading}>
                            Submit
                        </Button>
                    </form>
                </div>
            </Fade>           
        </Modal>
    );
};

export default UpdateProfileModal;