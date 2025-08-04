import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseUrl from "../utils/constants/baseApiUrl";
import type { BookmarkedItem } from "../utils/types/anime.type";

type BookmarkCheckerType = {
    success: boolean;
    isBookmarked: boolean;
    info?: BookmarkedItem;
};

export const bookmarkService = createApi({
    reducerPath: "bookmarks-service",
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseUrl}/api/bookmarks/`,
        credentials: "include",
    }),
    endpoints: (builder) => ({
        addBookmark: builder.mutation<
            Record<string, unknown>,
            Record<string, unknown>
        >({
            query: (data) => ({
                url: "/",
                method: "POST",
                body: data,
            }),
        }),
        getBookmarkList: builder.query<
            unknown,
            { page: number; status: string; sort: string; order: string }
        >({
            query: ({ page, status, sort, order }) =>
                `?page=${page}&status=${status}&sort=${sort}&order=${order}`,
        }),
        isBookmarked: builder.query<BookmarkCheckerType, { anime_id: string }>({
            query: ({ anime_id }) => `/${anime_id}`,
        }),
    }),
});

export const {
    useAddBookmarkMutation,
    useGetBookmarkListQuery,
    useIsBookmarkedQuery,
} = bookmarkService;
