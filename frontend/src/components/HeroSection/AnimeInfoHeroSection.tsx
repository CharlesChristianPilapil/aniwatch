import { Skeleton } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { useGetAnimeInfoQuery } from "../../services/animeApiQuery";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AddBookmarkButton from "../Bookmarks/AddBookmarkButton";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../store";

const AnimeInfoHeroSection = () => {
    const { id } = useParams();
    const { data, isLoading, isFetching } = useGetAnimeInfoQuery({ id: id! });
    // const user = useSelector((state: RootState) => state.auth.userInfo);
    // const dispatch = useDispatch();

    const showLoaders = !data?.success || isLoading || isFetching;

    return (
        <header className="relative bg-main/25 pb-10 lg:pb-0">
            {data?.image && !isFetching && (
                <div
                    className="absolute inset-0 bg-center bg-cover bg-no-repeat blur-md opacity-25 z-0"
                    style={{
                        backgroundImage: `url(${data.image})`,
                    }}
                />
            )}
            <div className="container flex flex-col justify-between gap-5 lg:flex-row relative z-1">
                <div className="flex flex-1 md:flex-row md:items-start items-center justify-center flex-col gap-4 pt-10 md:pb-10">
                    <div className="relative w-[210px] aspect-[2/3]">
                        {showLoaders ? (
                            <Skeleton className="h-full w-full" sx={{ transform: "unset" }} />
                        ) : (
                            <img
                                src={data?.image}
                                alt={`${data?.title} cover.`} 
                                className="object-cover w-full h-full rounded-sm" 
                            />
                        )}
                    </div>
                    <div className="w-full space-y-4 flex flex-col items-center md:items-start flex-1">
                        {showLoaders ? (
                            <div className="w-full flex flex-col justify-center gap-1">
                                <Skeleton className="hidden md:block w-full lg:max-w-[764px]" sx={{ transform: "unset" }} />
                                <Skeleton className="max-w-[764px] h-[40px]" sx={{ transform: "unset" }} />
                                <Skeleton className="w-[255px] h-[60px] mx-auto md:mx-0" sx={{ transform: "unset" }} />
                                <Skeleton className="hidden md:block max-w-[764px] h-[250px]" sx={{ transform: "unset" }} />
                            </div>
                        ) : (
                            <>
                                <div className="hidden md:flex gap-2">
                                    <Link
                                        to={"/"} className="hover:text-secondary-accent hover:underline"
                                    >
                                        Home
                                    </Link>{" "}
                                    /{" "}
                                    <Link
                                        to={`/${
                                            data?.type?.toLowerCase() ?? ""
                                        }`} className="hover:text-secondary-accent hover:underline"
                                    >
                                        {data?.type || "N/A"}
                                    </Link>{" "}
                                    /{" "}
                                    <p className="opacity-50">
                                        {data?.title || "N/A"}{" "}
                                    </p>
                                </div>
                                <h2 className="text-center md:text-start font-semibold text-lg md:text-2xl lg:text-4xl lg:max-w-[764px]">
                                    {data?.title || "N/A"}{" "}
                                </h2>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <Link
                                        to={`/watch/${data?.episodes[0]?.id}`} className="h-full bg-secondary-accent text-background hover:bg-secondary-accent/90 px-4 py-2 rounded-full flex gap-1 items-center"
                                    >
                                        <PlayArrowIcon />
                                        Watch Now
                                    </Link>
                                    <AddBookmarkButton
                                        payload={{
                                            title: data.title,
                                            anime_id: data.id,
                                            image: data.image,
                                            type: data.type,
                                            anime_status: data.status,
                                        }} />
                                </div>
                                <p className="max-w-[764px] lg:min-h-[240px] hidden md:block">
                                    {data?.description}{" "}
                                </p>
                            </>
                        )}
                    </div>
                </div>
                <div className="lg:bg-main/25 w-full lg:w-[300px] xl:w-[400px] lg:pt-10 px-4 md:pb-10 space-y-2">
                    {showLoaders ? (
                        <div className="w-full flex flex-col gap-2">
                            <Skeleton className="h-[32px] lg:hidden" sx={{ transform: "unset" }}/>
                            <Skeleton className="h-[100px] md:h-[150px] lg:hidden" sx={{ transform: "unset" }} />
                            <Skeleton className="h-[32px]" sx={{ transform: "unset" }} />
                            <Skeleton className="h-[32px]" sx={{ transform: "unset" }} />
                            <Skeleton className="h-[32px]" sx={{ transform: "unset" }} />
                            <Skeleton className="h-[32px]" sx={{ transform: "unset" }} />
                            <Skeleton className="h-[32px]" sx={{ transform: "unset" }} />
                        </div>
                    ) : (
                        <>
                            <div className="py-2 space-y-1 md:hidden">
                                <p className="font-semibold"> Overview: </p>
                                <p className="max-h-[100px] sm:max-h-[150px] overflow-y-scroll pr-2">
                                    {data?.description}{" "}
                                </p>
                            </div>
                            <p className="whitespace-nowrap text-ellipsis overflow-hidden">
                                <span className="font-semibold">
                                    Japanese:{" "}
                                </span>{" "}
                                {data?.japaneseTitle}{" "}
                            </p>
                            <p>
                                <strong className=""> Premiered: </strong>{" "}
                                {data?.season || "N/A"}{" "}
                            </p>
                            <p>
                                <strong className=""> Type: </strong>{" "}
                                {data?.type || "N/A"}{" "}
                            </p>
                            <p>
                                <strong className=""> Episodes: </strong>{" "}
                                {data?.totalEpisodes || "N/A"}{" "}
                            </p>
                            <p>
                                <strong className=""> Status: </strong>{" "}
                                {data?.status || "N/A"}{" "}
                            </p>
                            <div className="flex flex-wrap gap-1">
                                <p className="font-semibold mr-1"> Genres: </p>
                                {data?.genres?.map((genre) => (
                                    <Link
                                        key={genre}
                                        to={`/genre/${genre.replace(/\s+/g, "-").toLowerCase()}`} className="px-2 py-1 border border-main rounded-full text-xs hover:bg-background hover:text-secondary-accent"
                                    >
                                        {genre}
                                    </Link>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AnimeInfoHeroSection;
