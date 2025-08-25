import { useGetMoviesQuery } from "../services/animeApiQuery";
import GenreCard from "../components/GenreCard";
import AnimeTypePageContent from "../components/AnimeTypePageContent";
import { useSearchParams } from "react-router-dom";
import MostPopularItemListCard from "../components/AnimeItem/MostPopularItemListCard";
import PageTitle from "../components/PageTitle";

const MoviesPage = () => {
    const [searchParams] = useSearchParams();
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const { data, isLoading, isError, isFetching } = useGetMoviesQuery({ page: pageParam });

    const animeList = data?.results || [];
    const totalPages = data?.totalPages || 1;

    return (
        <>
            <PageTitle title="Movies" />
            <main className="container flex flex-col lg:flex-row gap-x-5 gap-y-10 mt-5 pb-5">
                <AnimeTypePageContent 
                    title="Movie Anime"
                    list={animeList}
                    isError={isError}
                    isLoading={isLoading}
                    isFetching={isFetching}
                    totalPages={totalPages}
                />
                <div className="lg:w-[400px] space-y-10">
                    <GenreCard />
                    <MostPopularItemListCard />
                </div>
            </main>
        </>
    );
};

export default MoviesPage;