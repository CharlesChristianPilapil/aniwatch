import SubtitlesIcon from "@mui/icons-material/Subtitles";
import MicIcon from "@mui/icons-material/Mic";
import { Link } from "react-router-dom";
import type { AnimeItemType } from "../../utils/types/anime.type";

const AnimeItem = ({ id, image, title, sub, dub, type }: AnimeItemType) => {
    return (
        <div className="flex gap-2 border-b border-b-main/25 py-4">
            <div className="relative aspect-[2/3] max-w-[60px]">
                <img
                    src={image}
                    alt={`${title} cover`}
                    className="object-cover w-full h-full rounded"
                />
            </div>
            <div className="flex flex-col justify-center gap-2 flex-1 w-full">
                <h3 className="line-clamp-2">
                    <Link
                        to={`/info/${id}`}
                        className="hover:text-secondary-accent focus:text-secondary-accent focus:underline w-full outline-none"
                    >
                        {title}
                    </Link>
                </h3>
                <div className="text-sm flex gap-[1px] rounded overflow-hidden w-fit">
                    <p className="bg-secondary-accent px-1 flex items-center text-background">
                        <SubtitlesIcon className="h-[16px]" /> {sub}
                    </p>
                    <p className="bg-primary-accent px-1 text-background flex items-center">
                        <MicIcon className="h-[16px]" />
                        {dub}
                    </p>
                    <p className="bg-main/75 text-background px-1"> {type} </p>
                </div>
            </div>
        </div>
    );
};

export default AnimeItem;
