import { FormControl, Select, MenuItem, Skeleton, type SelectChangeEvent } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import type { AnimeInfoEpisodeType } from "../../../utils/types/anime.type";
import { useState, useEffect } from "react";

type Props = {
    episodes: AnimeInfoEpisodeType[];
    isFetching?: boolean;
    isLoading?: boolean;
}

const EpisodeList = ({ episodes, isFetching, isLoading }: Props) => {
    const { episodeId } = useParams();

    const chunkSize = 100;
    const totalEpisodes = episodes?.length || 0;
    const totalChunks = Math.ceil(totalEpisodes / chunkSize);

    const [selectedChunk, setSelectedChunk] = useState(1);

    const handleChange = (e: SelectChangeEvent) => {
        setSelectedChunk(Number(e.target.value));
    };

    useEffect(() => {
        if (!episodes || !episodeId) return;

        const index = episodes.findIndex(
            (ep) => ep.id === episodeId
        );

        if (index !== -1) {
            const calculatedChunk = Math.floor(index / chunkSize) + 1;
            setSelectedChunk(calculatedChunk);
        }
    }, [episodes, episodeId]);

    const visibleEpisodes = episodes?.slice(
        (selectedChunk - 1) * chunkSize, 
        selectedChunk * chunkSize
    ) || [];

    return (
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
                        isLoading || 
                        isFetching || 
                        episodes?.length < 100
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
                    <MenuItem value={1}>1 - {episodes?.length <= 100 ? episodes?.length : '100'}</MenuItem>
                    {episodes &&
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
                {(isLoading || isFetching) ? (
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
    );
};

export default EpisodeList;