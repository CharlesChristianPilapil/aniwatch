import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseUrl from "../utils/constants/baseApiUrl";

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        credentials: "include",
    }),
    tagTypes: ["bookmarkList", "isAnimeBookmarked"],
    endpoints:() => ({}),
});