import { useParams, useSearchParams } from "react-router-dom"
import { useGetListByQueryQuery } from "../services/animeApiQuery";
import MostPopularItemListCard from "../components/AnimeItem/MostPopularItemListCard";
import GenreCard from "../components/GenreCard";
import AnimeCard from "../components/AnimeCard";
import useGetScreenSize from "../hooks/useGetScreenSize";
import AnimeCardSkeleton from "../components/SkeletonLoader/AnimeCard.skeleton";
import { Pagination } from "@mui/material";
import { useEffect } from "react";

const SearchAnimePage = () => {
    const { query } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const { width } = useGetScreenSize();

    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const { data, isError, isLoading, isFetching } = useGetListByQueryQuery({ query: query!, page: pageParam });
    const currentPage = Math.max(pageParam, 1);

    const animeList = data?.results || [];

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [pageParam]);

    return (
        <main className="container flex flex-col lg:flex-row gap-x-5 gap-y-10 mt-5 pb-5">
            <div className="w-full flex-1 space-y-4">
                {isError || animeList.length === 0 && (!isLoading || !isFetching) ? (
                    <h2 className="sub-header"> No results for: {query} </h2>
                ) : (
                    <h2 className="sub-header"> Search results for: {query} </h2>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                    {isLoading || isFetching || isError || data?.results.length === 0 ? (
                        Array.from({ length: 36 }).map((_, index) => (
                            <AnimeCardSkeleton key={index} />
                        ))    
                    ) : (
                        animeList.map((anime) => (
                            <AnimeCard 
                                key={anime.id}
                                {...anime}
                            />
                        ))
                    )}
                </div>
                {((!isLoading || !isError) && animeList.length > 0) && (
                    <Pagination
                        size={width >= 1024 ? "medium" : "small"}
                        count={data?.totalPages}
                        page={currentPage}
                        disabled={isLoading || isFetching}
                        className="custom-pagination mt-5"
                        onChange={(_, value) => {
                            setSearchParams({ page: value.toString() });
                        }}
                    />
                )}
            </div>
            <div className="w-full lg:w-[400px] space-y-10">
                <GenreCard />
                <MostPopularItemListCard />
            </div>
        </main>
    );
};

export default SearchAnimePage;