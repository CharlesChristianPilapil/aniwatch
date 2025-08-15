import { Navigate, Outlet, useParams } from "react-router-dom"
import { useGetUserInfoQuery } from "../services/userServices";

const UserLayout = () => {
    const { username } = useParams<{ username: string }>();

    const { data, isLoading, isError, isFetching } = useGetUserInfoQuery(
        { username: username! },
        { skip: !username }
    );

    if (isLoading || isFetching) return <main className="min-height-screen" />;

    if (!data || isError) return <Navigate to={"/error"} replace />;

    return (
        <div className="relative">
            <div
                style={{ backgroundImage: `url(${data.info.cover_image || "/images/dimple.webp"})`}}
                className="
                    bg-black bg-no-repeat bg-center bg-cover absolute top-0 left-0 w-full aspect-video -z-1 max-h-screen
                    after:top-0 after:left-0 after:absolute after:block after:w-full after:h-full after:content-[''] cover-pattern
                    after:bg-gradient-to-b after:from-background/50 after:via-background/75 after:to-background
                "
            />
            <Outlet />
        </div>
    );
};

export default UserLayout;