import { forwardRef, useEffect, useState, type HTMLAttributes, type InputHTMLAttributes } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

type InputFieldProps = {
    label?: string;
    error?: string;
    wrapper?: HTMLAttributes<HTMLDivElement>;
} & InputHTMLAttributes<HTMLInputElement>;

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ label, error, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState<boolean>(false);
        const isPassword = props?.type === "password";

        const inputType = isPassword && showPassword ? "text" : props.type;

        useEffect(() => {
            if (props.readOnly) setShowPassword(false);
        }, [props.readOnly])

        return (
            <div className={`flex flex-col space-y-1 ${props.wrapper?.className ? props.wrapper?.className : "w-full"}`}>
                {label && (
                    <label
                        htmlFor={props.name}
                        className={`w-fit ${props.readOnly ? "pointer-events-none opacity-75" : "cursor-pointer"}`}
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
                            className={`
                                bg-main border rounded-sm w-full p-2 outline-none text-background
                                ${error ? "border-red-500 drop-shadow-xs drop-shadow-red-500" : ""} 
                                focus:border-secondary-accent focus:drop-shadow-xs focus:drop-shadow-secondary-accent
                            `}
                        />
                        <button
                            type="button"
                            disabled={props.readOnly}
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-background z-10 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
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
                        className={`
                            bg-main border rounded-sm w-full p-2 outline-none
                            ${error ? "border-red-500 drop-shadow-xs drop-shadow-red-500" : ""} 
                            text-background focus:border-secondary-accent focus:drop-shadow-xs focus:drop-shadow-secondary-accent read-only:text-background/50
                        `}
                    />
                )}
                {error && <p className="text-sm text-red-400">{error}</p>}
            </div>
        );
    }
);

InputField.displayName = "InputField";

export default InputField;
