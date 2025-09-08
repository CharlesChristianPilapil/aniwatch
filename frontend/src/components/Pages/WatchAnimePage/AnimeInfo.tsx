import { Skeleton } from "@mui/material";
import type { AnimeInfoType } from "../../../utils/types/anime.type"
import { Link } from "react-router-dom";

type Props = {
    AnimeInfoData?: AnimeInfoType;
    isLoading?: boolean;
    isFetching?: boolean;
    isError?: boolean;
}

const AnimeInfo = ({
    AnimeInfoData,
    isLoading,
    isFetching,
    isError
}: Props) => {
    return (
        <div className="w-full xl:max-w-[400px] space-y-4 relative bg-card px-2 pt-2 pb-4 rounded-sm overflow-hidden">
            {(AnimeInfoData?.image && !isFetching && !isLoading) && (
                <div
                    className="absolute inset-0 bg-center bg-cover bg-no-repeat blur-md opacity-25 -z-1"
                    style={{
                        backgroundImage: `url(${AnimeInfoData.image})`,
                    }}
                />
            )}
            {(isLoading || isFetching || isError) ? (
                <>
                    <Skeleton height={32} sx={{ transform: "unset" }} />
                    <div className="relative w-[180px] lg:w-[210px] aspect-[2/3]">
                        <Skeleton className="h-full w-full" sx={{ transform: "unset" }} />
                    </div>
                    <Skeleton height={48} sx={{ transform: "unset" }} />
                    <Skeleton className="h-[150px] xl:h-[124px]" sx={{ transform: "unset" }} />
                    <Skeleton height={32} sx={{ transform: "unset" }} />
                </>
            ) : (
                <>
                    <div className="flex items-center gap-2">
                        <Link 
                            to="/" 
                            className="hover:underline hover:text-secondary-accent"
                        > 
                            Home 
                        </Link>
                        {' '}/{' '}
                        <Link 
                            to={`/${AnimeInfoData?.type.toLowerCase()}`} 
                            className="hover:underline hover:text-secondary-accent"
                        > 
                            {AnimeInfoData?.type}
                        </Link>
                        {' '}/{' '}
                        <Link to={`/info/${AnimeInfoData?.id}`} className="line-clamp-1 opacity-75 hover:underline"> {AnimeInfoData?.title} </Link>
                    </div>
                    <div className="relative w-[180px] lg:w-[210px] aspect-[2/3] rounded-sm bg-main/15">
                        <img 
                            src={AnimeInfoData?.image}
                            alt={`${AnimeInfoData?.title} cover.`}
                            className="object-cover w-full h-full rounded-sm"
                        />
                    </div>
                    <h2 className="text-2xl font-semibold"> {AnimeInfoData?.title} </h2>
                    <p className="max-h-[150px] md:max-h-full xl:max-h-[124px] overflow-y-scroll pr-2"> {AnimeInfoData?.description} </p>
                    <ul className="flex flex-wrap gap-2">
                        {AnimeInfoData?.genres.map((genre) => (
                            <li key={genre}>
                                <Link 
                                    key={genre} 
                                    to={`/genre/${genre.replace(/\s+/g, '-').toLowerCase()}`}
                                    className="px-2 py-1 border border-main rounded-full text-xs 
                                        hover:bg-background hover:text-secondary-accent
                                        focus:bg-background focus:text-secondary-accent
                                        active:bg-background active:text-secondary-accent
                                    "
                                > 
                                    {genre} 
                                </Link>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default AnimeInfo;