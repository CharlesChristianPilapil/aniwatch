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
    const commonStyle =
        "bg-primary-accent p-3 rounded-sm cursor-pointer hover:bg-primary-accent/80 focus:bg-primary-accent/80 w-full";

    if (isLinkButtonProps(props)) {
        const { children, className, disabled, ...anchorProps } = props;

        return (
            <Link
                to={props.href as string}
                className={`${commonStyle} ${className} ${
                    disabled ? "pointer-events-none opacity-50" : ""
                }`}
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
            className={`${commonStyle} ${btnClassName} disabled:opacity-50 disabled:pointer-events-none`}
        >
            {children}
        </button>
    );
};

export default Button;
