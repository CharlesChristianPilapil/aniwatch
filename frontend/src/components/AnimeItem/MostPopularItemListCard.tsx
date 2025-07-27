import { useGetMostPopularQuery } from "../../services/animeApiQuery"
import AnimeItemListCard from "./AnimeItemListCard"

const MostPopularItemListCard = () => {
    const page = 1;
    const { data, isLoading, isFetching, isError } = useGetMostPopularQuery({ page });

    return (
        <AnimeItemListCard 
            title="Most Popular"
            redirectUrlTo="/most-popular"
            itemCount={10}
            showBackground
            list={data?.results || []}
            isError={!data || isError}
            isLoading={isLoading || isFetching}
        />
    );
};

export default MostPopularItemListCard;