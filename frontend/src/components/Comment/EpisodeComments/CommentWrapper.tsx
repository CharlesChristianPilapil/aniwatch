import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

// Services / store / types
import { useAddCommentMutation, useGetRepliesInfiniteQuery, type CommentType } from "../../../services/commentService";
import type { RootState } from "../../../store";

// components
import TextArea from "../../TextArea";

// MUI
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';

// utils
import { CommentFormSchema, type CommentFormData } from "../../../utils/schema/comment.schema";
import CommentTab from "../CommentTab";
import useWebSocket from "../../../hooks/useWebSocket";
import type { EpisodeCommentMessageType } from "../../../utils/types/websockets/episode-comment.socket.type";

const EpisodeCommentWrapper = (props: CommentType) => {

    const { episodeId } = useParams();
    const { sendMessage, addSocketListener } = useWebSocket();

    const userInfo = useSelector((state: RootState) => state.auth.userInfo);
    const { replies_count } = props;

    const [replyTo, setReplyTo] = useState<string>("");
    const [replyForm, setReplyForm] = useState<boolean>(false);
    const [viewReplies, setViewReplies] = useState<boolean>(false);
    const [replies, setReplies] = useState<CommentType[] | undefined>([]);
    
    const { data: infiniteReplies, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useGetRepliesInfiniteQuery(
        { entity_id: episodeId!, entity_type: "anime_episode", parent_comment_id: props.id }, 
        { skip: !viewReplies },
    );

    const lastPage = infiniteReplies?.pages.at(-1);
    const totalCount = lastPage?.totalCount;

    const [addCommentMutation, addCommentMutationMethod] = useAddCommentMutation();

    const { register, handleSubmit, reset, formState: { isDirty }, setValue, getValues } = useForm({
        resolver: zodResolver(CommentFormSchema),
        defaultValues: {
            content: "",
            entity_id: episodeId,
            entity_type: "anime_episode",
            parent_comment_id: props.id,
            reply_to_comment_id: null,
        }
    });

    const handleViewMore = () => {
        fetchNextPage();
    }

    const formRef = useRef<HTMLFormElement | null>(null);

    const handleSetFormStatus = (replyingTo: string, showForm: boolean, replyToCommentId: number | null) => {
        setReplyTo(replyingTo);
        setReplyForm(showForm);
        setValue("reply_to_comment_id", replyToCommentId);

        if (showForm) {
            setTimeout(() => {
                formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 0);
        }
    }

    const handlePostReply = async (data: CommentFormData) => {
        const toastId = toast.loading("Posting your reply...");

        const replyHeader = `<span>reply to <a href='/user/${replyTo}' target="_blank">@${replyTo}</a></span>`;
        const content = replyTo === userInfo?.username ? getValues("content") : `${replyHeader}\n\n${getValues("content")}`;

        const payload: CommentFormData = {
            ...data,
            content: content,
        }

        try {
            const res = await addCommentMutation(payload).unwrap();
            if (res.success) {
                                
                sendMessage({
                    type: "anime_episode_comment",
                    action: "post_reply",
                    channel: episodeId,
                    payload: res.info,
                });

                reset();
                setReplyTo("")
                setReplyForm(false);
                toast.success("Reply posted!", { id: toastId });
            }
        } catch (error) {
            toast.error("Failed to post reply.", { id: toastId });
            console.error(error);
        }
    }

    useEffect(() => {
        const allReplies = infiniteReplies?.pages.flatMap(page => page.results ?? []);
        setReplies(prevVal => {
            const combined = [...(allReplies ?? []), ...(prevVal ?? [])];          
            const unique = Array.from(new Map(combined.map(reply => [reply.id, reply])).values());
          
            return unique;
        });
    }, [infiniteReplies?.pages]);

    const liRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            const path = (event).composedPath?.() as Node[] | undefined;
            const clickedInside = path
                ? !!path.find((n) => n === liRef.current)
                : (liRef.current && liRef.current.contains(event.target as Node));
        
            if (!clickedInside) {
                reset();
                setReplyTo("");
                setReplyForm(false);
            }
        };
      
        document.addEventListener("click", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
      
        return () => {
            document.removeEventListener("click", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [reset]);

    // socket listener
    useEffect(() => {
        const unsubscribe = addSocketListener<EpisodeCommentMessageType>((data) => {
            if (episodeId === data.channel && data.type === "anime_episode_comment") {
                if (data.action === "post_reply") {
                    if (props.id !== data.payload.parent_comment_id) return;
                    if (!viewReplies) setViewReplies(true);
                    setReplies(prevVal => [...(prevVal ?? []), data.payload]);
                }
            };
        });

        return unsubscribe;
    }, [episodeId, addSocketListener, viewReplies, props.id]);

    return (
        <li ref={liRef}>
            <CommentTab 
                {...props}
                onClickReply={(payload) => {
                    const { commentId, username } = payload;
                    const reply_to_comment_id = getValues("reply_to_comment_id");   

                    if (commentId === reply_to_comment_id) {
                        handleSetFormStatus("", false, null);
                        reset();
                        return;
                    }

                    handleSetFormStatus(username, true, commentId);
                }}
                replies={(
                    <div className="flex flex-col gap-4">
                        <button 
                            onClick={async () => {
                                setViewReplies(prevVal => !prevVal)
                            }} 
                            disabled={isLoading}
                            data-hide-button={replies_count && replies_count > 0 || replies?.length && replies?.length > 0 ? "false" : "true"}
                            className="w-fit data-[hide-button=true]:hidden cursor-pointer flex items-center px-3 py-2 rounded-full hover:bg-main/10 disabled:opacity-50"
                        >
                            {viewReplies ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                            {viewReplies ? "Hide replies"  : "Show replies"}
                        </button>
                        {viewReplies && replies ? (
                            <ul className="space-y-5">
                                {replies.map((reply) => (
                                    <CommentTab 
                                        key={reply.id} 
                                        {...reply} 
                                        onClickReply={(payload) => {
                                            const { commentId, username } = payload;
                                            const reply_to_comment_id = getValues("reply_to_comment_id");   
                        
                                            if (commentId === reply_to_comment_id) {
                                                handleSetFormStatus("", false, null);
                                                reset();
                                                return;
                                            }
                        
                                            handleSetFormStatus(username, true, commentId);
                                        }}
                                    />
                                ))}
                            </ul>
                        ) : null}
                        {replyForm && (
                            <form ref={formRef} onSubmit={handleSubmit(handlePostReply)} className="flex flex-col gap-1">
                                <p className="text-sm opacity-75"> Replying to {userInfo?.username === replyTo ? "yourself" : replyTo} </p>
                                <TextArea 
                                    {...register("content")}
                                    className="bg-background/50 md:min-h-[120px]"
                                    placeholder="write a reply"
                                    shrink
                                />
                                <div className="self-end space-x-2">
                                    <button 
                                        disabled={!isDirty || addCommentMutationMethod.isLoading} 
                                        className="w-fit p-2 border border-main text-sm rounded cursor-pointer disabled:pointer-events-none disabled:opacity-50"
                                        type="button"
                                        onClick={() => {
                                            reset();
                                            setReplyTo("");
                                            setReplyForm(false);
                                        }}
                                    > 
                                        Discard reply
                                    </button>
                                    <button 
                                        disabled={!isDirty || addCommentMutationMethod.isLoading} 
                                        className="w-fit p-2 border border-main text-sm rounded cursor-pointer disabled:pointer-events-none disabled:opacity-50"
                                    > 
                                        Post reply
                                    </button>
                                </div>
                            </form>
                        )}
                        <button
                            disabled={isFetchingNextPage} 
                            onClick={handleViewMore} 
                            data-hide-button={hasNextPage && viewReplies && replies?.length && totalCount && totalCount > replies.length ? "true" : "false"}
                            className="flex items-center cursor-pointer disabled:opacity-50 data-[hide-button=false]:hidden w-fit px-3 py-2 rounded-full hover:bg-main/10"
                        > 
                            <SubdirectoryArrowRightIcon />
                            Show more replies
                        </button>
                    </div>
                )} 
            />
        </li>
    );
};

export default EpisodeCommentWrapper;