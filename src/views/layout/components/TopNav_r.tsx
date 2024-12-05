import { Tooltip, IconButton, Avatar, Menu, MenuItem, Box } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import { useState } from 'react';
import { useLazyLogoutQuery } from '../../../store/apiSlices/authApiSlice';
import { useNavigate } from 'react-router-dom';
import { removeUser } from '../../../store/userSlice';
import UserProfileModal from './UserProfileModal';
import { useAppDispatch } from '../../../store/storeHooks';
export default function TopNav_r() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // drop-town logic
  const handleAvatorOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAvatorClose = () => {
    setAnchorEl(null);
  };

  // log-out logic
  const [triggerLogout, { ...logoutOthers }] = useLazyLogoutQuery();
  const handleLogout = async () => {
    try {
      await triggerLogout().unwrap();
      navigate('/auth', { state: { forcedLogOut: false, msg: 'from user logout' } });
      dispatch(removeUser());
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const [modalVisibility, setModalVisibility] = useState(false);

  return (
    <>
      {modalVisibility && (
        <UserProfileModal
          visibility={modalVisibility}
          onCloseModal={() => {
            setModalVisibility(false);
          }}
        />
      )}

      {/* Avatar and message icon */}
      <Tooltip title="Messages">
        <IconButton
          sx={{
            width: 40, // match Avatar size
            height: 40, // match Avatar size
            border: '1px solid', // border style
            borderColor: 'var(--SideNav-background)', // border color
            display: 'none', // !!!!!!!!!!!!!!!!!!!!!!!!
          }}
        >
          <MessageIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Account">
        <IconButton
          onClick={handleAvatorOpen}
          sx={{
            width: 40, // match Avatar size
            height: 40, // match Avatar size
          }}
        >
          <Avatar sx={{ bgcolor: 'orange' }}>N</Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={!!anchorEl}
        onClose={handleAvatorClose}
      >
        <MenuItem
          onClick={() => {
            setModalVisibility(true);
          }}
        >
          User Profile
        </MenuItem>
        <MenuItem onClick={handleLogout}>Log out</MenuItem>
      </Menu>
    </>
  );
}
