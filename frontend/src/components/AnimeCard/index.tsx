import { Card, CardMedia } from "@mui/material";
import type { AnimeCardType } from "../../utils/types/anime.type";
import { Link } from "react-router-dom";

const AnimeCard = (props: AnimeCardType) => {
    return (
        <Card className="bg-transparent text-main space-y-2">
            <div className="relative after:absolute after:bottom-0 after:left-0 after:h-[40px] after:w-full after:bg-gradient-to-t after:from-background after:to-transparent after:content-['']">
                <CardMedia 
                    component="img"
                    image={props.image}
                    alt={`${props.title} image.`}
                    className="object-cover aspect-[5/7]"
                />
            </div>
            <div className="px-2 pb-2 space-y-1">
                <h3 className="text-ellipsis whitespace-nowrap overflow-hidden">
                    <Link
                        to={`/info/${props.id}`}
                        className="hover:text-secondary-accent"
                    >
                        {props.title}
                    </Link>
                </h3>
                <div className="flex items-center justify-between">
                    <p className="flex items-center gap-1 text-xs">  
                        <span> {props.type} </span>
                        <div className="h-1 w-1 bg-main rounded-full" aria-hidden />
                        <span> {props.duration} </span>
                    </p>
                    <p className={`font-semibold border px-2 rounded text-sm ${props.nsfw ? 'text-red-500' : ''}`}>
                        {props.nsfw ? '18+' : 'PG'}
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default AnimeCard;