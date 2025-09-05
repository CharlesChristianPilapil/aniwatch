import { Link } from "react-router-dom";
import type { CommentType } from "../../../services/commentService"
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ReplyIcon from '@mui/icons-material/Reply';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const CommentTab = (props: CommentType) => {
    const { username, avatar_image, created_at, updated_at, content } = props;

    const formatDate = (data: string) => {
        return new Date(data).toLocaleString("en-US", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }) || "";
    };

    return (
        <li key={props?.id} className='flex gap-4'>
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
                        <Link to={`/user/${username}`} target="_blank">
                            {username} 
                        </Link>        
                    </h3>
                    <p className='text-xs opacity-50'> 
                        {formatDate(updated_at > created_at ? updated_at : created_at)}
                    </p>
                </div>
                <p className='text-main/75'> {content} </p>
                <div className="flex gap-4 text-xs sm:text-sm">  
                    <div className="flex items-center">
                        <ReplyIcon className="text-sm" />
                        <p> Reply </p>
                    </div>
                    <div className="flex items-center gap-1 ">
                        <ThumbUpIcon className="text-sm" />
                        0
                    </div>
                    <div className="flex items-center gap-1">
                        <ThumbDownIcon className="text-sm" />
                        0
                    </div>
                    <div className="flex items-center">
                        <MoreHorizIcon className="text-sm" />
                        More
                    </div>
                </div>
            </div>
        </li>
    );
};

export default CommentTab;