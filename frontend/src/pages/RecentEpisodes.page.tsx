import { useSearchParams } from "react-router-dom";
import AnimeTypePageContent from "../components/AnimeTypePageContent";
import GenreCard from "../components/GenreCard";
import { useGetRecentEpisodesQuery } from "../services/animeApiQuery";
import MostPopularItemListCard from "../components/AnimeItem/MostPopularItemListCard";
import PageTitle from "../components/PageTitle";

const RecentEpisodesPage = () => {
    const [searchParams] = useSearchParams();
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const { data, isError, isLoading, isFetching } = useGetRecentEpisodesQuery({ page: pageParam });

    const animeList = data?.results || [];

    return (
        <>
            <PageTitle title="Recent Episodes" />
            <main className="container flex flex-col lg:flex-row gap-x-5 gap-y-10 mt-5 pb-5">
                <AnimeTypePageContent 
                    title="Recent Episodes"
                    list={animeList}
                    isError={isError}
                    isLoading={isLoading}
                    isFetching={isFetching}
                    totalPages={data?.totalPages || 1}
                />
                <div className="lg:w-[400px] space-y-10">
                    <GenreCard />
                    <MostPopularItemListCard />
                </div>
            </main>
        </>
    );
};

export default RecentEpisodesPage;