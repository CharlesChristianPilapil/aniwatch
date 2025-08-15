import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/RootLayout";
import ProtectedLayout from "../layout/ProtectedLayout";
import UserLayout from "../layout/UserLayout";

const HomeLazy = lazy(() => import("../App")); 
const TopAiringLazy = lazy(() => import("../pages/TopAiring.page")); 
const MostPopularLazy = lazy(() => import("../pages/MostPopular.page"));
const RecentlyAddedLazy = lazy(() => import("../pages/RecentlyAdded.page"));
const RecentEpisodesLazy = lazy(() => import("../pages/RecentEpisodes.page"));
const TvSeriesLazy = lazy(() => import("../pages/TvSeries.page"));
const OnaLazy = lazy(() => import("../pages/ONA.page"));
const OvaLazy = lazy(() => import("../pages/OVA.page"));
const SpecialsLazy = lazy(() => import("../pages/Specials.page"));
const MoviesLazy = lazy(() => import("../pages/Movies.page"));
const AnimeInfoLazt = lazy(() => import("../pages/AnimeInfo.page"));
const WatchEpisodeLazy = lazy(() => import("../pages/Watch.page"));
const GenreLazy = lazy(() => import("../pages/GenreList.page"));
const QueryLazy = lazy(() => import("../pages/SearchAnime.page"));
const ErrorLazy = lazy(() => import("../pages/ErrorPage"));
const ProfileLazy = lazy(() => import("../pages/Profile.page"));

// Protected
const BookmarksLazy = lazy(() => import("../pages/Bookmarks.page"))

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            { index: true, element: <HomeLazy /> },
            { path: "/top-airing", element: <TopAiringLazy /> },
            { path: "/most-popular", element: <MostPopularLazy /> },
            { path: "/recently-added", element: <RecentlyAddedLazy /> },
            { path: "/recent-episodes", element: <RecentEpisodesLazy /> },
            { path: "/tv", element: <TvSeriesLazy /> },
            { path: "/ona", element: <OnaLazy /> },
            { path: "/ova", element: <OvaLazy /> },
            { path: "/specials", element: <SpecialsLazy /> },
            { path: "/movies", element: <MoviesLazy /> },
            { path: "/info/:id", element: <AnimeInfoLazt /> },
            { path: "/watch/:episodeId", element: <WatchEpisodeLazy /> },
            { path: "/genre/:genre", element: <GenreLazy /> },
            { path: "/search/:query", element: <QueryLazy /> },
            { path: "*", element: <ErrorLazy /> },
            { 
                path: "/user/", 
                element: <UserLayout />, 
                children: [
                    { path: ":username", element: <ProfileLazy /> },
                    { path: ":username/bookmarks", element: <BookmarksLazy /> }
                ] 
            },
            {
                element: <ProtectedLayout />,
                children: []
            }
        ],
    },
]);