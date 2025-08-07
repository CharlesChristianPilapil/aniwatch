import { Link } from "react-router-dom";
import {
    useGetMostPopularQuery,
    useGetMoviesQuery,
    useGetRecentEpisodesQuery,
    useGetRecentlyAddedQuery,
    useGetSpecialsQuery,
    useGetTopAiringQuery,
    useGetTvQuery,
} from "./services/animeApiQuery";
import type { AnimeCardType } from "./utils/types/anime.type";
import AnimeCard from "./components/AnimeCard";
import GenreCard from "./components/GenreCard";
import AnimeCardSkeleton from "./components/SkeletonLoader/AnimeCard.skeleton";
import AnimeItemListCard from "./components/AnimeItem/AnimeItemListCard";

const AnimeGallery = ({
    title,
    navigationUrl,
    list,
    isLoading,
    isError,
}: {
    title: string;
    navigationUrl: string;
    list: AnimeCardType[];
    isLoading?: boolean;
    isError?: boolean;
}) => {
    return (
        <div>
            <div className="flex justify-between items-center gap-10">
                <h2 className="sub-header"> {title} </h2>
                {(!isLoading || !isError) && (
                    <Link
                        to={navigationUrl}
                        className="hover:text-secondary-accent hover:underline"
                    >
                        View More
                    </Link>
                )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {isLoading || isError
                    ? Array.from({ length: 12 }).map((_, index) => (
                          <AnimeCardSkeleton key={index} />
                      ))
                    : list.map((item) => <AnimeCard key={item.id} {...item} />)}
            </div>
        </div>
    );
};

function App() {
    const page = 1;
    const topAiringQuery = useGetTopAiringQuery({ page });
    const mostPopularQuery = useGetMostPopularQuery({ page });
    const recentlyAddedQuery = useGetRecentlyAddedQuery({ page });
    const recentEpisodeQuery = useGetRecentEpisodesQuery({ page });
    const moviesQuery = useGetMoviesQuery({ page });
    const specialsQuery = useGetSpecialsQuery({ page });
    const tvSeriesQuery = useGetTvQuery({ page });

    const animeSections = [
        {
            title: "Top Airing",
            redirectUrlTo: "/top-airing",
            list: topAiringQuery?.data?.results || [],
            isLoading: topAiringQuery?.isLoading || topAiringQuery?.isFetching,
            isError: topAiringQuery?.isError,
        },
        {
            title: "Most Popular",
            redirectUrlTo: "/most-popular",
            list: mostPopularQuery?.data?.results || [],
            isLoading:
                mostPopularQuery?.isLoading || mostPopularQuery?.isFetching,
            isError: mostPopularQuery?.isError,
        },
        {
            title: "Recently Added",
            redirectUrlTo: "/recently-added",
            list: recentlyAddedQuery?.data?.results || [],
            isLoading:
                recentlyAddedQuery?.isLoading || recentlyAddedQuery?.isFetching,
            isError: recentlyAddedQuery?.isError,
        },
        {
            title: "Recent Episodes",
            redirectUrlTo: "/recent-episodes",
            list: recentEpisodeQuery?.data?.results || [],
            isLoading:
                recentEpisodeQuery?.isLoading || recentEpisodeQuery?.isFetching,
            isError: recentEpisodeQuery?.isError,
        },
    ];

    return (
        <>
            <header className="flex items-center min-h-[calc(100vh-68px)] md:min-h-[calc(100vh-80px)] py-10 bg-[url(/images/frieren-bg.webp)] bg-center bg-no-repeat mb-10 blurred-edge relative">
                <div className="absolute top-0 left-0 w-full h-full bg-black/50" />
                <div className="container relative z-1">
                    <div className="max-w-[800px]">
                        <h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-8xl font-semibold">
                            {" "}
                            Welcome to{" "}
                            <span className="text-primary-accent">
                                AniWatch{" "}
                            </span>{" "}
                        </h2>
                        <div className="space-y-4">
                            <p>
                                AniWatch is a personal project built to explore
                                and learn modern web technologies, offering a
                                seamless anime streaming experience — all for
                                free.
                            </p>
                            <p>
                                Continuously evolving with new features and
                                performance improvements, AniWatch lets you dive
                                into everything from timeless classics to the
                                latest seasonal hits.
                            </p>
                            <p>
                                Discover, stream, and enjoy anime like never
                                before.
                                <span className="block mt-1">
                                    (P.S. It's hosted on a free tier, so initial
                                    loading might take a bit longer — I'm broke
                                    😅.)
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </header>
            <main className="container">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
                    {animeSections.map((data) => (
                        <AnimeItemListCard key={data.title} {...data} />
                    ))}
                </div>
                <div className="flex flex-col lg:flex-row gap-x-5 gap-y-10 mt-10">
                    <div className="flex-1 w-full space-y-10">
                        <AnimeGallery
                            title="Movies"
                            navigationUrl="/movies"
                            list={moviesQuery.data?.results.slice(0, 12) || []}
                            isLoading={
                                moviesQuery.isLoading || moviesQuery.isFetching
                            }
                            isError={
                                !moviesQuery.data?.success ||
                                moviesQuery.isError
                            }
                        />
                        <AnimeGallery
                            title="TV Series"
                            navigationUrl="/tv"
                            list={
                                tvSeriesQuery.data?.results.slice(0, 12) || []
                            }
                            isLoading={
                                tvSeriesQuery.isLoading ||
                                tvSeriesQuery.isFetching
                            }
                            isError={
                                !tvSeriesQuery.data?.success ||
                                tvSeriesQuery.isError
                            }
                        />
                    </div>
                    <div className="w-full lg:w-[400px] space-y-10">
                        <GenreCard />
                        <AnimeItemListCard
                            title="Specials"
                            redirectUrlTo="/specials"
                            list={specialsQuery.data?.results || []}
                            showBackground
                            isError={
                                specialsQuery.isError ||
                                (specialsQuery.isSuccess &&
                                    !specialsQuery.data?.success)
                            }
                            isLoading={
                                specialsQuery.isLoading ||
                                specialsQuery.isFetching
                            }
                        />
                    </div>
                </div>
            </main>
        </>
    );
}

export default App;
