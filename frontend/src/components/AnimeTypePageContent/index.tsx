import { Pagination } from "@mui/material";
import type { AnimeCardType } from "../../utils/types/anime.type"
import { useSearchParams } from "react-router-dom";
import useGetScreenSize from "../../hooks/useGetScreenSize";
import AnimeCardSkeleton from "../SkeletonLoader/AnimeCard.skeleton";
import { lazy, Suspense } from "react";

const AnimeCard = lazy(() => import("../AnimeCard"));

type AnimeTypePageContentType = {
    title?: string;
    list: AnimeCardType[];
    isLoading: boolean;
    isFetching: boolean;
    totalPages: number;
    isError: boolean;
}

const AnimeTypePageContent = ({
    title = "Title",
    list,
    isLoading,
    isFetching,
    totalPages,
    isError,
}: AnimeTypePageContentType) => {
    const { width } = useGetScreenSize();

    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const currentPage = Math.max(pageParam, 1);

    const showLoaders = list.length === 0 && (!isFetching || !isLoading);

    if (showLoaders) {
        return (
            <div className="w-full flex-1 space-y-4">
                <h2 className="sub-header"> No Anime Found. </h2>
                <div className="hidden lg:grid grid-cols-4 gap-4 mb-4">
                {showLoaders && Array.from({length: 4}).map((_, id) => (
                    <AnimeCardSkeleton key={id} />
                ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {showLoaders && Array.from({length: width >= 1024 ? 36 : 40}).map((_, id) => (
                    <AnimeCardSkeleton key={id} />
                ))}
            </div>
            </div>
        );
    };

    const AnimeCardLoader = ({ length }: { length: number }) => {
        return (
            Array.from({ length }).map((_, id) => (
                <AnimeCardSkeleton key={id} />
            )
        ));
    };

    const AnimeGridItems = ({ items, length }: { items: AnimeCardType[], length: number}) => {
        if (isLoading || isFetching) {
            return <AnimeCardLoader length={length} />
        };

        return (
            <Suspense fallback={<AnimeCardLoader length={length} />}>
                {items.map((anime) => (
                    <AnimeCard key={anime.id} {...anime} />
                ))}
            </Suspense>
        );
    };

    return (
        <div className="w-full flex-1 space-y-4">
            <h2 className="sub-header"> {title} </h2>
            <div className="hidden lg:grid grid-cols-4 gap-4 mb-4">
                <AnimeGridItems items={list.slice(0, 4)} length={4} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                <AnimeGridItems items={list.slice(width >= 1024 ? 4 : 0)} length={width >= 1024 ? 36 : 40} />
            </div>
            {(!isLoading && !isError) && (
                <Pagination
                    size={width >= 1024 ? "medium" : "small"}
                    count={totalPages}
                    page={currentPage}
                    disabled={isLoading}
                    className="custom-pagination mt-5"
                    onChange={(_, value) => {
                        setSearchParams({ page: value.toString() });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                />
            )}
        </div>
    );
};

export default AnimeTypePageContent;