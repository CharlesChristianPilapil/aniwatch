import { Link, useParams } from "react-router-dom";
import { useGetAnimeInfoQuery } from "../services/animeApiQuery";
import AnimeCardSkeleton from "../components/SkeletonLoader/AnimeCard.skeleton";
import GenreCard from "../components/GenreCard";
import RelatedAnimeCard from "../components/RelatedAnimeCard";
import AnimeInfoHeroSection from "../components/HeroSection/AnimeInfoHeroSection";
import { lazy, Suspense } from "react";

const AnimeCard = lazy(() => import('../components/AnimeCard'));

const AnimeInfoPage = () => {
    const { id } = useParams();
    const { data, isLoading, isFetching, isError } = useGetAnimeInfoQuery({
        id: id!,
    });

    const recommendations = data?.recommendations;
    const showLoaders = !data?.success || isLoading || isFetching;

    if ((!data?.success && !isLoading && !isFetching) || isError) {
        return (
            <main className="container pb-20 pt-[calc(80px-72px)] md:pt-0 text-center min-h-[calc(100vh-72px)] md:min-h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-4">
                <img 
                    alt="image of saitama"
                    src="/images/saitama.png"
                    className="max-w-[300px]" 
                />
                <h2 className="text-2xl font-semibold">Anime not found</h2>
                <p>No anime found. It either doesn’t exist… or you messed up the ID.</p>
                <Link
                    to="/"
                    className="px-4 py-2 bg-primary text-main rounded hover:text-secondary-accent underline"
                >
                    Go back home
                </Link>
            </main>
        );
    }

    const AnimeCardLoader = () => {
        return (
            Array.from({ length: 18 }).map((_, index) => (
                <AnimeCardSkeleton key={index} />
            ))
        )
    }

    return (
        <>
            <AnimeInfoHeroSection />
            <main className="flex flex-col lg:flex-row gap-x-4 gap-y-10 container">
                <div className="flex-1 py-10">
                    <h2 className="text-2xl font-semibold text-primary-accent mb-4">
                        Recommended for you
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                        {showLoaders ? (
                            <AnimeCardLoader />
                        ) : (
                            <Suspense
                                fallback={<AnimeCardLoader />}
                            >       
                                {recommendations?.map((data) => (
                                    <AnimeCard key={data.id} {...data} />
                                ))}
                            </Suspense>
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
            </main>
        </>
    );
};
export default AnimeInfoPage;
