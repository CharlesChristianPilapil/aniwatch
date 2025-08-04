import { Link } from "react-router-dom";
import { useGetGenreListQuery } from "../../services/animeApiQuery";
import { useState } from "react";
import GenreCardSkeleton from "../SkeletonLoader/GenreCard.skeleton";
import useGetScreenSize from "../../hooks/useGetScreenSize";

const GenreCard = () => {
    const { width } = useGetScreenSize();
    const { data, isLoading, isError } = useGetGenreListQuery();
    const [toggle, setToggle] = useState<boolean>(false);

    const error = data?.genres.length === 0 || isError;

    return (
        <div className="h-fit w-full">
            <h2 className="sub-header">
                {error ? "Failed to load Genres" : "Genres"}
            </h2>
            <div className="bg-main/25 p-2 rounded-sm w-full">
                {(isLoading || error) && <GenreCardSkeleton />}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-1 lg:gap-y-0">
                    {data?.genres
                        ?.slice(
                            0,
                            !toggle
                                ? width >= 1024
                                    ? 21
                                    : 20
                                : data.genres.length
                        )
                        .map((genre) => (
                            <Link
                                to={`/genre/${genre.replace(/\s+/g, "-")}`}
                                key={genre}
                                className="h-fit hover:text-secondary-accent bg-background/75 hover:bg-background focus:bg-background focus:text-secondary-accent outline-none lg:bg-transparent p-3 text-sm rounded-sm"
                            >
                                {genre}
                            </Link>
                        ))}
                </div>
                {!isLoading && !error && (
                    <button
                        onClick={() => setToggle((prevVal) => !prevVal)}
                        className="mt-2 w-full rounded-sm py-2 bg-background/50 cursor-pointer hover:text-primary-accent hover:bg-background/75 focus:text-primary-accent focus:bg-background/75"
                    >
                        {!toggle ? "Show More" : "Show Less"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default GenreCard;
