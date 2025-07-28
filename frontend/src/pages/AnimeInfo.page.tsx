import { Link, useParams } from "react-router-dom"
import { useGetAnimeInfoQuery } from "../services/animeApiQuery";
import AnimeCard from "../components/AnimeCard";
import AnimeCardSkeleton from "../components/SkeletonLoader/AnimeCard.skeleton";
import { Skeleton } from "@mui/material";
import GenreCard from "../components/GenreCard";
import RelatedAnimeCard from "../components/RelatedAnimeCard";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const AnimeInfoPage = () => {

    const { id } = useParams();
    const { data, isLoading, isFetching, isError } = useGetAnimeInfoQuery({ id: id! });

    const recommendations = data?.recommendations;

    const showLoaders = !data?.success || isLoading || isFetching;

    if ((!data?.success && !isLoading && !isFetching) || isError) {
        return (
            <main className="container py-20 text-center min-h-[calc(100vh-68px)] md:min-h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-4">
                <h2 className="text-2xl font-semibol">Anime not found</h2>
                <p>The anime you're looking for doesn't exist or the ID is invalid.</p>
                <Link
                    to="/"
                    className="px-4 py-2 bg-primary text-main rounded hover:text-secondary-accent hover:underline"
                >
                    Go back home
                </Link>
            </main>
        );
    }

    return (
        <main>
            <div className="relative bg-main/25 pb-10 lg:pb-0">
                {(data?.image && !isFetching) && (
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
                            {(showLoaders) ? (
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
                            {(showLoaders) ? (
                                <div className="w-full flex flex-col justify-center gap-1">
                                    <Skeleton className="hidden md:block w-full lg:max-w-[764px]" sx={{ transform: "unset" }} />
                                    <Skeleton className="max-w-[764px] h-[40px]" sx={{ transform: "unset" }} />
                                    <Skeleton className="w-[255px] h-[60px] mx-auto md:mx-0" sx={{ transform: "unset" }} />
                                    <Skeleton className="hidden md:block max-w-[764px] h-[250px]" sx={{ transform: "unset" }} />
                                </div>
                            ) : (
                                <>
                                    <div className="hidden md:flex gap-2">
                                        <Link to={"/"} className="hover:text-secondary-accent hover:underline">
                                            Home
                                        </Link>
                                        {' '}/{' '}
                                        <Link to={`/${data?.type?.toLowerCase() ?? ''}`} className="hover:text-secondary-accent hover:underline">
                                            {data?.type || 'N/A'}
                                        </Link>
                                        {' '}/{' '}
                                        <p className="opacity-50"> {data?.title || 'N/A'} </p>
                                    </div>
                                    <h2 className="text-center md:text-start font-semibold text-lg md:text-2xl lg:text-4xl"> {data?.title || 'N/A'} </h2>
                                    <div className="flex gap-2 text-sm">
                                        <Link 
                                            to={`/watch/${data?.episodes[0]?.id}`} 
                                            className="h-full bg-secondary-accent text-background hover:bg-secondary-accent/90 px-4 py-2 rounded-full flex gap-1 items-center"
                                        > 
                                            <PlayCircleOutlineIcon />
                                            Watch Now 
                                        </Link>
                                        <button className="bg-main text-background hover:bg-main/90 px-4 py-2 rounded-full flex items-center gap-1"> 
                                            <AddCircleOutlineIcon />
                                            Add to List 
                                        </button>
                                    </div>
                                    <p className="max-w-[764px] lg:min-h-[240px] hidden md:block"> {data?.description} </p>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="lg:bg-main/25 w-full lg:w-[300px] xl:w-[400px] lg:pt-10 px-4 md:pb-10 space-y-2">
                        {(showLoaders) ? (
                            <div className="w-full flex flex-col gap-2">
                                <Skeleton className="h-[32px] lg:hidden" sx={{ transform: "unset" }} />
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
                                    <p className="max-h-[100px] sm:max-h-[150px] overflow-y-scroll pr-2"> {data?.description} </p>
                                </div>
                                <p className="whitespace-nowrap text-ellipsis overflow-hidden"> <span className="font-semibold"> Japanese: </span> {data?.japaneseTitle} </p>
                                <p> <strong className=""> Premiered: </strong> {data?.season || "N/A"} </p>
                                <p> <strong className=""> Type: </strong> {data?.type || "N/A"} </p>
                                <p> <strong className=""> Episodes: </strong> {data?.totalEpisodes || "N/A"} </p>
                                <p> <strong className=""> Status: </strong> {data?.status || "N/A"} </p>
                                <div className="flex flex-wrap gap-1">
                                    <p className="font-semibold mr-1"> Genres: </p>
                                    {data?.genres?.map((genre) => (
                                        <Link 
                                            key={genre} 
                                            to={`/genre/${genre.replace(/\s+/g, '-').toLowerCase()}`}
                                            className="px-2 py-1 border border-main rounded-full text-xs hover:bg-background hover:text-secondary-accent"
                                        >
                                            {genre}
                                        </Link>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-x-4 gap-y-10 container">
                <div className="flex-1 py-10">
                    <h2 className="text-2xl font-semibold text-primary-accent mb-4"> Recommended for you </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                        {(showLoaders) ? (
                            Array.from({ length: 18 }).map((_, index) => (
                              <AnimeCardSkeleton key={index} />
                            ))
                        ) : (
                            recommendations?.map((data) => (
                              <AnimeCard key={data.id} {...data} />
                            ))
                        )}
                    </div>
                </div>
                <div className="xl:w-[400px] lg:mt-10 space-y-10">
                    <GenreCard />
                    <RelatedAnimeCard
                        list={data?.relatedAnime || []} 
                        isLoading={showLoaders} 
                    />
                </div>
            </div>
        </main>
    )
}
export default AnimeInfoPage