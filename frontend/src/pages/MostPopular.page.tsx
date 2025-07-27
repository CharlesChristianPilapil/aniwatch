import { useSearchParams } from "react-router-dom";
import AnimeTypePageContent from "../components/AnimeTypePageContent";
import GenreCard from "../components/GenreCard";
import { useGetMostPopularQuery, useGetTopAiringQuery } from "../services/animeApiQuery";
import AnimeItemListCard from "../components/AnimeItem/AnimeItemListCard";

const MostPopularPage = () => {
    const [searchParams] = useSearchParams();
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const { data, isError, isLoading, isFetching } = useGetMostPopularQuery({ page: pageParam });
    const topAiringQuery = useGetTopAiringQuery({ page: 1 });

    const animeList = data?.results || [];

    return (
        <main className="container flex flex-col lg:flex-row gap-x-5 gap-y-10 mt-5 pb-5">
            <AnimeTypePageContent 
                title="Most Popular"
                list={animeList}
                isError={isError}
                isLoading={isLoading}
                isFetching={isFetching}
                totalPages={data?.totalPages || 1}
            />
            <div className="lg:w-[400px] space-y-10">
                <GenreCard />
                <AnimeItemListCard 
                    title="Top Airing"
                    redirectUrlTo="/top-airing"
                    itemCount={10}
                    showBackground
                    list={topAiringQuery.data?.results || []}
                    isError={!topAiringQuery.data || topAiringQuery.isError}
                    isLoading={topAiringQuery.isLoading || topAiringQuery.isFetching}
                />
            </div>
        </main>
    );
};

export default MostPopularPage