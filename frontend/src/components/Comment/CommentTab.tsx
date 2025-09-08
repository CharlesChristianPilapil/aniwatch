import { Link } from "react-router-dom";

// Services / store / types
import { useEffect, useState, type ReactNode } from "react";
import type { CommentType } from "../../services/commentService";

// MUI
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ReplyIcon from '@mui/icons-material/Reply';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
    if (seconds < 60) return `New comment.`;
  
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;
  
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;
  
    const years = Math.floor(days / 365);
    return `${years} year${years !== 1 ? "s" : ""} ago`;
};

type CommentContentType = {
    replies?: ReactNode;
    onClickReply?: (payload: { commentId: number; username: string }) => void;
} & CommentType;

const CommentTab = (props: CommentContentType) => {
    const truncateLength = 300;

    const [isTruncated, setIsTruncated] = useState(true);
    const [displayedContent, setDisplayedContent] = useState("");
    
    const { username, avatar_image, updated_at, created_at, content, replies } = props;
    const { onClickReply } = props;

    useEffect(() => {
        if (content.length > truncateLength) {
            setDisplayedContent(isTruncated ? content.slice(0, truncateLength) + "..." : content);
        } else {
            setIsTruncated(false);
            setDisplayedContent(content);
        }
    }, [content, truncateLength, isTruncated]);

    return (
        <div className="flex gap-2">
            <Link to={`/user/${username}`} target="_blank" className='h-fit'>
                <img 
                    src={avatar_image || "/images/avatar.jpg"}
                    alt={`${username || ""} avatar image.`} 
                    className='h-8 w-8 sm:w-10 sm:h-10 object-cover rounded-full'
                />
            </Link>
            <div className='space-y-1 flex-1'>
                <div className='flex items-center gap-2'>
                    <h3 className='font-semibold hover:underline'> 
                        <Link to={`/user/${username}`} target="_blank" className="hover:text-secondary-accent">
                            {username} 
                        </Link>        
                    </h3>
                    <p className='text-xs opacity-50'> 
                        {timeAgo(updated_at > created_at ? updated_at : created_at)}
                    </p>
                </div>
                <div>
                    <p className="text-main/75 whitespace-pre-wrap reply-content" dangerouslySetInnerHTML={{ __html:displayedContent}} />
                    <button 
                        onClick={() => setIsTruncated(prevVal => !prevVal)}
                        className={`text-primary-accent cursor-pointer ${content.length <= truncateLength ? "hidden" : ""}`}
                    >
                        {isTruncated ? "read more" : "show less"}
                    </button>
                </div>
                <div className='flex gap-[10px] text-xs sm:text-sm'>  
                    <button 
                        onClick={() => onClickReply?.({commentId: props.id, username: props.username})}
                        className="flex cursor-pointer hover:text-primary-accent items-center"
                    >
                        <ReplyIcon className="text-sm" />
                        <p> Reply </p>
                    </button>
                    <button className="flex cursor-pointer items-center gap-1 ">
                        <ThumbUpIcon className="text-sm" />
                        0
                    </button>
                    <button className="flex cursor-pointer items-center gap-1">
                        <ThumbDownIcon className="text-sm" />
                        0
                    </button>
                    <button className="flex cursor-pointer items-center">
                        <MoreHorizIcon className="text-sm" />
                        More
                    </button>
                </div>
                {replies}
            </div>
        </div>
    );
};

export default CommentTab;