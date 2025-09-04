import { useParams } from "react-router-dom";
import { useGetAnimeInfoQuery } from "../services/animeApiQuery";
import RelatedAnimeCard from "../components/RelatedAnimeCard";
import AnimeCard from "../components/AnimeCard";
import AnimeCardSkeleton from "../components/SkeletonLoader/AnimeCard.skeleton";
import PageTitle from "../components/PageTitle";
import EpisodeCommentSection from "../components/Comment/EpisodeComments";
import EpisodeList from "../components/Pages/WatchAnimePage/EpisodeList";
import VideoPlayer from "../components/Pages/WatchAnimePage/VideoPlayer";
import AnimeInfo from "../components/Pages/WatchAnimePage/AnimeInfo";
import useWebSocket from "../hooks/useWebSocket";
import { useEffect } from "react";

const WatchPage = () => {
    const { episodeId } = useParams();
    const { sendMessage, socket } = useWebSocket();

    const [animeId, episodeNumber] = (episodeId ?? '').split('$episode$');

    const { 
        data: AnimeInfoData, 
        isLoading: isAnimeInfoLoading, 
        isFetching: isAnimeInfoFetching,
        isError: isAnimeInfoError,
    } = useGetAnimeInfoQuery({ id: animeId! });

    const episode = AnimeInfoData?.episodes.find((data) => data.id === episodeId);

    const title = isAnimeInfoLoading || isAnimeInfoFetching ? "loading" : `| ${AnimeInfoData?.title} | Episode ${episode?.number}`;

    useEffect(() => {
        if (!socket) return;
      
        const handleOpen = () => {
          sendMessage({
            type: "join",
            action: "watching",
            channel: episodeId,
          });
        };
      
        if (socket.readyState === WebSocket.OPEN) handleOpen();
        else socket.addEventListener("open", handleOpen);
      
        return () => socket.removeEventListener("open", handleOpen);
      }, [episodeId, sendMessage, socket]);

    return (
        <>
            <PageTitle title={`Watch ${title}`} />
            <main className="container py-10">
                <div className="flex flex-col xl:flex-row gap-x-4 gap-y-10">
                    <div className="flex flex-col lg:flex-row gap-4 bg-black/25 p-2 rounded-sm flex-1">
                        <EpisodeList 
                            episodes={AnimeInfoData?.episodes || []}
                            isLoading={isAnimeInfoLoading}
                            isFetching={isAnimeInfoFetching}
                        />
                        <VideoPlayer
                            episode={episode}
                            isLoading={isAnimeInfoLoading} 
                            isFetching={isAnimeInfoFetching}
                            episodeNumber={episodeNumber}
                        />
                    </div>
                    <AnimeInfo 
                        AnimeInfoData={AnimeInfoData}
                        isLoading={isAnimeInfoLoading}
                        isFetching={isAnimeInfoFetching}
                        isError={isAnimeInfoError}
                    />
                </div>
                <div className="flex flex-col xl:flex-row mt-10 gap-x-4 gap-y-10">
                    <div className="flex-1 space-y-10">
                        <EpisodeCommentSection />
                        <div>
                            <h2 className="sub-header"> Recommended for you </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 rounded-sm">
                                {!AnimeInfoData?.recommendations ? (
                                    Array.from({ length: 18 }).map((_, key) => (
                                        <AnimeCardSkeleton key={key} />
                                    ))
                                ) : (
                                    AnimeInfoData?.recommendations.map((recommendation) => (
                                        <AnimeCard key={recommendation.id} {...recommendation} />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="lg:w-[400px]">
                        {(isAnimeInfoLoading || isAnimeInfoFetching || (AnimeInfoData && AnimeInfoData?.relatedAnime.length > 0)) && (
                            <RelatedAnimeCard 
                                list={AnimeInfoData?.relatedAnime || []}
                                isLoading={isAnimeInfoLoading || isAnimeInfoFetching}
                            />
                        )}
                    </div>
                </div>
            </main>
        </>
    );
};

export default WatchPage;