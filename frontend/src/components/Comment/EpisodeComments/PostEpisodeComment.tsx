import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

// Services / store / types
import type { RootState } from "../../../store";
import useWebSocket from "../../../hooks/useWebSocket";
import { CommentFormSchema, type CommentFormData } from "../../../utils/schema/comment.schema";
import { useAddCommentMutation } from "../../../services/commentService";

// Components
import TextArea from "../../TextArea";
import AuthModal from "../../Modal/AuthModal";

const PostEpisodeComment = () => {
    const { episodeId } = useParams();
    const { sendMessage } = useWebSocket();

    const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

    const userInfo = useSelector((state: RootState) => state.auth.userInfo);
    const [addCommentMutation, addCommentMutationMethod] = useAddCommentMutation();

    const { register, reset, handleSubmit, formState: { isDirty } } = useForm<CommentFormData>({
        resolver: zodResolver(CommentFormSchema),
        defaultValues: {
            entity_id: episodeId,
            entity_type: "anime_episode",
            parent_comment_id: null,
            reply_to_comment_id: null,
            content: ""
        }
    });

    const handleAddComment = async (data: CommentFormData) => {
        const payload: CommentFormData = {
            ...data,
            entity_id: episodeId!,
        }
        const toastId = toast.loading("Posting your comment...");
        try {
            const res = await addCommentMutation(payload).unwrap();
            if (res.success) {
                sendMessage({
                    type: "anime_episode_comment",
                    action: "post_comment",
                    channel: episodeId,
                    payload: res.info,
                });
                toast.success("Comment posted!", { id: toastId });
                reset();
            }
        } catch (error) {
            toast.error("Failed to post comment.", { id: toastId });
            console.error(error);
        }
    }

    const handleTyping = (isTyping: boolean) => {
        sendMessage({
            type: "anime_episode_comment",
            action: "typing",
            channel: episodeId,
            payload: {
                isTyping,
                message: "Someone is typing...",
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(handleAddComment)} className='flex gap-4'>
            <Link to={`/user/${userInfo?.username}`} target='_blank' className={`h-fit ${!userInfo ? "pointer-events-none" : ""}`}>
                <img 
                    src={userInfo?.avatar_image || "/images/avatar.jpg"}
                    alt={`${userInfo?.username || ""} avatar image.`} 
                    className='h-8 w-8 sm:w-10 sm:h-10 object-cover rounded-full'
                />
            </Link> 
            <div className='w-full space-y-4 flex-1'>
                {userInfo ? (
                    <h3 className='font-semibold'>
                        <Link to={`/user/${userInfo.username}`} target='_blank' className='hover:underline'>
                            {userInfo.username} 
                        </Link> 
                    </h3>
                ) : (
                    <>
                        <p className='text-sm'> 
                            You must
                            {' '} 
                            <button onClick={() => setShowAuthModal(true)} className='text-primary-accent/75 hover:text-primary-accent focus:text-primary-accent cursor-pointer'> 
                                login 
                            </button>
                            {' '}
                            to post a comment 
                        </p>
                        <AuthModal 
                            isOpen={showAuthModal} 
                            onClose={() => setShowAuthModal(false)}
                        />
                    </>
                )}
                <div className="flex flex-col gap-4">
                    <TextArea 
                        shrink
                        {...register("content")}
                        className='bg-background/50 min-h-[120px]'
                        placeholder='add a comment'
                        onFocus={() => handleTyping(true)}
                        onBlur={() => handleTyping(false)}
                        disabled={!userInfo} 
                    />
                    <button 
                        disabled={!isDirty || addCommentMutationMethod.isLoading}
                        className="self-end border p-2 rounded border-main/50 text-sm cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                    > 
                        Post comment 
                    </button>
                </div>
            </div>
        </form>
    );
};

export default PostEpisodeComment;