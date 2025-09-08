import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Services / store / types
import type { EpisodeCommentMessageType } from '../../../utils/types/websockets/episode-comment.socket.type';
import type { SocketListenerType } from '../../../utils/types/websockets/socket.type';
import { type CommentType, useAddCommentMutation, useGetCommentsInfiniteQuery } from '../../../services/commentService';
import useWebSocket from '../../../hooks/useWebSocket';

// Components
import EpisodeCommentWrapper from './CommentWrapper';

// MUI
import MessageIcon from '@mui/icons-material/Message';
import PostEpisodeComment from './PostEpisodeComment';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import GroupsIcon from '@mui/icons-material/Groups';
import { Skeleton } from '@mui/material';

const EpisodeCommentSection = () => {
    const { addSocketListener } = useWebSocket();

    const { episodeId } = useParams();

    // socket state
    const [typing, setTyping] = useState(false);
    const [viewerCount, setViewerCount] = useState(0);

    const { data, hasNextPage, isLoading, fetchNextPage, isFetchingNextPage } = useGetCommentsInfiniteQuery({ entity_id: episodeId!, entity_type: "anime_episode" });
    const [, addCommentMutationMethod] = useAddCommentMutation();
    
    const lastPage = data?.pages.at(-1);
    const totalCount = lastPage?.totalCount;
    
    const enableViewMore = hasNextPage && !isLoading;

    const [allComments, setAllComments] = useState<CommentType[] | undefined>([]);
    const isCommentsEmpty = allComments?.length === 0 && !isLoading;


    useEffect(() => {
        setAllComments([]);
    }, [episodeId]);

    useEffect(() => {
        const allReplies = data?.pages.flatMap(page => page.results ?? []);
        if (!allReplies) return;
      
        setAllComments(prevVal => {
            const combined = [...(prevVal ?? []), ...allReplies];
            const unique = Array.from(new Map([...combined].map(reply => [reply.id, reply])).values());
            return unique;
        });
    }, [data?.pages]);

    useEffect(() => {
        const unsubscribe = addSocketListener<EpisodeCommentMessageType>((data) => {
            if (episodeId === data.channel && data.type === "anime_episode_comment") {
                if (data.action === "typing") {
                    setTyping(data?.payload?.isTyping);
                }

                if (data.action === "post_comment") {
                    setAllComments((prevVal) => {
                        const newComments = [data.payload, ...(prevVal ?? [])];
                        const unique = Array.from(new Map(newComments.map(c => [c.id, c])).values());
                        return unique;
                    });
                }
            };
        });

        return unsubscribe;
    }, [episodeId, addSocketListener]);

    useEffect(() => {
        const unsubscribe = addSocketListener<SocketListenerType<{ count: number }>>((data) => {
            if (episodeId === data.channel && data.type === "join") {
                if (data.action === "watching") setViewerCount(data.payload.count);
            }
        });
      
        return unsubscribe;
    }, [episodeId, addSocketListener]);

    return (
        <div>
            <div className='flex items-center justify-between mb-4'>
                <h2 className="sub-header mb-0"> Comments </h2>
                <div className='text-red-400 flex items-center gap-2'>
                    {viewerCount}
                    <GroupsIcon />
                </div>
            </div>
            <div className="bg-card rounded px-4 py-8 space-y-4">
                <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-2'>
                        <MessageIcon />
                        <p> {totalCount || 0} Comments </p>
                    </div>
                    <button> Sort </button>
                </div>
                {!isLoading && <PostEpisodeComment />}
                {isLoading && <Skeleton height={300} />}
                {isCommentsEmpty && <p> No comments yet. </p>}
                <ul className='space-y-5'>
                    {(typing || addCommentMutationMethod.isLoading) && (
                        <li className='flex gap-4'>
                            <img 
                                src={"/images/avatar.jpg"}
                                alt={`avatar image.`} 
                                className='h-10 w-10 object-cover rounded-full'
                            /> 
                            <div className='space-y-2 flex-1'>
                                <h3 className='font-semibold'> Anonymous User </h3>
                                <p className='text-main/75'> Typing... </p>
                            </div>
                        </li>
                    )}
                    {allComments?.map((data) => (
                        <EpisodeCommentWrapper key={data.id} {...data} />
                    ))}
                </ul>
                {enableViewMore && allComments && ((totalCount ?? 0) >= allComments?.length) && (
                    <button 
                        disabled={isFetchingNextPage}
                        onClick={() => fetchNextPage()}
                        className='
                            flex items-center gap-1 w-fit text-primary-accent/75 disabled:opacity-50 
                            hover:text-primary-accent focus:text-primary-accent active:text-primary-accent cursor-pointer
                        '
                    > 
                        <ArrowDropDownIcon />
                        View More
                    </button>
                )}
            </div>
        </div>
    );
};

export default EpisodeCommentSection;