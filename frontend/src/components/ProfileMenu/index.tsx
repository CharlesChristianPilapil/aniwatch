import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../../services/authService";
import { logout } from "../../slices/authSlice";
import toast from "react-hot-toast";
import { Divider, ListItemIcon, Menu, MenuItem } from "@mui/material";
import { useState, type MouseEvent } from "react";
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import type { CatchErrorType } from "../../utils/types/error.type";import type { RootState } from "../../store";
import { Link } from "react-router-dom";
import AuthModal from "../Modal/AuthModal";

const ProfileMenu = () => {    
    const userInfo = useSelector((state: RootState) => state.auth.userInfo);
    const dispatch = useDispatch();
    const [logoutMutation] = useLogoutMutation();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: MouseEvent<HTMLElement>) => {
        if (!userInfo) {
            setIsModalOpen(true);
            return;
        }

        setAnchorEl(event.currentTarget)
    };
    const handleClose = () => setAnchorEl(null);

    const handleLogout = async () => {
        const toastId = toast.loading("Signing you out...");
        try {
            await logoutMutation({}).unwrap();
            dispatch(logout());
            toast.success("You’ve been signed out.", { id: toastId });
        } catch (error) {
            console.error(error);
            const typeserror = error as CatchErrorType;
            if (typeserror.status === 401) {
                toast.error("You’re not currently logged in.", { id: toastId });
            } else {
                toast.error("Logout failed. Please try again.", { id: toastId });
            }
        }
    };

    return (
        <div>
            <div className="flex items-center gap-2">
                <h2 className="hidden md:block"> 
                    {userInfo?.username || "Guest"} 
                </h2>
                <button 
                    onClick={handleClick} 
                    className="cursor-pointer"
                >
                    {userInfo?.avatar_image ? (
                        <img 
                            src={userInfo.avatar_image} 
                            alt={`${userInfo.username} avatar`}
                            className="w-10 h-10 rounded-full p-1 outline-2 outline-transparent hover:outline-main/25 transition-colors duration-200 object-cover" 
                        />
                    ) : (
                        <AccountCircleIcon className="text-main h-8 w-8 outline-2 outline-transparent hover:outline-main/25 transition-colors duration-200 rounded-full" />
                    )}
                </button>
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                        },
                    },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem 
                        component={Link}
                        onClick={handleClose} 
                        to={`/user/${userInfo?.username}`}
                    >
                        <ListItemIcon> <AccountCircleIcon fontSize="medium" /> </ListItemIcon>
                        Profile
                    </MenuItem>
                    <MenuItem 
                        component={Link}
                        onClick={handleClose}
                        to={`/user/${userInfo?.username}/bookmarks`}
                    >
                        <ListItemIcon>
                            <BookmarkOutlinedIcon  fontSize="medium"/>   
                        </ListItemIcon>
                        Bookmarked Animes
                    </MenuItem>
                    <Divider />
                    <MenuItem 
                        component={Link}
                        onClick={handleClose}
                        to={`/settings`}
                    >
                        <ListItemIcon> <Settings fontSize="medium" /> </ListItemIcon>
                        Settings
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon> <Logout fontSize="medium" /> </ListItemIcon> 
                        Logout
                    </MenuItem>
                </Menu>
            </div>
            <AuthModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default ProfileMenu;
