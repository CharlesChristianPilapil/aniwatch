import { Skeleton } from "@mui/material"
import useGetScreenSize from "../../hooks/useGetScreenSize";

const GenreCardSkeleton = () => {

    const { width } = useGetScreenSize();

    return (
        <div className="space-y-1">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-2 lg:gap-y-1">
                {Array.from({ length: width >= 1024 ? 21 : 20 }).map((_, index) => (
                    <Skeleton key={index} variant="rectangular" height={40} className="rounded-sm" />
                ))}
            </div>
            <Skeleton variant="rectangular" height={40} className="rounded-sm" />
        </div>
    );
};

export default GenreCardSkeleton;