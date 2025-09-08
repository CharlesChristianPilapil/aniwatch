import { useEffect, useRef, type HTMLAttributes, type TextareaHTMLAttributes } from "react";

type Props = {
    label?: string;
    error?: string;
    shrink?: boolean;
    wrapper?: HTMLAttributes<HTMLDivElement>;
} & TextareaHTMLAttributes<HTMLTextAreaElement>

const TextArea = (props: Props) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { label, wrapper, error, shrink = true, ...others } = props;

    const resize = () => {
        const el = textareaRef.current;
        if (!el) return;
    
        if (shrink) {
          el.style.height = "auto";
        }
        el.style.height = `${el.scrollHeight}px`;
      };
    
    useEffect(() => {
        resize();
    }, [others.value]);

    return (
        <div {...wrapper}>
            <label htmlFor={others.name} className={`${props.disabled ? "opacity-75" : ""}`}> {label} </label>
            <textarea 
                ref={textareaRef}
                id={others.name}
                rows={1}
                {...others}
                className={`${others.className ? others.className : `${!shrink ? "" : "h-[120px]"} bg-main text-background read-only:text-background/50`} rounded resize-none w-full outline-none p-2`}
                onInput={resize}
            />
            {error && <p className="text-red-400 text-sm"> {error} </p>}
        </div>
    );
};

export default TextArea;