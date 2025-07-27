import { ANIME_API } from "../utils/constants.js";

const fetchList = async (endpoint, page) => {
    try {
        const response = await fetch(`${ANIME_API}/${endpoint}?page=${page}`);

        if (!response.ok) {
            throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message || 'Failed to fetch list.');
    }
}

export const getTopAiringList = async (req, res, next) => {
    const page = Math.max(+req.query.page || 1, 1);

    try {
        const data = await fetchList('top-airing', page);
        return res.status(200).json({ success: true, ...data });
    } catch (err) {
        const error = new Error("Something went wrong.");
        return next(error);
    }
};

export const getMostPopularList = async (req, res, next) => {
    const page = Math.max(+req.query.page || 1, 1);

    try {
        const data = await fetchList('most-popular', page);
        return res.status(200).json({ success: true, ...data });
    } catch (err) {
        const error = new Error("Something went wrong.");
        return next(error);
    }
};

export const getRecentlyAddedList = async (req, res, next) => {
    const page = Math.max(+req.query.page || 1, 1);

    try {
        const data = await fetchList('recent-added', page);
        return res.status(200).json({ success: true, ...data });
    } catch (err) {
        const error = new Error("Something went wrong.");
        return next(error);
    }
};

export const getRecentEpisodesList = async (req, res, next) => {
    const page = Math.max(+req.query.page || 1, 1);

    try {
        const data = await fetchList('recent-episodes', page);
        return res.status(200).json({ success: true, ...data });
    } catch (err) {
        const error = new Error("Something went wrong.");
        return next(error);
    }
};

export const getMoviesList = async (req, res, next) => {
    const page = Math.max(+req.query.page || 1, 1);

    try {
        const data = await fetchList('movies', page);
        return res.status(200).json({ success: true, ...data });
    } catch (err) {
        const error = new Error("Something went wrong.");
        return next(error);
    }
};

export const getOnaList = async (req, res, next) => {
    const page = Math.max(+req.query.page || 1, 1);

    try {
        const data = await fetchList('ona', page);
        return res.status(200).json({ success: true, ...data });
    } catch (err) {
        const error = new Error("Something went wrong.");
        return next(error);
    }
};

export const getOvaList = async (req, res, next) => {
    const page = Math.max(+req.query.page || 1, 1);

    try {
        const data = await fetchList('ova', page);
        return res.status(200).json({ success: true, ...data });
    } catch (err) {
        const error = new Error("Something went wrong.");
        return next(error);
    }
};

export const getSpecialsList = async (req, res, next) => {
    const page = Math.max(+req.query.page || 1, 1)

    try {
        const data = await fetchList('specials', page);
        return res.status(200).json({ success: true, ...data });
    } catch (err) {
        const error = new Error("Something went wrong.");
        return next(error);
    }
};

export const getListByGenre = async (req, res, next) => {
    const page = Math.max(+req.query.page || 1, 1);
    const genre = req.params.genre;
    
    try {
        const data = await fetchList(`/genre/${genre}`, page);
        return res.status(200).json({ success: true, ...data });
    } catch (err) {
        const error = new Error("Something went wrong.");
        return next(error);
    }
};

export const getListByQuery = async (req, res, next) => {
    const page = Math.max(+req.query.page || 1, 1);
    const query = req.params.query;
    
    try {
        const data = await fetchList(`/${query}`, page);
        return res.status(200).json({ success: true, ...data });
    } catch (err) {
        const error = new Error("Something went wrong.");
        return next(error);
    }
};

export const getTVList = async (req, res, next) => {
    const page = Math.max(+req.query.page || 1, 1)

    try {
        const data = await fetchList('tv', page);
        return res.status(200).json({ success: true, ...data });
    } catch (err) {
        const error = new Error("Something went wrong.");
        return next(error);
    }
};

export const getGenreList = async (req, res, next) => {
    try {
        const response = await fetch(`${ANIME_API}/genre/list`);
        const data = await response.json();
        return res.status(200).json({ success: true, genres: [...data] });
    } catch (err) {
        const error = new Error("Failed to get anime info.");
        return next(error);
    }
}

export const getAnimeInfo = async (req, res, next) => {
    const animeId = req.params.id;

    try {
        const response = await fetch(`${ANIME_API}/info?id=${animeId}`);
        const data = await response.json();
        
        if (!data || !data.title) {
            const error = new Error("Failed to get anime info.");
            error.status = 404;
            return next(error);
        }

        return res.status(200).json({ success: true, ...data });
    } catch (err) {
        const error = new Error("Failed to get anime info.");
        return next(error);
    }
}

export const watchAnime = async (req, res, next) => {
    const episodeId = req.params.id;

    try {
        const response = await fetch(`${ANIME_API}/watch/${episodeId}`);
        const data = await response.json();

        if (!data.headers.Referer) {
            const error = new Error("Failed to get episode.");
            error.status = 404;
            return next(error);
        }

        const embedResponse = await fetch(data.headers.Referer, {
            headers: {
                Referer: data.headers.Referer,
            }
        });

        const embedHtml = await embedResponse.text();

        return res.status(200).json({ 
            success: true, 
            embedHtml, 
            ...data
        });
    } catch (err) {
        const error = new Error("Something went wrong.");
        return next(error);
    }
}