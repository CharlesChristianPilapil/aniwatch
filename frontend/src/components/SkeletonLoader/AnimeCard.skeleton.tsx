import { Skeleton, Stack } from "@mui/material";

const AnimeCardSkeleton = () => {
    return (
        <Stack className="relative space-y-1">
            <Skeleton className="aspect-[5/7] bg-main/25" sx={{ transform: "unset" }} />
            <div>
                <Skeleton height={32} variant="text" className="bg-main/25" />
                <Skeleton height={32} variant="text" className="bg-main/25" />
            </div>
        </Stack>
    );
};

export default AnimeCardSkeleton;