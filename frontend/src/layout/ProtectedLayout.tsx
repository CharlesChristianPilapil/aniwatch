import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../store"
import { Navigate, Outlet } from "react-router-dom";
import { useGetMeQuery } from "../services/userServices";
import { logout } from "../slices/authSlice";
import { useEffect } from "react";
import SuspenseLayout from "./SuspenseLayout";

const ProtectedLayout = () => {
    const dispatch = useDispatch();
    const userInfo = useSelector((state: RootState) => state.auth.userInfo);

    const { isError } = useGetMeQuery(undefined, {
        skip: !userInfo,
        refetchOnMountOrArgChange: true,
    });

    useEffect(() => {
        if (isError) {
            dispatch(logout());
        }
    }, [isError, dispatch]);

    if (!userInfo || isError) {
        return <Navigate to="/error" replace />;
    }
    
    return (
        <SuspenseLayout>
            <Outlet />
        </SuspenseLayout>
    );
};

export default ProtectedLayout;