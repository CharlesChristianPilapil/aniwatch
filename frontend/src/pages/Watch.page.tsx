import { Link, useParams } from "react-router-dom";
import { useGetAnimeInfoQuery } from "../services/animeApiQuery";
import { FormControl, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, Select, Skeleton, type SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";
import RelatedAnimeCard from "../components/RelatedAnimeCard";
import AnimeCard from "../components/AnimeCard";
import AnimeCardSkeleton from "../components/SkeletonLoader/AnimeCard.skeleton";

const WatchPage = () => {
    const { episodeId } = useParams();

    const [animeId, episodeNumber] = (episodeId ?? '').split('$episode$');
    const [language, setLanguage] = useState<'sub' | 'dub'>('sub');

    const { 
        data: AnimeInfoData, 
        isLoading: isAnimeInfoLoading, 
        isFetching: isAnimeInfoFetching,
        isError: isAnimeInfoError,
    } = useGetAnimeInfoQuery({ id: animeId! });

    const chunkSize = 100;
    const totalEpisodes = AnimeInfoData?.episodes?.length || 0;
    const totalChunks = Math.ceil(totalEpisodes / chunkSize);

    const [selectedChunk, setSelectedChunk] = useState(1);

    const handleChange = (e: SelectChangeEvent) => {
        setSelectedChunk(Number(e.target.value));
    };

    // ✅ Automatically set correct chunk when data is ready
    useEffect(() => {
        if (!AnimeInfoData?.episodes || !episodeId) return;

        const index = AnimeInfoData.episodes.findIndex(
            (ep) => ep.id === episodeId
        );

        if (index !== -1) {
            const calculatedChunk = Math.floor(index / chunkSize) + 1;
            setSelectedChunk(calculatedChunk);
        }
    }, [AnimeInfoData?.episodes, episodeId]);

    const visibleEpisodes = AnimeInfoData?.episodes?.slice(
        (selectedChunk - 1) * chunkSize, 
        selectedChunk * chunkSize
    ) || [];

    const episode = AnimeInfoData?.episodes.find((data) => data.id === episodeId);

    return (
        <main className="container py-10">
            <div className="flex flex-col xl:flex-row gap-x-4 gap-y-10">
                <div className="flex flex-col lg:flex-row gap-4 bg-black/25 p-2 rounded-sm flex-1">
                    <div className="w-full lg:max-w-[300px] order-2 lg:order-1">
                        <div className="flex gap-2 text-xs py-2">
                            <div className="flex items-center gap-1">
                                <div className="bg-main/25 h-4 w-4 rounded-sm" /> Filler Episodes
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="bg-secondary-accent/25 h-4 w-4 rounded-sm" /> Non-Filler Episodes
                            </div>
                        </div>
                        <FormControl className="w-full text-main mb-4">
                            <Select 
                                value={String(selectedChunk)}
                                onChange={handleChange} 
                                className="text-background bg-main"
                                disabled={
                                    isAnimeInfoLoading || 
                                    isAnimeInfoFetching || 
                                    (AnimeInfoData && AnimeInfoData?.episodes?.length < 100)
                                }
                                sx={{
                                    border: 'none',
                                    outline: 'none',
                                    boxShadow: 'none',
                                    '.MuiOutlinedInput-notchedOutline': {
                                        border: 'none',
                                    },
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 190,
                                        },
                                    },
                                }}
                            >
                                <MenuItem value={1}>1 - {AnimeInfoData && AnimeInfoData?.episodes?.length <= 100 ? AnimeInfoData?.episodes?.length : '100'}</MenuItem>
                                {AnimeInfoData?.episodes &&
                                    Array.from({ length: totalChunks }).map((_, index) => {
                                        if (index === 0) return null;

                                        const start = index * chunkSize + 1;
                                        const end = Math.min((index + 1) * chunkSize, totalEpisodes);
                                        return (
                                        <MenuItem key={index} value={index + 1}>
                                            {`${start} - ${end}`}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                        <ul className="grid gap-1 text-sm max-h-[480px] overflow-y-scroll scroll-hide">
                            {(isAnimeInfoLoading || isAnimeInfoFetching) ? (
                                Array.from({ length: 10 }).map((_, index) => (
                                    <li key={index}> 
                                        <Skeleton height={44} sx={{ transform: "unset" }} className="bg-main/25" />
                                    </li>
                                ))
                            ) : (
                                visibleEpisodes?.map((episode) => (
                                    <li 
                                        key={episode.id} 
                                        className={`${episode.isFiller ? 'bg-main/25' : 'bg-secondary-accent/25'} overflow-hidden rounded-sm`}
                                    > 
                                        <Link 
                                            to={`/watch/${episode.id}`} 
                                            className={`py-3 block ${episodeId === episode.id ? 'pointer-events-none bg-primary-accent' : ''} px-2`}
                                        >
                                            <div className="flex gap-2">
                                                <span className="w-[24px]"> {episode.number} </span> <span className="whitespace-nowrap overflow-hidden text-ellipsis flex-1">{episode.title}</span>
                                            </div>
                                        </Link>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                    <div className="order-1 w-full space-y-2">
                        {!episode && (!isAnimeInfoLoading || !isAnimeInfoFetching) ? (
                            <p>We couldn't find an episode with that ID. It might have been removed or never existed.</p>
                        ) : (
                            <p>
                                Having trouble loading the video?{' '}
                                <Link to={episode?.url ?? ''} target="_blank" className={`${!episode ? 'pointer-events-none' : 'text-secondary-accent underline'}`}>
                                Click here
                                </Link>{' '}
                                to open it directly in the provider's site.
                            </p>
                        )}
                        <div className="aspect-video w-full rounded-md overflow-hidden">
                            <iframe
                                src={`https://megaplay.buzz/stream/s-2/${episodeNumber}/${language}`}
                                width="100%"
                                height="100%"
                                allow="fullscreen"
                                allowFullScreen
                                sandbox="allow-same-origin allow-scripts"
                                className="w-full h-full"
                                title={`Episode ${episodeNumber}`}
                            />
                        </div>
                        <div>
                            <FormControl className="text-main mb-4 flex sm:flex-row sm:items-center gap-4">
                                <FormLabel id="language-radio-group" className="text-main">Language:</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="language-radio-group"
                                    name="language-radio-group"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value as 'sub' | 'dub')}
                                    className="gap-2 items-center"
                                >
                                    {episode?.isSubbed && (
                                        <FormControlLabel 
                                            value="sub" 
                                            label="English Sub" 
                                            control={
                                                <Radio 
                                                    size="small" 
                                                    className="outline-main"
                                                    sx={{
                                                        color: '#F1F1F1',
                                                        '&.Mui-checked': {
                                                            color: '#FF4C98',
                                                        },
                                                    }} 
                                                />
                                            } 
                                        />
                                    )}
                                    {episode?.isDubbed && (
                                        <FormControlLabel 
                                            value="dub" 
                                            label="English Dub" 
                                            control={
                                                <Radio 
                                                    size="small" 
                                                    className="outline-main"
                                                    sx={{
                                                        color: '#F1F1F1',
                                                        '&.Mui-checked': {
                                                            color: '#FF4C98',
                                                        },
                                                    }} 
                                                />
                                            } 
                                        />
                                    )}
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </div>
                </div>
                <div className="w-full xl:max-w-[400px] space-y-4 relative bg-main/15 px-2 pt-2 pb-4 rounded-sm overflow-hidden">
                    {(AnimeInfoData?.image && !isAnimeInfoFetching && !isAnimeInfoLoading) && (
                        <div
                            className="absolute inset-0 bg-center bg-cover bg-no-repeat blur-md opacity-25 -z-1"
                            style={{
                                backgroundImage: `url(${AnimeInfoData.image})`,
                            }}
                        />
                    )}
                    {(isAnimeInfoLoading || isAnimeInfoFetching || isAnimeInfoError) ? (
                        <>
                            <Skeleton height={32} sx={{ transform: "unset" }} />
                            <div className="relative w-[180px] lg:w-[210px] aspect-[2/3]">
                                <Skeleton className="h-full w-full" sx={{ transform: "unset" }} />
                            </div>
                            <Skeleton height={48} sx={{ transform: "unset" }} />
                            <Skeleton className="h-[150px] xl:h-[124px]" sx={{ transform: "unset" }} />
                            <Skeleton height={32} sx={{ transform: "unset" }} />
                        </>
                    ) : (
                        <>
                            <div className="flex items-center gap-2">
                                <Link 
                                    to="/" 
                                    className="hover:underline hover:text-secondary-accent"
                                > 
                                    Home 
                                </Link>
                                {' '}/{' '}
                                <Link 
                                    to={`/${AnimeInfoData?.type.toLowerCase()}`} 
                                    className="hover:underline hover:text-secondary-accent"
                                > 
                                    {AnimeInfoData?.type}
                                </Link>
                                {' '}/{' '}
                                <Link to={`/info/${AnimeInfoData?.id}`} className="line-clamp-1 opacity-75 hover:underline"> {AnimeInfoData?.title} </Link>
                            </div>
                            <div className="relative w-[180px] lg:w-[210px] aspect-[2/3] rounded-sm bg-main/15">
                                <img 
                                    src={AnimeInfoData?.image}
                                    alt={`${AnimeInfoData?.title} cover.`}
                                    className="object-cover w-full h-full rounded-sm"
                                />
                            </div>
                            <h2 className="text-2xl font-semibold"> {AnimeInfoData?.title} </h2>
                            <p className="max-h-[150px] md:max-h-full xl:max-h-[124px] overflow-y-scroll pr-2"> {AnimeInfoData?.description} </p>
                            <ul className="flex flex-wrap gap-2">
                                {AnimeInfoData?.genres.map((genre) => (
                                    <li key={genre}>
                                        <Link 
                                            key={genre} 
                                            to={`/genre/${genre.replace(/\s+/g, '-').toLowerCase()}`}
                                            className="px-2 py-1 border border-main rounded-full text-xs 
                                                hover:bg-background hover:text-secondary-accent
                                                focus:bg-background focus:text-secondary-accent
                                                active:bg-background active:text-secondary-accent
                                            "
                                        > 
                                            {genre} 
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            </div>
            <div className="flex flex-col xl:flex-row mt-10 gap-x-4 gap-y-10">
                <div className="flex-1">
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
    );
};

export default WatchPage;