import toast, { Toaster, ToastBar, type ToasterProps } from "react-hot-toast";

const Snackbar = (props: ToasterProps) => {
    return (
        <Toaster {...props}>
            {(t) => {
                return (
                    <div
                        className="w-auto cursor-pointer"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        <ToastBar toast={t} />
                    </div>
                );
            }}
        </Toaster>
    );
};

export default Snackbar;
