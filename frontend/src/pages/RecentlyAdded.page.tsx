import { useSearchParams } from "react-router-dom";
import { useGetRecentlyAddedQuery } from "../services/animeApiQuery";
import AnimeTypePageContent from "../components/AnimeTypePageContent";
import GenreCard from "../components/GenreCard";
import MostPopularItemListCard from "../components/AnimeItem/MostPopularItemListCard";

const RecentlyAddedPage = () => {
    const [searchParams] = useSearchParams();
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const { data, isError, isLoading, isFetching } = useGetRecentlyAddedQuery({ page: pageParam });

    const animeList = data?.results || [];

    return (
        <main className="container flex flex-col lg:flex-row gap-x-5 gap-y-10 mt-5 pb-5">
            <AnimeTypePageContent 
                title="Recently Added"
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
    );
};

export default RecentlyAddedPage;