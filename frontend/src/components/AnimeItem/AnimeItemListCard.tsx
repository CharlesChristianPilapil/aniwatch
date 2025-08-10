import AnimeItem from ".";
import { Link } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Skeleton } from "@mui/material";
import AnimeItemSkeleton from "../SkeletonLoader/AnimeItem.skeleton";

type AnimeItemCardType = {
    title: string;
    redirectUrlTo?: string;
    list: {
        id: string;
        title: string;
        image?: string;
        sub?: number;
        dub?: number;
        type: string;
    }[];
    isLoading?: boolean;
    isError?: boolean;
    showBackground?: boolean;
    itemCount?: number;
};

const AnimeItemListCard = ({
    title,
    redirectUrlTo,
    list,
    isLoading = false,
    isError = false,
    showBackground = false,
    itemCount = 5,
}: AnimeItemCardType) => {
    return (
        <div className={`space-y-4`}>
            {isError && !isLoading ? (
                <h2 className="sub-header"> Failed to load {title}. </h2>
            ) : (
                <h2 className="sub-header"> {title} </h2>
            )}
            <div className={`${isLoading ? "space-y-2" : "space-y-4"} ${showBackground ? "bg-main/10 px-2 pt-2 pb-4 rounded" : ""}`}>
                <div className="flex flex-col">
                    {list?.slice(0, itemCount).map((data) => (
                        <AnimeItem
                            key={data.id}
                            id={data.id}
                            title={data.title}
                            image={data.image}
                            sub={data?.sub || 0}
                            dub={data?.dub || 0}
                            type={data.type}
                        />
                    ))}
                    {(isLoading || isError) &&
                        Array.from({ length: itemCount }).map((_, index) => (
                            <AnimeItemSkeleton key={index} />
                        ))}
                </div>
                {(isLoading || isError) && (
                    <Skeleton height={32} sx={{ transform: "unset" }} />
                )}
                {!isLoading && !isError && (
                    <Link
                        to={redirectUrlTo || "/"}
                        className="flex items-center hover:text-secondary-accent focus:text-secondary-accent focus:underline outline-none w-fit"
                    >
                        View More
                        <ArrowForwardIosIcon className="h-[16px]" />
                    </Link>
                )}
            </div>
        </div>
    );
};

export default AnimeItemListCard;
