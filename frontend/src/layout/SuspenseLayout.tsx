import { Suspense, type ReactNode } from "react";
import { Outlet } from "react-router-dom";

type SuspenseLayoutProps = {
    children?: ReactNode;
}

const SuspenseLayout = ({ children }: SuspenseLayoutProps) => {
    return (
        <Suspense fallback={children}>
            {children ?? <Outlet />}
        </Suspense>
    );
};

export default SuspenseLayout;