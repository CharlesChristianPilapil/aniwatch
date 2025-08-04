import { forwardRef, useState, type InputHTMLAttributes } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

type InputFieldProps = {
    label?: string;
    error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ label, error, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState<boolean>(false);
        const isPassword = props?.type === "password";

        const inputType = isPassword && showPassword ? "text" : props.type;

        return (
            <div className="flex flex-col space-y-1 w-full">
                {label && (
                    <label
                        htmlFor={props.name}
                        className="w-fit cursor-pointer"
                    >
                        {label}
                    </label>
                )}
                {isPassword ? (
                    <div className="relative">
                        <input
                            id={props.name}
                            ref={ref}
                            {...props}
                            type={inputType}
                            className={`bg-main text-background border ${
                                error
                                    ? "border-red-500 drop-shadow-xs drop-shadow-red-500"
                                    : ""
                            } focus:border-secondary-accent focus:drop-shadow-xs focus:drop-shadow-secondary-accent rounded-sm w-full p-2 outline-none`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-background z-10 cursor-pointer"
                        >
                            {showPassword ? (
                                <VisibilityIcon />
                            ) : (
                                <VisibilityOffIcon />
                            )}
                        </button>
                    </div>
                ) : (
                    <input
                        id={props.name}
                        ref={ref}
                        {...props}
                        type={inputType}
                        className={`bg-main text-background border ${
                            error
                                ? "border-red-500 drop-shadow-xs drop-shadow-red-500"
                                : ""
                        } focus:border-secondary-accent focus:drop-shadow-xs focus:drop-shadow-secondary-accent rounded-sm w-full p-2 outline-none`}
                    />
                )}
                {error && <p className="text-sm text-red-400">{error}</p>}
            </div>
        );
    }
);

InputField.displayName = "InputField";

export default InputField;
