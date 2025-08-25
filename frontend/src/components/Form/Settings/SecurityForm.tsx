import { Button } from "@mui/material"
import InputField from "../../InputField"
import { useUpdatePasswordMutation } from "../../../services/userServices";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CatchErrorType } from "../../../utils/types/error.type";
import { setFormErrors } from "../../../utils/helpers/setFormErrors";
import toast from "react-hot-toast";
import { useState } from "react";
import UpdateProfileModal from "../../Modal/UpdateProfileModal";
import { MFA_TYPE } from "../../../utils/constants/utils";

const updatePasswordSchema = z.object({
    old_password: z.string().nonempty("Old password is required."),
    new_password: z
        .string()
        .nonempty("New password is required.")
        .min(8, "Password must be atleast 8 characters.")
        .max(15, "Password must not exceed 15 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
        .regex(/[0-9]/, "Password must contain at least one number."),
    repeat_new_password: z.string().nonempty("Please confirm your password.")
}).refine((data) => data.new_password === data.repeat_new_password, {
    message: "New password does not match",
    path: ["repeat_new_password"],
});

type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>

const SecurityForm = () => {
    const { 
        register, 
        setError, 
        reset, 
        handleSubmit, 
        getValues,
        formState: { errors, isDirty }, 
    } = useForm<UpdatePasswordFormData>({
        resolver: zodResolver(updatePasswordSchema),
        defaultValues: {
            old_password: "", 
            new_password: "",
            repeat_new_password: "",
        }
    })

    const [updatePasswordMutation, updatePasswordMutationMethod] = useUpdatePasswordMutation();
    
    const [disableFields, setDisableFields] = useState<boolean>(true);
    const [verificationModal, setVerificationModal] = useState<boolean>(false);

    const onSubmit = async (data: UpdatePasswordFormData) => {
        const payload = {
            old_password: data.old_password,
            new_password: data.new_password,
        };
        const toastId = toast.loading("Validating your request.");
        try {
            const res = await updatePasswordMutation(payload).unwrap();
            if (res.success) {
                toast.success("Validation request sent to your email.", { id: toastId });
                setVerificationModal(true);
            }
        } catch (error) {
            console.error(error);
            const typesError = error as CatchErrorType<{ old_password: string, new_password: string }>;
            const errors = typesError.data?.errors;
            toast.error("Failed to send validation request.", { id: toastId })

            if (errors) {
                setFormErrors({
                    setError,
                    errors
                });
            };
        }
    }

    return (
        <div className="py-8 px-4">
            <UpdateProfileModal 
                isOpen={verificationModal}
                onClose={() => setVerificationModal(false)}
                type={MFA_TYPE.CHANGE_PASSWORD}
                field_name="password"
                new_value={getValues("new_password")}
                onSuccess={() => {
                    reset();
                    setVerificationModal(false);
                    setDisableFields(true);
                }}
            />
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                <div className="grid md:grid-cols-2 gap-4 w-full">
                    <div className="space-y-4">
                        <InputField 
                            label="Old password"
                            type="password"
                            placeholder="old password"
                            {...register("old_password")}
                            readOnly={disableFields}
                            error={errors.old_password?.message}
                        />
                        <InputField 
                            label="New password"
                            type="password"
                            placeholder="new password"
                            {...register("new_password")}
                            readOnly={disableFields}
                            error={errors.new_password?.message}
                        />
                        <InputField 
                            label="Repeat new password"
                            type="password"
                            placeholder="repeat new password"
                            {...register("repeat_new_password")}
                            readOnly={disableFields}
                            error={errors.repeat_new_password?.message}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 self-end">
                    <Button 
                        type="button"
                        disabled={updatePasswordMutationMethod.isLoading}
                        className="text-main outline disabled:opacity-50"
                        sx={{ textTransform: "none" }}
                        onClick={() => {
                            if (!disableFields) reset();
                            setDisableFields(prev => !prev);
                        }}
                    >
                        {disableFields ? "Update" : "Discard"}
                    </Button>
                    <Button
                        type="submit"
                        disabled={updatePasswordMutationMethod.isLoading || !isDirty || disableFields}
                        className="bg-primary-accent text-background disabled:opacity-50"
                        sx={{ textTransform: "none" }}
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default SecurityForm;