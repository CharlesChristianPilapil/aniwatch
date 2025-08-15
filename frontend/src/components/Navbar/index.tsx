import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import SearchIcon from "@mui/icons-material/Search";
import useGetScreenSize from "../../hooks/useGetScreenSize";

import ProfileMenu from "../ProfileMenu";
import { Modal, useScrollTrigger } from "@mui/material";

const Navbar = () => {
    const navigate = useNavigate();

    const { width } = useGetScreenSize();

    const [toggle, setToggle] = useState<boolean>(false);
    const [showSearchBar, setShowSearchBar] = useState<boolean>(false);

    const handleQuery = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const query = formData.get("search")?.toString().trim();

        if (showSearchBar) {
            setShowSearchBar(false);
        }

        if (query) {
            navigate(`/search/${encodeURIComponent(query)}`);
            e.currentTarget.reset();
            (document.activeElement as HTMLElement)?.blur();
        }
    };

    const trigger = useScrollTrigger({
        threshold: 50,
        disableHysteresis: true,
    })

    useEffect(() => {
        if (width >= 640 && showSearchBar) {
            setShowSearchBar(false);
        }
    }, [width, showSearchBar]);

    return (
        <>
            <nav className={`sticky top-0 z-8 ${trigger ? "bg-background/75 backdrop-blur-sm shadow-md" : "bg-background"}`}>
                <div className="container py-5 flex items-center justify-between gap-5">
                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-4">
                        <button
                            aria-label="Toggle sidebar"
                            className="relative h-6 w-6 cursor-pointer group z-1"
                            onClick={() => setToggle(true)}
                        >
                            <div
                                className="
                                    absolute top-0
                                    h-[2px] w-3/4 bg-main
                                    group-hover:w-full group-hover:bg-primary-accent
                                    group-focus:w-full group-focus:bg-primary-accent
                                    group-active:w-full group-active:bg-primary-accent
                                    transition-all duration-200
                                "
                            />
                            <div
                                className="
                                    absolute top-1/2 -translate-y-1/2
                                    h-[2px] w-full bg-main
                                    group-hover:bg-primary-accent
                                    group-focus:bg-primary-accent
                                    group-active:bg-primary-accent
                                    transition-all duration-200
                                "
                            />
                            <div
                                className="
                                    absolute bottom-0
                                    h-[2px] w-1/4 bg-main
                                    group-hover:w-3/4 group-hover:bg-primary-accent
                                    group-focus:w-3/4 group-focus:bg-primary-accent
                                    group-active:w-3/4 group-active:bg-primary-accent
                                    transition-all duration-200
                                "
                            />
                        </button>
                            <Link to={"/"}>
                                <h1 className="font-bold text-xl lg:text-2xl hover:text-secondary-accent focus:text-secondary-accent active:text-secondary-accent">
                                    AniWatch
                                </h1>
                            </Link>
                        </div>
                        <form
                            onSubmit={handleQuery}
                            className="bg-main text-background rounded-full hidden sm:flex items-center overflow-hidden"
                        >
                            <input
                                name="search"
                                type="text"
                                placeholder="search"
                                className="rounded outline-none px-4 py-2 flex-1 w-full"
                            />
                            <button
                                type="submit"
                                className="h-10 w-10 bg-secondary-accent cursor-pointer"
                            >
                                <SearchIcon />
                            </button>
                        </form>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="sm:hidden">
                            <button
                                aria-label="toggle search bar for small screens"
                                className={`rounded-sm p-[2px] relative z-10 cursor-pointer`}
                                onClick={() => setShowSearchBar((prevVal) => !prevVal)}
                            >
                                <SearchIcon />
                            </button>
                            <Modal 
                                open={showSearchBar} 
                                onClose={() => setShowSearchBar(false)}
                                className="backdrop-blur-xs bg-background/25 flex justify-end px-5"
                            >
                                <form
                                    onClick={(e) => e.stopPropagation()}
                                    onSubmit={handleQuery}
                                    className="mt-[54px] max-w-[250px] h-fit bg-main text-background flex rounded-sm items-center overflow-hidden z-10"
                                >
                                    <input
                                        name="search"
                                        type="text"
                                        placeholder="search"
                                        className="rounded outline-none px-4 py-2 flex-1 w-full"
                                    />
                                    <button
                                        type="submit"
                                        className="h-10 w-10 bg-secondary-accent cursor-pointer"
                                    >
                                        <SearchIcon />
                                    </button>
                                </form>
                            </Modal>
                        </div>
                        <ProfileMenu />
                    </div>
                </div>
                <SideBar
                    isToggled={toggle}
                    onToggle={(e: boolean) => setToggle(e)}
                />
            </nav>
        </>
    );
};

export default Navbar;
