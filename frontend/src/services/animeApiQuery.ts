import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { AnimeEpisodeType, AnimeInfoType, AnimeListResponseType, GenreListType } from "../utils/types/anime.type";

export const animeApiQuery = createApi({
    reducerPath: "anime-api",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8000/api/anime",
    }),
    endpoints: (builder) => ({
        getTopAiring: builder.query<AnimeListResponseType, { page: number }>({
            query: ({ page = 1 }) => `/top-airing?page=${page}`,
        }),
        getRecentlyAdded: builder.query<AnimeListResponseType, { page: number }>({
            query: ({ page = 1 }) => `/recently-added?page=${page}`,
        }),
        getRecentEpisodes: builder.query<AnimeListResponseType, { page: number }>({
            query: ({ page = 1 }) => `/recent-episodes?page=${page}`,
        }),
        getMostPopular: builder.query<AnimeListResponseType, { page: number }>({
            query: ({ page = 1 }) => `/most-popular?page=${page}`,
        }),
        getMovies: builder.query<AnimeListResponseType, { page: number }>({
            query: ({ page = 1 }) => `/movies?page=${page}`,
        }),
        getOna: builder.query<AnimeListResponseType, { page: number }>({
            query: ({ page = 1 }) => `/ona?page=${page}`,
        }),
        getOva: builder.query<AnimeListResponseType, { page: number }>({
            query: ({ page = 1 }) => `/ova?page=${page}`,
        }),
        getSpecials: builder.query<AnimeListResponseType, { page: number }>({
            query: ({ page = 1 }) => `/specials?page=${page}`,
        }),
        getTv: builder.query<AnimeListResponseType, { page: number }>({
            query: ({ page = 1 }) => `/tv?page=${page}`,
        }),
        getAnimeInfo: builder.query<AnimeInfoType, { id: string }>({
            query: ({ id }) => `/info/${id}`,
        }),
        getAnimeEpisode: builder.query<AnimeEpisodeType, { id: string }>({
            query: ({ id }) => `/watch/${id}`,
        }),
        getGenreList: builder.query<GenreListType, void>({
            query: () => `/genre/list`,
        }),
        getListByGenre: builder.query<AnimeListResponseType, { genre: string, page: number }>({
            query: ({ genre, page }) => `/genre/${genre}?page=${page}`,
        }),
        getListByQuery: builder.query<AnimeListResponseType, { query: string, page: number }>({
            query: ({ query, page }) => `/${query}?page=${page}`,
        }),
    }),
})

export const { 
    useGetTopAiringQuery,
    useGetRecentlyAddedQuery,
    useGetRecentEpisodesQuery,
    useGetMostPopularQuery,
    useGetMoviesQuery,
    useGetOnaQuery,
    useGetOvaQuery,
    useGetSpecialsQuery,
    useGetTvQuery,
    useGetAnimeInfoQuery,
    useGetAnimeEpisodeQuery,
    useGetGenreListQuery,
    useGetListByGenreQuery,
    useGetListByQueryQuery,
} = animeApiQuery;