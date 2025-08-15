export type AnimeCardType = {
    id: string;
    title: string;
    image: string;
    duration: string;
    type: string;
    nsfw: boolean;
    url?: string;
    watchList?: string;
    japaneseTitle?: string;
    sub?: number;
    dub?: number;
    episodes?: number;
    anime_id?: string;
    anime_status?: string;
    bookmark_status?: string;
};

export type AnimeListResponseType = {
    success: boolean;
    currentPage: number;
    hasNextPage: boolean;
    totalPages: number;
    results: AnimeCardType[];
};

export type AnimeInfoType = {
    success: boolean;
    id: string;
    title: string;
    image: string;
    malID: number;
    alID: string;
    japaneseTitle: string;
    description: string;
    type: string;
    url: string;
    recommendations: AnimeCardType[];
    relatedAnime: {
        id: string;
        title: string;
        image: string;
        japaneseTitle: string;
        type: string;
        sub: number;
        dub: number;
        episodes: number;
    }[];
    subOrDub: string;
    hasSub: boolean;
    hasDub: boolean;
    genres: string[];
    status: string;
    season: string;
    totalEpisodes: number;
    episodes: {
        id: string;
        number: number;
        title: string;
        isFiller: boolean;
        isSubbed: boolean;
        isDubbed: boolean;
        url: string;
    }[];
};

export type GenreListType = {
    success: boolean;
    genres: string[];
};

export type AnimeEpisodeType = {
    headers: {
        Referer: string;
    };
    subtitles: [];
    intro: {
        start: number;
        end: number;
    };
    outro: {
        start: number;
        end: number;
    };
    sources: [];
};

export type AnimeItemType = {
    id: string;
    title: string;
    image?: string;
    sub: number;
    dub: number;
    type: string;
};

export type BookmarkedItem = {
    id: number;
    user_id: number;
    anime_id: string;
    title: string;
    image: string;
    type: string;
    bookmark_status: string;
    anime_status: string;
};
