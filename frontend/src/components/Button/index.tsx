import type {
    AnchorHTMLAttributes,
    ButtonHTMLAttributes,
    ReactNode,
} from "react";
import { Link } from "react-router-dom";

type CommonProps = {
    children: ReactNode;
    disabled?: boolean;
    className?: string;
};

type LinkProps = CommonProps &
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
        href: string;
    };

type NativeButtonProps = CommonProps &
    ButtonHTMLAttributes<HTMLButtonElement> & {
        href?: never;
    };

type ButtonProps = LinkProps | NativeButtonProps;

function isLinkButtonProps(props: ButtonProps): props is LinkProps {
    return "href" in props && typeof props.href === "string";
}

const Button = (props: ButtonProps) => {
    const { children } = props;
    const commonStyle = `p-3 rounded-sm cursor-pointer text-background ${props.className?.includes("w-fit") ? "w-fit" : "w-full"}`;

    if (isLinkButtonProps(props)) {
        const { children, className, disabled, ...anchorProps } = props;

        return (
            <Link
                to={props.href as string}
                className={`${commonStyle} ${className} 
                    ${disabled ? "pointer-events-none opacity-50" : ""} block text-center
                    bg-secondary-accent/80 hover:bg-secondary-accent focus:bg-secondary-accent active:bg-secondary-accent
                `}
                aria-disabled={disabled}
                {...anchorProps}
            >
                {children}
            </Link>
        );
    }

    const { className: btnClassName, ...buttonProps } = props;

    return (
        <button
            {...buttonProps}
            className={`${commonStyle} ${btnClassName} disabled:opacity-50 
                disabled:pointer-events-none bg-primary-accent/80 hover:bg-primary-accent focus:bg-primary-accent
            `}
        >
            {children}
        </button>
    );
};

export default Button;
