import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layout/RootLayout";
import ProtectedLayout from "../layout/ProtectedLayout";
import UserLayout from "../layout/UserLayout";
import { 
    HomeLazy, 
    TopAiringLazy, 
    MostPopularLazy, 
    RecentlyAddedLazy, 
    RecentEpisodesLazy, 
    TvSeriesLazy, 
    OnaLazy, 
    OvaLazy, 
    SpecialsLazy, 
    MoviesLazy, 
    WatchEpisodeLazy, 
    GenreLazy, 
    QueryLazy, 
    ErrorLazy, 
    ProfileLazy, 
    BookmarksLazy, 
    SettingsPageLazy, 
    AnimeInfoLazy 
} from "./LazyPages";
import Fallback from "../pages/Fallback.page";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement: <Fallback />,
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
            { path: "/info/:id", element: <AnimeInfoLazy /> },
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
                children: [
                    { path: "/settings",  element: <SettingsPageLazy />}
                ]
            }
        ],
    },
]);