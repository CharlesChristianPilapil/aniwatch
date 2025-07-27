import express from 'express';
import { 
    getAnimeInfo,
    getGenreList,
    getListByGenre,
    getListByQuery,
    getMostPopularList,
    getMoviesList,
    getOnaList,
    getOvaList,
    getRecentEpisodesList,
    getRecentlyAddedList, 
    getSpecialsList, 
    getTopAiringList, 
    getTVList, 
    watchAnime
} from '../controllers/anime.controller.js';

const router = express.Router();

router.get('/top-airing', getTopAiringList);
router.get('/recently-added', getRecentlyAddedList);
router.get('/recent-episodes', getRecentEpisodesList);
router.get('/most-popular', getMostPopularList);
router.get('/movies', getMoviesList);
router.get('/ona', getOnaList);
router.get('/ova', getOvaList);
router.get('/specials', getSpecialsList);
router.get('/tv', getTVList);

router.get('/info/:id', getAnimeInfo);
router.get('/watch/:id', watchAnime);

router.get('/genre/list', getGenreList);
router.get('/genre/:genre', getListByGenre);

router.get('/:query', getListByQuery);

export default router;