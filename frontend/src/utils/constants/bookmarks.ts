import type { BookmarkStatus } from "../types/bookmark.type";

export const bookmark_type: Record<BookmarkStatus, string> = {
    watching: "Watching",
    completed: "Completed",
    "on-hold": "On-hold",
    dropped: "Dropped",
    "plan-to-watch": "To watch",
    ongoing: "Ongoing",
};