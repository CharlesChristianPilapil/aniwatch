import MessageIcon from '@mui/icons-material/Message';
import PostEpisodeComment from './PostEpisodeComment';
import { type CommentType, useAddCommentMutation, useGetCommentsQuery } from '../../../services/commentService';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import GroupsIcon from '@mui/icons-material/Groups';
import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import useWebSocket from '../../../hooks/useWebSocket';
import type { EpisodeCommentMessageType } from '../../../utils/types/websockets/episode-comment.socket.type';
import type { SocketListenerType } from '../../../utils/types/websockets/socket.type';
import CommentTab from './CommentTab';

const EpisodeCommentSection = () => {
    const { addSocketListener } = useWebSocket();

    const { episodeId } = useParams();
    const lastEpisodeId = useRef(episodeId);

    const [page, setPage] = useState(1);

    // socket state
    const [typing, setTyping] = useState(false);
    const [viewerCount, setViewerCount] = useState(0);
    
    if (lastEpisodeId.current !== episodeId) {
        lastEpisodeId.current = episodeId;
        if (page !== 1) setPage(1);
    }

    const { data, refetch, isLoading, isFetching } = useGetCommentsQuery({ entity_id: episodeId!, entity_type: "anime_episode", page });
    const [, addCommentMutationMethod] = useAddCommentMutation();
    
    const hasNextPage = data?.hasNextPage && !isLoading;

    const [allComments, setAllComments] = useState<CommentType[]>([]);
    const isCommentsEmpty = allComments.length === 0 && !isLoading;

    useEffect(() => {
        if (!data?.results) return;
        setAllComments((prevVal) => {
            if (page === 1) {
                return data.results;
            }
            const newComments = [...prevVal, ...data.results];
            const unique = Array.from(new Map(newComments.map(c => [c.id, c])).values());
            return unique;
        });
    }, [data, page]);

    useEffect(() => {
        refetch();
    }, [episodeId, refetch]);

    useEffect(() => {
        const unsubscribe = addSocketListener<EpisodeCommentMessageType>((data) => {
            if (episodeId === data.channel && data.type === "anime_episode_comment") {
                if (data.action === "typing") {
                    setTyping(data?.payload?.isTyping);
                }

                if (data.action === "post_comment") {
                    setAllComments((prevVal) => {
                        const newComments = [data.payload, ...prevVal];
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
            <div className="bg-main/25 rounded px-4 py-8 space-y-4">
                <div className='flex justify-between items-center'>
                    <div className='flex items-center gap-2'>
                        <MessageIcon />
                        <p> 0 Comments </p>
                    </div>
                    <button> Sort </button>
                </div>
                <PostEpisodeComment />
                {isLoading && <p> Loading... </p>}
                {isCommentsEmpty && <p> No comments yet. </p>}
                <ul className='space-y-8'>
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
                        <CommentTab key={data.id} {...data} />
                    ))}
                </ul>
                {hasNextPage && (
                    <button 
                        disabled={isFetching}
                        onClick={() => setPage(prev => prev + 1)}
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