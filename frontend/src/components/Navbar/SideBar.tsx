import { Link } from "react-router-dom";
import { useGetGenreListQuery } from "../../services/animeApiQuery";
import { useState } from "react";
import { Drawer } from "@mui/material";

type SideBarType = {
    isToggled: boolean;
    onToggle: (e: boolean) => void;
};

const SideBar = ({ isToggled = false, onToggle }: SideBarType) => {
    const { data, isError } = useGetGenreListQuery();

    const [showGenre, setShowGenre] = useState<boolean>(false);

    const links = [
        {
            label: "Top Airing",
            url: "/top-airing",
        },
        {
            label: "Most Popular",
            url: "/most-popular",
        },
        {
            label: "Recently Added",
            url: "/recently-added",
        },
        {
            label: "Recent Episodes",
            url: "/recent-episodes",
        },
        {
            label: "ONAs",
            url: "/ona",
        },
        {
            label: "OVAs",
            url: "/ova",
        },
        {
            label: "Specials",
            url: "/specials",
        },
        {
            label: "Movies",
            url: "/movies",
        },
        {
            label: "TV Series",
            url: "/tv",
        },
    ];

    return (
        <Drawer 
            open={isToggled} 
            onClose={() => onToggle(false)}
            slotProps={{
                paper: {
                    className: 'bg-background/25 text-main'
                }
            }}
            className="backdrop-blur-xs"
        >
            <div className="w-[250px] py-8 overflow-y-scroll scroll-hide bg-transparent">
                <button
                    onClick={() => onToggle(false)}
                    className="cursor-pointer mx-5 mb-5 hover:text-primary-accent focus:text-primary-accent focus:underline focus:outline-none"
                >
                    Close Menu
                </button>
                <ul>
                    {links.map((link, index) => (
                        <li key={index} className="w-full">
                            <Link
                                to={link.url}
                                className="px-5 py-5 border-b border-main/25 w-full block hover:text-secondary-accent hover:bg-background/50 focus:text-secondary-accent focus:bg-background/50 outline-none"
                                onClick={() => onToggle(false)}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
                {((data && data?.genres?.length > 0) || !isError) && (
                    <div className="space-y-4 mt-4">
                        <h2 className="px-4 font-semibold text-primary-accent">
                            Genres
                        </h2>
                        <ul className="grid grid-cols-2 gap-x-2 pr-4">
                            {data?.genres
                                .slice(
                                    0,
                                    showGenre
                                        ? data.genres.length
                                        : Math.floor(data.genres.length / 2)
                                )
                                .map((genre) => (
                                    <Link
                                        key={genre}
                                        to={`/genre/${genre.replace(
                                            /\s+/g,
                                            "-"
                                        )}`}
                                        onClick={() => onToggle(false)}
                                        className="text-sm pl-4 py-2 hover:bg-background/75 hover:text-secondary-accent focus:bg-background/75 focus:text-secondary-accent outline-none rounded-sm"
                                    >
                                        {genre}
                                    </Link>
                                ))}
                        </ul>
                        <div className="px-4">
                            <button
                                onClick={() =>
                                    setShowGenre((prevVal) => !prevVal)
                                }
                                className="w-full rounded bg-background/50 hover:text-primary-accent hover:bg-background/75 focus:bg-background/50 focus:text-primary-accent outline-primary-accent py-2 cursor-pointer"
                            >
                                {!showGenre ? "Show More" : "Show Less"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Drawer>
    );
};

export default SideBar;
