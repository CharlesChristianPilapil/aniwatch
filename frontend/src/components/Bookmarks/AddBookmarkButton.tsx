import {
    Popper,
    Grow,
    Paper,
    ClickAwayListener,
    MenuList,
    MenuItem,
} from "@mui/material";
import {
    useState,
    useRef,
    type SyntheticEvent,
    useEffect,
    type KeyboardEvent,
    type JSX,
} from "react";
import {
    useAddBookmarkMutation,
    useIsBookmarkedQuery,
} from "../../services/bookmarkService";
import AddIcon from "@mui/icons-material/Add";
import AuthModal from "../Modal/AuthModal";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { cleanPayload } from "../../utils/helpers/cleanPayload";
import toast from "react-hot-toast";
import type { BookmarkStatus } from "../../utils/types/bookmark.type";

import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import { bookmark_type } from "../../utils/constants/bookmarks";

type AddToBookmarkType = {
    payload: {
        anime_id: string;
        title: string;
        image?: string;
        type?: string;
        anime_status?: string;
    };
};

const AddBookmarkButton = ({ payload }: AddToBookmarkType) => {
    const [open, setOpen] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const anchorRef = useRef<HTMLButtonElement>(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const [addBookmark] = useAddBookmarkMutation();
    const {
        data: bookmarkChecker,
        refetch: refetchChecker,
        isError: isCheckerError,
    } = useIsBookmarkedQuery({
        anime_id: payload.anime_id,
    });

    const bookmarks_icon: Record<BookmarkStatus, JSX.Element> = {
        watching: <VisibilityIcon />,
        completed: <CheckCircleIcon />,
        "on-hold": <PauseCircleIcon />,
        dropped: <CancelIcon />,
        "plan-to-watch": <ScheduleIcon />,
        ongoing: <LiveTvIcon />,
    };

    const statusLabel =
        !isCheckerError &&
        bookmarkChecker?.success &&
        bookmarkChecker.isBookmarked &&
        bookmarkChecker.info?.bookmark_status
            ? bookmark_type[bookmarkChecker.info.bookmark_status as BookmarkStatus]
            : "Add to List";

    const handleAddBookmark = async (bookmark_status: string) => {
        const cleanedPayload = cleanPayload(payload);
        setOpen(false);

        const bookmarkPayload = {
            ...cleanedPayload,
            bookmark_status,
        };

        const toastId = toast.loading("Adding to bookmark.");
        try {
            const res = await addBookmark(bookmarkPayload).unwrap();
            if (res.success) {
                toast.success(`${res.message}`, { id: toastId });
                refetchChecker();
                setOpen(false);
            }
        } catch (error: unknown) {
            const err = error as FetchBaseQueryError;
            if (err.status === 401) {
                toast.error("Please log in to add bookmark.", { id: toastId });
                console.error("Not authenticated.");
                setIsModalOpen(true);
            } else {
                toast.error("Failed to add bookmark.", { id: toastId });
            }
        }
    };

    const handleClose = (event: Event | SyntheticEvent) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        )
            return;
        setOpen(false);
    };

    const handleListKeyDown = (event: KeyboardEvent<HTMLUListElement> | undefined) => {
        if (!event) return;

        if (event.key === "Tab") {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === "Escape") {
            setOpen(false);
        }
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current!.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <div>
            <button
                ref={anchorRef}
                onClick={handleToggle}
                className={`${
                    !isCheckerError && bookmarkChecker?.isBookmarked
                        ? "bg-primary-accent text-background hover:bg-primary-accent/80"
                        : "bg-main text-background hover:bg-main/80"
                }  px-4 py-2 rounded-full flex items-center justify-center gap-1 cursor-pointer w-full`}
            >
                {!isCheckerError && bookmarkChecker?.isBookmarked ? (
                    bookmarks_icon[bookmarkChecker.info?.bookmark_status as BookmarkStatus]
                ) : (
                    <AddIcon />
                )}
                {statusLabel}
            </button>
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                placement="bottom-start"
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === "bottom-start" ? "left top" : "left bottom" }}
                    >
                        <Paper style={{ width: anchorRef.current?.offsetWidth }}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList
                                    autoFocusItem={open}
                                    id="composition-menu"
                                    aria-labelledby="composition-button"
                                    onKeyDown={handleListKeyDown}
                                    className="my-1 w-full py-0 overflow-hidden rounded-sm"
                                >
                                    {Object.entries(bookmark_type).map(
                                        ([key, label]) => (
                                            <MenuItem
                                                key={key}
                                                onClick={() => {
                                                    handleAddBookmark(key)
                                                }}
                                                className={`${!isCheckerError && bookmarkChecker?.info?.bookmark_status === key ? "bg-primary-accent text-main" : ""}`}
                                            >
                                                {label}
                                            </MenuItem>
                                        )
                                    )}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
            <AuthModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default AddBookmarkButton;
