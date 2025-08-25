import { useParams, useSearchParams } from "react-router-dom";
import { useGetGenreListQuery, useGetListByGenreQuery } from "../services/animeApiQuery";
import AnimeTypePageContent from "../components/AnimeTypePageContent";
import GenreCard from "../components/GenreCard";
import MostPopularItemListCard from "../components/AnimeItem/MostPopularItemListCard";
import PageTitle from "../components/PageTitle";

const GenreListPage = () => {
    const { genre } = useParams();
    const [searchParams] = useSearchParams();
    const { data: genreList } = useGetGenreListQuery();

    const pageParam = parseInt(searchParams.get("page") || "1", 10);
    const { data, isError, isLoading, isFetching } = useGetListByGenreQuery({ genre: genre!, page: pageParam });

    const animeList = data?.results || [];

    const editedGenreList = genreList?.genres.map((data) => data.toLowerCase().replace(/\s+/g, "-"));
    const genreIndex = editedGenreList?.indexOf(genre!);

    const genreName = genreList?.genres[genreIndex!];
    const title = genreName ? `${genreName?.charAt(0).toUpperCase()}${genreName?.slice(1)}` : "";

    return (
        <>
            <PageTitle title={`Genre ${title ? `| ${title}` : ""}`} />
            <main className="container flex flex-col lg:flex-row gap-x-5 gap-y-10 mt-5 pb-5">
                <AnimeTypePageContent 
                    title={`${title} Anime`}
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
        </>
    );
};

export default GenreListPage;