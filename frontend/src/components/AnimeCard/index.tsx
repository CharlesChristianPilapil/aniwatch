import { Card, CardMedia } from "@mui/material";
import type { AnimeCardType } from "../../utils/types/anime.type";
import { Link } from "react-router-dom";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

const AnimeCard = (props: AnimeCardType) => {
    return (
        <Card className="bg-transparent text-main space-y-2">
            <div className="group relative after:absolute after:bottom-0 after:left-0 after:h-[40px] after:w-full after:bg-gradient-to-t after:from-background after:to-transparent after:content-['']">
                <CardMedia
                    component="img"
                    image={props.image}
                    alt={`${props.title} image.`}
                    className="object-cover aspect-[5/7]"
                />
                <Link
                    to={`/info/${props.id}`}
                    className="absolute top-0 left-0 w-full h-full bg-background/25 backdrop-blur-sm flex items-center justify-center invisible opacity-0 group-hover:opacity-100 group-hover:visible group-hover:focus:visible transition-all duration-200 outline-none"
                >
                    <PlayArrowIcon className="h-20 w-20 text-main" />
                </Link>
            </div>
            <div className="px-2 pb-2 space-y-1">
                <h3 className="text-ellipsis whitespace-nowrap overflow-hidden">
                    <Link
                        to={`/info/${props.id}`}
                        className="hover:text-secondary-accent focus:text-secondary-accent focus:underline outline-none "
                    >
                        {props.title}
                    </Link>
                </h3>
                <div className="flex items-center justify-between">
                    <p className="flex items-center gap-1 lg:gap-2 text-xs">
                        <span> {props.type} </span>
                        <span
                            className="h-1 w-1 bg-main rounded-full"
                            aria-hidden
                        />
                        <span> {props.duration} </span>
                    </p>
                    <p
                        className={`font-semibold border px-2 rounded text-sm ${
                            props.nsfw ? "text-red-500" : ""
                        }`}
                    >
                        {props.nsfw ? "18+" : "PG"}
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default AnimeCard;
