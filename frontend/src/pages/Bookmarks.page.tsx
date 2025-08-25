import { Link, useParams, useSearchParams } from "react-router-dom";
import { useGetBookmarkListQuery } from "../services/bookmarkService";
import SelectField from "../components/SelectField";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AnimeCard from "../components/AnimeCard";
import AnimeCardSkeleton from "../components/SkeletonLoader/AnimeCard.skeleton";
import { Pagination } from "@mui/material";
import useGetScreenSize from "../hooks/useGetScreenSize";

const BookmarksPage = () => {
    const { width } = useGetScreenSize();
    const [searchParams, setSearchParams] = useSearchParams();  
    const { username } = useParams();
    
    const queryArgs = {
        status: searchParams.get("status") || "",
        sort: searchParams.get("sort") || "created_at",
        order: searchParams.get("order") || "desc",
        page: parseInt(searchParams.get("page") || "1", 10),
    };
    
    const { data, isError, isLoading, isFetching } = useGetBookmarkListQuery({username, ...queryArgs});

    const animeList = isError ? [] : (data?.results || []);

    const sortBy = [
        {
            value: "created_at",
            label: "Date added",
        },
        {
            value: "title",
            label: "Title",
        },
        {
            value: "type",
            label: "Type",
        }
    ];

    const bookmark_type = {
        watching: "Watching",
        completed: "Completed",
        "on-hold": "On-hold",
        dropped: "Dropped",
        "plan-to-watch": "To watch",
        ongoing: "Ongoing",
    };

    const bookmarkTypeArray = Object.entries(bookmark_type).map(([value, label]) => ({
        value,
        label,
    }));

    const orderBy = [
        {
            label: "Ascending",
            value: "asc",
        },
        {
            label: "Descending",
            value: "desc",
        }
    ]

    const handleUpdateQueryParams = (key: string, value: string) => {
        setSearchParams(prev => {
            const params = Object.fromEntries(prev);
            if (key !== "page") {
                params.page = "1"
            };
            return {...params, [key]: value};
        });
    };

    return (
        <>
            <main className="container max-w-[1246px] flex flex-col lg:flex-row gap-x-5 gap-y-10 pt-10 pb-5">
                <div className="space-y-10 w-full min-height-screen">
                    <Link to={`/user/${username}`} className="flex items-center gap-1 hover:text-secondary-accent focus:text-secondary-accent active:text-secondary-accent w-fit"> 
                        <ArrowBackIosIcon className="text-sm" />
                        Back 
                    </Link>
                    <div className="space-y-4">
                        <h2 className="sub-header"> 
                            {username}{username?.endsWith('s') ? "'" : "'s"} Bookmarked Anime 
                        </h2>
                        <div className="flex flex-col md:flex-row justify-between gap-10">
                            <div className="flex gap-2 h-fit flex-wrap">
                                {[{label: "All", value: ""}, ...bookmarkTypeArray].map((item) => (
                                    <button 
                                        key={item.value} 
                                        onClick={() => handleUpdateQueryParams("status", item.value)}
                                        className={`
                                            cursor-pointer py-1 px-2 rounded text-background backdrop-blur-sm
                                            hover:bg-primary-accent active:bg-primary-accent focus:bg-primary-accent 
                                            ${item.value === queryArgs.status ? "bg-primary-accent pointer-events-none outline-secondary-accent outline" : "bg-primary-accent/75"}
                                        `}
                                    > 
                                        {item.label} 
                                    </button>
                                ))}
                            </div>
                            <div className="w-[280px] gap-4 grid grid-cols-2 h-fit">
                                <SelectField 
                                    label={"Sort by"}
                                    options={sortBy}
                                    defaultValue={queryArgs.sort}
                                    onChange={(e) => handleUpdateQueryParams("sort", e.target.value)}
                                />
                                <SelectField 
                                    removeEmptyOption
                                    label={"Order by"}
                                    options={orderBy}
                                    defaultValue={queryArgs.order}
                                    onChange={(e) => handleUpdateQueryParams("order", e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            {!animeList.length && (!isLoading || !isFetching) && <p> No bookmarked anime found. </p>}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {isLoading || isFetching ? (
                                    Array.from({ length: 40 }).map((_, index) => (
                                        <AnimeCardSkeleton key={index} />
                                    ))
                                ) : (
                                    animeList.map((data) => (
                                        <AnimeCard 
                                            key={data.id}
                                            {...data}
                                        />
                                    ))
                                )}
                            </div>
                            {(!isLoading && !isError) && (
                                <Pagination
                                    size={width >= 1024 ? "medium" : "small"}
                                    count={data?.totalPages}
                                    page={data?.currentPage}
                                    disabled={isLoading}
                                    className="custom-pagination mt-5"
                                    onChange={(_, value) => {
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                        handleUpdateQueryParams("page", value.toString());;
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}
export default BookmarksPage