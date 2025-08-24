import type { HTMLAttributes, TextareaHTMLAttributes } from "react";

type Props = {
    label?: string;
    error?: string;
    wrapper?: HTMLAttributes<HTMLDivElement>
} & TextareaHTMLAttributes<HTMLTextAreaElement>

const TextArea = (props: Props) => {

    const { label, wrapper, error, ...others } = props;

    return (
        <div {...wrapper}>
            <label htmlFor={others.name} className={`${props.disabled ? "opacity-75" : ""}`}> {label} </label>
            <textarea 
                id={others.name}
                {...others}
                className="bg-main rounded resize-none h-[120px] w-full text-background outline-none p-2 read-only:text-background/50"
            />
            {error && <p className="text-red-400 text-sm"> {error} </p>}
        </div>
    );
};

export default TextArea;