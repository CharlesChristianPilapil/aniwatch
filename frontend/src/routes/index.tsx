import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import RootLayout from "../layout/RootLayout";
import TopAiringPage from "../pages/TopAiring.page";
import MostPopularPage from "../pages/MostPopular.page";
import RecentlyAddedPage from "../pages/RecentlyAdded.page";
import TvSeriesPage from "../pages/TvSeries.page";
import ONAsPage from "../pages/ONA.page";
import OVAsPage from "../pages/OVA.page";
import SpecialsPage from "../pages/Specials.page";
import MoviesPage from "../pages/Movies.page";
import AnimeInfoPage from "../pages/AnimeInfo.page";
import ErrorPage from "../pages/ErrorPage";
import RecentEpisodesPage from "../pages/RecentEpisodes.page";
import WatchPage from "../pages/Watch.page";
import GenreListPage from "../pages/GenreList.page";
import SearchAnimePage from "../pages/SearchAnime.page";
import AuthTest from "../pages/AuthTest";


export const router = createBrowserRouter([
    { 
        path: '/', 
        element: <RootLayout />,
        children: [
            { index: true, element: <App /> },
            { path: '/top-airing', element: <TopAiringPage /> },
            { path: '/most-popular', element: <MostPopularPage /> },
            { path: '/recently-added', element: <RecentlyAddedPage /> },
            { path: '/recent-episodes', element: <RecentEpisodesPage /> },
            { path: '/tv', element: <TvSeriesPage /> },
            { path: '/ona', element: <ONAsPage /> },
            { path: '/ova', element: <OVAsPage /> },
            { path: '/specials', element: <SpecialsPage /> },
            { path: '/movies', element: <MoviesPage /> },
            { path: '/info/:id', element: <AnimeInfoPage /> },
            { path: '/watch/:episodeId', element: <WatchPage /> },
            { path: '/genre/:genre', element: <GenreListPage /> },
            { path: '/search/:query', element: <SearchAnimePage /> },
            { path: '/auth', element: <AuthTest /> },
            { path: '*', element: <ErrorPage /> }
        ] 
    },
]);