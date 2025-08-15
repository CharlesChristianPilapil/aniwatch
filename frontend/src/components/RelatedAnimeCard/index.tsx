import { lazy, Suspense, useState } from "react";
import type { AnimeItemType } from "../../utils/types/anime.type"
import AnimeItemSkeleton from "../SkeletonLoader/AnimeItem.skeleton";
import { Skeleton } from "@mui/material";;

const AnimeItem = lazy(() => import("../AnimeItem"));

type Props = {
    list: AnimeItemType[];
    isLoading?: boolean;
}

const RelatedAnimeCard = ({ list, isLoading = false }: Props) => {

    const [toggle, setToggle] = useState<boolean>(false);

    const AnimeItemLoader = () => {
        return (
            Array.from({ length: 5 }).map((_, index) => (
                <li key={index}>
                    <AnimeItemSkeleton />
                </li>
            ))
        );
    };

    return (
        <div className="w-full">
            <h2 className="sub-header"> Related Anime </h2>
            <div className="bg-main/10 pb-4 rounded-sm">
                <ul className={`max-h-[624px] ${list.length < 6 || isLoading ? 'overflow-y-hidden' : 'overflow-y-scroll'} pt-2 px-2 transparent-track`}>
                    {isLoading ? (
                        <AnimeItemLoader />
                    ) : (
                        <Suspense fallback={<AnimeItemLoader />}>
                            {list.slice(0, !toggle ? 6 : list.length).map((item) => (
                                <li key={item.id}>
                                    <AnimeItem 
                                        key={item.id} 
                                        id={item.id}
                                        title={item.title}
                                        image={item.image}
                                        sub={item.sub}
                                        dub={item.dub}
                                        type={item.type}
                                    />
                                </li>
                            ))}
                        </Suspense>
                    )}
                </ul>
                <div className="px-2 pb-2">
                    {isLoading ? (
                        <Skeleton variant="text" height={48} sx={{ transform: "unset" }} className="mt-2" />
                    ) : (
                        list.length > 6 && (
                            <button
                                onClick={() => setToggle(prevVal => !prevVal)} 
                                className="w-full bg-primary-accent rounded-sm py-3 mt-2 cursor-pointer hover:opacity-80 focus:opacity-80 active:opacity-80"
                            > 
                                {!toggle ? 'Show More' : 'Show Less'} 
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default RelatedAnimeCard;