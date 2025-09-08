import { Button, Divider } from "@mui/material";
import { useGetMeQuery, useRemoveAvatarMutation, useUpdateAvatarMutation, useUpdateEmailMutation, useUpdateProfileMutation } from "../../../services/userServices"
import InputField from "../../InputField";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import TextArea from "../../TextArea";
import type { UserInfoType } from "../../../utils/types/users.type";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CatchErrorType } from "../../../utils/types/error.type";
import UpdateProfileModal from "../../Modal/UpdateProfileModal";
import { MFA_TYPE } from "../../../utils/constants/utils";
import useTimerLockout from "../../../hooks/useTimerLockout";
import formatTime from "../../../utils/helpers/formatTime";

type AvatarFormValues = {
    avatar_image: (File | string)[];
}

const AvatarForm = ({ info }: { info?: UserInfoType }) => {
    const avatar_image = info?.avatar_image ? [info?.avatar_image] : [];
    
    const { 
        reset,
        register, 
        setValue, 
        handleSubmit, 
        formState: { isDirty } 
    } = useForm<AvatarFormValues>({
        defaultValues: { 
            avatar_image,
        },
    });

    useEffect(() => {
        if (info) reset({avatar_image: info.avatar_image ? [info.avatar_image] : []});
    }, [info, reset]);

    const fileInputRef = useRef<HTMLInputElement | null>(null); 
    const originalAvatar = info?.avatar_image || "/images/avatar.jpg";
    const [avatarPreview, setAvatarPreview] = useState("");

    const [updateAvatarMutation, { isLoading }] = useUpdateAvatarMutation();
    const [removeAvatarMutation, removeAvatarState] = useRemoveAvatarMutation();

    const handleChangeAvatar = (e: ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (fileList && fileList.length > 0) {
            const filesArray = Array.from(fileList);
            setValue("avatar_image", filesArray, { shouldDirty: true });
            setAvatarPreview(URL.createObjectURL(filesArray[0]));
        };
    };
  
    const handleDeleteAvatar = () => {
        setValue("avatar_image", [], { shouldDirty: true, shouldValidate: true });
        setAvatarPreview("/images/avatar.jpg");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const onSubmit = async (data: AvatarFormValues) => {
        const toastId = toast.loading("Processing avatar...");
        try {
            if (!data.avatar_image || data.avatar_image.length === 0) {
                await removeAvatarMutation().unwrap();
                toast.success("Avatar removed successfully.", { id: toastId });
                reset();
                return;
            }
            const formData = new FormData();
            formData.append("avatar_image", data.avatar_image[0]);
            await updateAvatarMutation(formData).unwrap();
            reset();
            toast.success("Avatar updated successfully.", { id: toastId });
        } catch (error) {
            toast.error("Failed to update avatar. Please try again.", { id: toastId });
            console.error("Failed to update avatar:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
                <img
                    src={avatarPreview || info?.avatar_image || "/images/avatar.jpg"}
                    alt={`${info?.username} avatar.`}
                    className="rounded-full ring-2 ring-primary-accent/75 p-1 aspect-square w-20 h-20 object-cover"
                />
                <div className="flex flex-col justify-between gap-2">
                    <Button
                        type="button"
                        className="bg-primary-accent text-background disabled:opacity-50"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading || removeAvatarState.isLoading}
                        sx={{ textTransform: "none" }}
                    >
                        Change Avatar
                    </Button>
                    <Button
                        type="button"
                        className="outline outline-red-400 text-red-400 disabled:opacity-50"
                        onClick={handleDeleteAvatar}
                        disabled={isLoading || removeAvatarState.isLoading}
                        sx={{ textTransform: "none" }}
                    >
                        Delete Avatar
                    </Button>
                </div>
            </div>
            <input
                type="file"
                accept="image/*"
                hidden
                {...register("avatar_image")}
                ref={(e) => {
                    register("avatar_image").ref(e);
                    fileInputRef.current = e;
                }}
                onChange={handleChangeAvatar}
            />
            <div className="space-x-4 self-end">
                <Button
                    type="button"
                    disabled={!isDirty || isLoading || removeAvatarState.isLoading}
                    sx={{ textTransform: "none" }}
                    className="w-fit outline text-main disabled:opacity-50"
                    onClick={() => {
                        setValue("avatar_image", avatar_image, { shouldDirty: true, shouldValidate: true });
                        setAvatarPreview(originalAvatar);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                >
                    Discard 
                </Button>
                <Button
                    type="submit"
                    disabled={!isDirty || isLoading || removeAvatarState.isLoading}
                    sx={{ textTransform: "none" }}
                    className="w-fit bg-primary-accent text-background disabled:opacity-50"
                > 
                    Save 
                </Button>
            </div>
        </form>
    );
};

const UpdateEmailSchema = z.object({
    email: z.email().nonempty("Email is required."),
});

type UpdateEmailFormData = z.infer<typeof UpdateEmailSchema>;

const EmailForm = ({ info }: { info?: UserInfoType }) => {

    const { 
        register, 
        handleSubmit, 
        reset, 
        formState: { errors, isDirty }, 
        setError,
        getValues
    } = useForm<UpdateEmailFormData>({
        resolver: zodResolver(UpdateEmailSchema),
        defaultValues: {
            email: ""
        }
    });

    const { timeLeft, isLocked } = useTimerLockout({ key: `${MFA_TYPE.UPDATE_EMAIL}_lockout` });

    const [mutation, mutationMethod] = useUpdateEmailMutation();

    const [verifyModal, setVerifyModal] = useState<boolean>(false);
    const [disableEmail, setDisableEmail] = useState<boolean>(true);

    const onSubmit = async (data: UpdateEmailFormData) => {
        const toastId = toast.loading("Processing your update request.")
        try {
            const res = await mutation(data).unwrap();
            if (res.success) {
                setVerifyModal(true);
                toast.success("Verification code has been sent to your new email.", { id: toastId });
            }
        } catch (error) {
            const typeError = error as CatchErrorType<{ email?: string }>;
            const errors = typeError.data?.errors;
            if (errors) {
                toast.error(errors.email ?? "", { id: toastId });
                setError("email", {
                    type: "server",
                    message: errors?.email || undefined,
                });
                return;
            }
            toast.error("Failed to send verification code.\nPlease try again.", { id: toastId });
        }
    }

    return (
        <>
            <UpdateProfileModal 
                isOpen={verifyModal}
                onClose={() => setVerifyModal(false)}
                type={MFA_TYPE.UPDATE_EMAIL}
                field_name="email"
                new_value={getValues("email")}
                onSuccess={() => {
                    reset();
                    setVerifyModal(false);
                    setDisableEmail(true);
                }}
            />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <InputField 
                            label="Email"
                            placeholder={info?.email}
                            {...register("email")}
                            error={errors.email?.message}
                            readOnly={disableEmail || isLocked}
                        />
                        {timeLeft > 0 && <p> Time left for new request: {formatTime(timeLeft)}  </p>}
                    </div>
                </div>
                <div className="flex gap-4 h-fit flex-1 justify-end">
                    <Button 
                        type="button"
                        className="text-main outline disabled:opacity-50"
                        sx={{ textTransform: "none" }}
                        onClick={() => {
                            if (isDirty) reset(); 
                            setDisableEmail(prev => !prev)
                        }}
                        disabled={mutationMethod.isLoading || isLocked}
                    >
                        {disableEmail ? "Update" : "Discard"}
                    </Button>
                    <Button 
                        type="submit"
                        disabled={!isDirty || mutationMethod.isLoading || disableEmail || isLocked}
                        className="bg-primary-accent text-background disabled:opacity-50"
                        sx={{ textTransform: "none" }}
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </>
    );
};

const InformationSchema = z.object({
    name: z.string(),
    username: z.string(),
    phone_number: z
        .string()
        .optional()
        .refine((val) => !val || /^\d+$/.test(val), {
            message: "Phone number must be digits only",
        })
        .refine((val) => !val || (val.length >= 10 && val.length <= 11), {
            message: "Phone number must be 10–11 digits",
        }),
    city: z
        .string()
        .optional(),
    bio: z
        .string()
        .optional()
        .refine((val) => !val || (val.length >= 2 && val.length <= 250), {
            message: "Bio must be 2–250 characters",
        }),
});

type InformationFormData = z.infer<typeof InformationSchema>;

const InformationForm = ({ info }: { info?: UserInfoType }) => {
    const { reset, register, handleSubmit, formState: { errors, isDirty, dirtyFields } } = useForm<InformationFormData>({
        resolver: zodResolver(InformationSchema),
        defaultValues: {
            name: "",
            username: "",
            phone_number: info?.phone_number || "",
            city: info?.city || "",
            bio: info?.bio || ""
        }
    });

    const [updateMutation, updateMutationMethod] = useUpdateProfileMutation();

    useEffect(() => {
        if (info) {
            reset({
                name: "",
                username: "",
                phone_number: info.phone_number || "",
                city: info.city || "",
                bio: info.bio || ""
            });
        }
    }, [info, reset]);

    const [disableProfile, setDisableProfile] = useState<boolean>(true);

    const onSubmit = async (data: InformationFormData) => {
        const toastId = toast.loading("Updating profile.");

        const payload = Object.keys(dirtyFields).reduce((acc, key) => {
            const typedKey = key as keyof InformationFormData;
            acc[typedKey] = data[typedKey];
            return acc;
        }, {} as Partial<InformationFormData>);

        try {
            await updateMutation(payload).unwrap();
            reset();
            setDisableProfile(true);
            toast.success("Profile updated successfully", { id: toastId });
        } catch (error) {
            toast.error("Failed to update profile.", { id: toastId });
            console.error(error);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <InputField 
                    label="Name"
                    placeholder={info?.name}
                    {...register("name")}
                    readOnly={disableProfile}
                />
                <InputField 
                    label="Username"
                    placeholder={info?.username}
                    {...register("username")}
                    readOnly={disableProfile}
                />
                <InputField 
                    label="Phone"
                    placeholder={info?.phone_number || "phone number"}
                    error={errors.phone_number?.message}
                    {...register("phone_number")}
                    readOnly={disableProfile}
                />
                <InputField 
                    label="City"
                    placeholder={info?.city || "city"}
                    {...register("city")}
                    readOnly={disableProfile}
                />
                <TextArea 
                    label="Bio"
                    placeholder={info?.bio || "bio"}
                    {...register("bio")}
                    error={errors.bio?.message}
                    wrapper={{ className: "sm:col-span-2 lg:col-span-4" }}
                    disabled={disableProfile}
                    className="h-[120px] bg-main text-background read-only:text-background/50"
                />
            </div>
            <div className="flex justify-between">
                <Button 
                    type="button"
                    className="text-main outline disabled:opacity-50"
                    sx={{ textTransform: "none" }}
                    disabled={updateMutationMethod.isLoading}
                    onClick={() => {
                        reset();
                        setDisableProfile(prev => !prev);
                    }}
                >
                    {disableProfile ? "Update" : "Discard"}
                </Button>
                <Button 
                    type="submit"
                    disabled={disableProfile || !isDirty || updateMutationMethod.isLoading}
                    className="bg-primary-accent text-background disabled:opacity-50"
                    sx={{ textTransform: "none" }}
                >
                    Save
                </Button>  
            </div>
        </form>
    );
};

const ProfileForm = () => {

    const { data } = useGetMeQuery();
    const info = data?.info;

    return (
        <div className="px-4 py-10 space-y-10">
            <AvatarForm info={info} />
            <Divider />
            <EmailForm info={info} />
            <Divider />
            <InformationForm info={info} />
        </div>
    );
};

export default ProfileForm;