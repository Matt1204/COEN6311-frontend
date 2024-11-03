import { Tooltip, IconButton, Avatar, Menu, MenuItem, Box } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import { useState } from 'react';
import { useLazyLogoutQuery } from '../../auth/authApiSlice';
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
      dispatch(removeUser());
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const [modalVisibility, setModalVisibility] = useState(false);
  const handleSubmitModal = () => {
    console.log('TopNav_r modal submit');
    setModalVisibility(false);
  };

  // modal logic
  //   const [modalVisibility, setModalVisibility] = useState(false);
  //   const {
  //     data: userData,
  //     error: fetchUserError,
  //     isLoading: fetchUserLoading,
  //     refetch: reFetchUser,
  //   } = useFetchUserQuery(userState.email, {
  //     skip: !userState.email || !modalVisibility,
  //     refetchOnMountOrArgChange: true,
  //   });
  //   useEffect(() => {
  //     console.log('userData update:');
  //     console.log(userData?.data);
  //   }, [userData]);
  //   useEffect(() => {
  //     console.log('fetchUserError update:');
  //     // console.log(fetchUserError);
  //   }, [fetchUserError]);
  //   useEffect(() => {
  //     console.log('fetchUserLoading update:');
  //     // console.log(fetchUserLoading);
  //   }, [fetchUserLoading]);

  //   const { formState, formDispatch } = useFormReducer(initialState);
  //   const handleFormUpdate = (id: string, content: string, validity: boolean) => {
  //     formDispatch({ type: 'UPDATE', payload: { id, content, validity } });
  //   };
  //   useEffect(() => {
  //     console.log(formState);
  //   }, [formState]);

  //   const handleOpenModal = () => {
  //     // reFetchUser();
  //     formDispatch({
  //       type: 'UPDATE',
  //       payload: { id: 'firstName', content: userData?.data.first_name, validity: true },
  //     });
  //     formDispatch({
  //       type: 'UPDATE',
  //       payload: { id: 'lastName', content: userData?.data.last_name, validity: true },
  //     });
  //     formDispatch({
  //       type: 'UPDATE',
  //       payload: { id: 'address', content: userData?.data.address || '', validity: true },
  //     });
  //     formDispatch({
  //       type: 'UPDATE',
  //       payload: { id: 'phoneNumber', content: userData?.data.phone_number || '', validity: true },
  //     });
  //     formDispatch({
  //       type: 'UPDATE',
  //       payload: { id: 'birthday', content: userData?.data.birthday || '', validity: true },
  //     });

  //     if (userState.role == 'nurse') {
  //       formDispatch({
  //         type: 'ADD_INPUT',
  //         payload: { id: 'seniority', content: userData?.data.seniority || '', validity: true },
  //       });
  //     }
  //     if (userState.role == 'supervisor') {
  //       formDispatch({
  //         type: 'ADD_INPUT',
  //         payload: { id: 'hospitalId', content: userData?.data.hospital_id || '', validity: true },
  //       });
  //     }
  //     handleAvatorClose();
  //     setModalVisibility(true);
  //   };
  //   const handleCloseModal = () => {
  //     setModalVisibility(false);
  //   };
  //   const handleSubmitProfile = () => {
  //     console.log('submit!!!');
  //     // console.log(formState);
  //   };

  return (
    <>
      {modalVisibility && (
        <UserProfileModal
          visibility={modalVisibility}
          onCloseModal={() => {
            setModalVisibility(false);
          }}
          onSubmitModal={handleSubmitModal}
        />
      )}
      {/* User Profile Modal
      <CustomModal
        open={modalVisibility}
        onClose={handleCloseModal}
        onSubmit={handleSubmitProfile}
        title={'My Profile'}
      >
        <Box sx={{ width: '100%', backgroundColor: '#eee' }}>
          <Grid container spacing={2}>
            <Grid
              size={{ xs: 12, lg: 6 }}
              padding={{ xs: '10px', md: '0px' }}
              sx={{ border: 'dashed' }}
            >
              <CustomInput
                element="input"
                id="firstName"
                label="First Name"
                type="text"
                placeholder="First name"
                errorText="First name is required."
                validators={[VALIDATOR_REQUIRE()]}
                onUpdate={handleFormUpdate}
              />
            </Grid>
            <Grid
              size={{ xs: 12, lg: 6 }}
              padding={{ xs: '10px', md: '0px' }}
              sx={{ border: 'dashed' }}
            >
              <CustomInput
                element="input"
                id="lastName"
                label="Last Name"
                type="text"
                placeholder="Last name"
                errorText="Last name is required."
                validators={[VALIDATOR_REQUIRE()]}
                onUpdate={handleFormUpdate}
              />
            </Grid>
            <Grid
              size={{ xs: 12, lg: 6 }}
              padding={{ xs: '10px', md: '0px' }}
              sx={{ border: 'dashed', height: '30px' }}
            ></Grid>
            <Grid
              size={{ xs: 12, lg: 6 }}
              padding={{ xs: '10px', md: '0px' }}
              sx={{ border: 'dashed', height: '30px' }}
            ></Grid>
          </Grid>
        </Box>
      </CustomModal> */}

      {/* Avatar and message icon */}
      <Tooltip title="Messages">
        <IconButton
          sx={{
            width: 40, // match Avatar size
            height: 40, // match Avatar size
            border: '1px solid', // border style
            borderColor: 'var(--SideNav-background)', // border color
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
