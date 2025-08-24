import { lazy } from "react";

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
const AnimeInfoLazy = lazy(() => import("../pages/AnimeInfo.page"));
const WatchEpisodeLazy = lazy(() => import("../pages/Watch.page"));
const GenreLazy = lazy(() => import("../pages/GenreList.page"));
const QueryLazy = lazy(() => import("../pages/SearchAnime.page"));
const ErrorLazy = lazy(() => import("../pages/ErrorPage"));
const ProfileLazy = lazy(() => import("../pages/Profile.page"));
const BookmarksLazy = lazy(() => import("../pages/Bookmarks.page"));
const SettingsPageLazy = lazy(() => import("../pages/Settings.page"));

export {
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
    AnimeInfoLazy,
    WatchEpisodeLazy,
    GenreLazy,
    QueryLazy,
    ErrorLazy,
    ProfileLazy,
    BookmarksLazy,
    SettingsPageLazy,
};