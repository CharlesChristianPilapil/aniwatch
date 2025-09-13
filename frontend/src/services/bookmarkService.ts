import type { AnimeListResponseType, BookmarkedItem } from "../utils/types/anime.type";
import { api } from "./baseApiService";

type BookmarkCheckerType = {
    success: boolean;
    isBookmarked: boolean;
    info?: BookmarkedItem;
};

export const bookmarkService = api.injectEndpoints({
    endpoints: (builder) => ({
        addBookmark: builder.mutation<
            Record<string, unknown>,
            Record<string, unknown>
        >({
            query: (data) => ({
                url: "/api/bookmarks",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["isAnimeBookmarked", "bookmarkList"]
        }),
        getBookmarkList: builder.query<
            AnimeListResponseType,
            { username?: string, page?: number; status?: string; sort?: string; order?: string }
        >({
            query: ({ username = "", page = "", status = "", sort = "", order = "" }) => `/api/bookmarks?username=${username}&status=${status}&sort=${sort}&order=${order}&page=${page}`,
            providesTags: ["bookmarkList"],
        }),
        isBookmarked: builder.query<BookmarkCheckerType, { anime_id: string }>({
            query: ({ anime_id }) => `/api/bookmarks/${anime_id}`,
            providesTags: ["isAnimeBookmarked"],
        }),
    }),
});

export const {
    useAddBookmarkMutation,
    useGetBookmarkListQuery,
    useIsBookmarkedQuery,
} = bookmarkService;