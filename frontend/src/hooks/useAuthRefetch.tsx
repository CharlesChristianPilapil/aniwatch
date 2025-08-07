import { useParams } from "react-router-dom";
import { useIsBookmarkedQuery } from "../services/bookmarkService";

const useAuthRefetch = () => {
    const { id } = useParams();
    const { refetch: checkerRefetch } = useIsBookmarkedQuery(
        { anime_id: id! },
        { skip: !id }
    );

    const refetch = () => {
        checkerRefetch();
    };

    return { refetch };
};

export default useAuthRefetch;
