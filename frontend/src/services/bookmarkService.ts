import type { BookmarkedItem } from "../utils/types/anime.type";
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
                url: "/api/bookmarks/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["isAnimeBookmarked"]
        }),
        getBookmarkList: builder.query<
            unknown,
            { page: number; status: string; sort: string; order: string }
        >({
            query: ({ page, status, sort, order }) => `/api/bookmarks/?page=${page}&status=${status}&sort=${sort}&order=${order}`,
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
