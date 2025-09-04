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
                className={`${others.className ? others.className : "bg-main text-background read-only:text-background/50"} rounded resize-none h-[120px] w-full outline-none p-2`}
            />
            {error && <p className="text-red-400 text-sm"> {error} </p>}
        </div>
    );
};

export default TextArea;