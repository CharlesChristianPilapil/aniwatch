import type {
    AnimeEpisodeType,
    AnimeInfoType,
    AnimeListResponseType,
    GenreListType,
} from "../utils/types/anime.type";
import { api } from "./baseApiService";

export const animeApiQuery = api.injectEndpoints({
    endpoints: (builder) => ({
        getTopAiring: builder.query<AnimeListResponseType, { page: number }>({
            query: ({ page = 1 }) => `/api/anime/top-airing?page=${page}`,
        }),
        getRecentlyAdded: builder.query<
            AnimeListResponseType,
            { page: number }
        >({
            query: ({ page = 1 }) => `/api/anime/recently-added?page=${page}`,
        }),
        getRecentEpisodes: builder.query<
            AnimeListResponseType,
            { page: number }
        >({
            query: ({ page = 1 }) => `/api/anime/recent-episodes?page=${page}`,
        }),
        getMostPopular: builder.query<AnimeListResponseType, { page: number }>({
            query: ({ page = 1 }) => `/api/anime/most-popular?page=${page}`,
        }),
        getMovies: builder.query<AnimeListResponseType, { page: number }>({
            query: ({ page = 1 }) => `/api/anime/movies?page=${page}`,
        }),
        getOna: builder.query<AnimeListResponseType, { page: number }>({
            query: ({ page = 1 }) => `/api/anime/ona?page=${page}`,
        }),
        getOva: builder.query<AnimeListResponseType, { page: number }>({
            query: ({ page = 1 }) => `/api/anime/ova?page=${page}`,
        }),
        getSpecials: builder.query<AnimeListResponseType, { page: number }>({
            query: ({ page = 1 }) => `/api/anime/specials?page=${page}`,
        }),
        getTv: builder.query<AnimeListResponseType, { page: number }>({
            query: ({ page = 1 }) => `/api/anime/tv?page=${page}`,
        }),
        getAnimeInfo: builder.query<AnimeInfoType, { id: string }>({
            query: ({ id }) => `/api/anime/info/${id}`,
        }),
        getAnimeEpisode: builder.query<AnimeEpisodeType, { id: string }>({
            query: ({ id }) => `/api/anime/watch/${id}`,
        }),
        getGenreList: builder.query<GenreListType, void>({
            query: () => `/api/anime/genre/list`,
        }),
        getListByGenre: builder.query<
            AnimeListResponseType,
            { genre: string; page: number }
        >({
            query: ({ genre, page }) => `/api/anime/genre/${genre}?page=${page}`,
        }),
        getListByQuery: builder.query<
            AnimeListResponseType,
            { query: string; page: number }
        >({
            query: ({ query, page }) => `/api/anime/${query}?page=${page}`,
        }),
    }),
});

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
