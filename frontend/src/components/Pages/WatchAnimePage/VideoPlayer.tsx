import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import type { AnimeInfoEpisodeType } from "../../../utils/types/anime.type";
import { Link } from "react-router-dom";
import { useState } from "react";

type Props = {
    episode?: AnimeInfoEpisodeType;
    isLoading?: boolean;
    isFetching?: boolean;
    episodeNumber: string;
}

const VideoPlayer = ({
    episode,
    isLoading,
    isFetching,
    episodeNumber
}: Props) => {
    const [language, setLanguage] = useState<'sub' | 'dub'>('sub');

    const RadioButton = ({ value, label }: { value: string; label: string }) => {
        return (
            <FormControlLabel 
                value={value} 
                label={label} 
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
        );
    };

    return (
        <div className="order-1 w-full space-y-2">
            {!episode && (!isLoading || !isFetching) ? (
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
                        {episode?.isSubbed && <RadioButton value={"sub"} label={"English Sub"} />}
                        {episode?.isDubbed && <RadioButton value="dub" label="English Dub" />}
                    </RadioGroup>
                </FormControl>
            </div>
        </div>
    );
};

export default VideoPlayer;