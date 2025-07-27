import { useParams, useSearchParams } from "react-router-dom";
import { useGetListByGenreQuery } from "../services/animeApiQuery";
import AnimeTypePageContent from "../components/AnimeTypePageContent";
import GenreCard from "../components/GenreCard";
import MostPopularItemListCard from "../components/AnimeItem/MostPopularItemListCard";

const GenreListPage = () => {
    const { genre } = useParams();
    const [searchParams] = useSearchParams();

    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const { data, isError, isLoading, isFetching } = useGetListByGenreQuery({ genre: genre!, page: pageParam });

    const animeList = data?.results || [];

    return (
        <main className="container flex flex-col lg:flex-row gap-x-5 gap-y-10 mt-5 pb-5">
            <AnimeTypePageContent 
                title={`${genre?.charAt(0).toUpperCase()}${genre?.slice(1)} Anime`}
                list={animeList}
                isError={isError}
                isLoading={isLoading}
                isFetching={isFetching}
                totalPages={data?.totalPages || 1}
            />
            <div className="w-full lg:w-[400px] space-y-10">
                <GenreCard />
                <MostPopularItemListCard />
            </div>
        </main>
    );
};

export default GenreListPage;