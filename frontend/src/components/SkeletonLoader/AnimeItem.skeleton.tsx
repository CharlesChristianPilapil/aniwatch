import { Skeleton } from "@mui/material"

const AnimeItemSkeleton = () => {
    return (
        <div className="py-4 flex gap-2 border-b border-b-main/25">
            <div className="relative aspect-[2/3] w-[60px] shrink-0">
                <Skeleton className="w-full h-full" sx={{ transform: "unset" }} />
            </div>
            <div className="flex-1 w-full flex justify-center flex-col gap-2">
                <Skeleton variant="text" height={40} sx={{ transform: "unset" }} />
                <Skeleton variant="text" sx={{ transform: "unset" }} />
            </div>
        </div>
    )
}
export default AnimeItemSkeleton