import { useParams } from "react-router-dom";
import { useGetUserInfoQuery } from "../services/userServices";
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { useGetBookmarkListQuery } from "../services/bookmarkService";
import AnimeCard from "../components/AnimeCard";
import Button from "../components/Button";

const ProfilePage = () => {
    const { username } = useParams();
    const { data } = useGetUserInfoQuery({ username: username! });
    const BookmarkList = useGetBookmarkListQuery({ username: username! });

    const user = data?.info;

    const joined = user?.joined ? new Date(user.joined).toLocaleDateString() : "";

    return (
        <main className="container max-w-[1246px] min-height-screen pt-10 pb-5">
            <h2 className="text-center mx-auto text-lg  md:text-4xl lg:text-9xl font-semibold"> Hi!<br/>I'm {username} </h2>
            <div className="flex flex-col lg:flex-row gap-5 mt-10 md:mt-20">
                <div className="flex-1 space-y-10">
                    <div className="flex flex-col items-center sm:flex-row gap-4">
                        <img
                            src={user?.avatar_image ?? "/images/dimple.webp"}
                            alt={`${username} avatar.`}
                            className="rounded-full ring-2 ring-primary-accent/75 p-1 aspect-square max-w-20 max-h-20"
                        />
                        <div className="flex flex-col items-center gap-1 justify-between text-sm sm:items-start">
                            <h2> {user?.name} </h2>
                            <p className="flex items-center outline w-fit rounded p-1 text-secondary-accent">  
                                <HowToRegIcon className="text-lg" />
                                Verified 
                            </p>
                            <p className="opacity-75"> Joined: {joined} </p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h2 className="sub-header"> Watch List </h2>
                        {(BookmarkList.data?.results && !BookmarkList?.isLoading) && (
                            <div className="space-y-2">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                                    {BookmarkList.data?.results.slice(0, 10).map((item) => (
                                        <AnimeCard 
                                            key={item.id} 
                                            {...item} 
                                        />
                                    ))}
                                </div>
                                <Button href={`bookmarks`} className="w-full">
                                    View More
                                </Button>
                            </div>
                        )}
                        {!BookmarkList?.data?.results && (!BookmarkList.isLoading || !BookmarkList.isFetching)  && (
                            <div className="p-12 w-full bg-main/25 rounded-lg text-center">
                                Watch List is not public.
                            </div>
                        )}
                        {/* <div className="p-12 w-full bg-main/25 rounded-lg text-center">
                            Watch List is not public.
                        </div> */}
                    </div>
                </div>
                <div className="w-full lg:w-[400px] lg:border-l lg:border-secondary-accent/25 lg:pl-5 space-y-5">
                    <h2 className="sub-header"> Latest Activities </h2>
                    <p> No activities found. </p>
                </div>
            </div>
        </main>
    );
};

export default ProfilePage;