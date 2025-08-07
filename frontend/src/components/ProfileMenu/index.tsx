import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "../../services/authService";
import { logout } from "../../slices/authSlice";
import toast from "react-hot-toast";
import useAuthRefetch from "../../hooks/useAuthRefetch";
import { Divider, ListItemIcon, Menu, MenuItem, Tooltip } from "@mui/material";
import { useState, type MouseEvent } from "react";
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import type { CatchErrorType } from "../../utils/types/error.type";

const ProfileMenu = () => {
    const { refetch } = useAuthRefetch();
    const dispatch = useDispatch();
    const [logoutMutation] = useLogoutMutation();


    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleLogout = async () => {
        const toastId = toast.loading("Signing you out...");
        try {
            await logoutMutation({}).unwrap();
            dispatch(logout());
            refetch();
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
                <h2 className="hidden md:block"> Guest </h2>{" "}
                <Tooltip 
                    title="Profile Settings" 
                    placement="bottom-end"
                    arrow
                >
                    <button 
                        onClick={handleClick} 
                        className="cursor-pointer"
                    >
                        <AccountCircleIcon className="text-main h-8 w-8 outline-2 outline-transparent hover:outline-main/25 transition-colors duration-200 rounded-full" />
                    </button>
                </Tooltip>
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
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon> <AccountCircleIcon fontSize="medium" /> </ListItemIcon>
                        Profile
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon> <AccountCircleIcon fontSize="medium" /> </ListItemIcon>
                        My Account
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <BookmarkOutlinedIcon  fontSize="medium"/>   
                        </ListItemIcon>
                        Bookmarked Animes
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon> <Settings fontSize="medium" /> </ListItemIcon>
                        Settings
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon> <Logout fontSize="medium" /> </ListItemIcon> 
                        Logout
                    </MenuItem>
                </Menu>
            </div>
        </div>
    );
};

export default ProfileMenu;
