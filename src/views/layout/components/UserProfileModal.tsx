import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
} from '../../../shared/utils/validators';

import { useFormReducer, State } from '../../../shared/utils/useFormReducer';
import CustomModal from '../../components/CustomModal';
import CustomInput from '../../auth/components/CustomInput';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { useFetchUserQuery } from '../../auth/userApiSlice';
import { useAppSelector, useAppDispatch } from '../../../store/storeHooks';

const initialState: State = {
  inputs: {
    firstName: { id: 'firstName', content: '', validity: false },
    lastName: { id: 'lastName', content: '', validity: false },
    address: { id: 'address', content: '', validity: false },
    phoneNumber: { id: 'phoneNumber', content: '', validity: false },
    birthday: { id: 'birthday', content: '', validity: false },
  },
  masterValidity: false,
};
type UserProfileModal = {
  visibility: boolean;
  onCloseModal: () => void;
  onSubmitModal: () => void;
};

export default function UserProfileModal({
  visibility = false,
  onCloseModal,
  onSubmitModal,
}: UserProfileModal) {
  let userState = useAppSelector(state => state.user);

  const {
    data: userData,
    error: fetchUserError,
    isLoading: fetchUserLoading,
    refetch: reFetchUser,
  } = useFetchUserQuery(userState.email, {
    skip: !userState.email,
    // refetchOnMountOrArgChange: true,
  });
  useEffect(() => {
    console.log('userData update:');
    console.log(userData?.data);
  }, [userData]);
  // useEffect(() => {
  //   console.log('fetchUserError update:');
  //   // console.log(fetchUserError);
  // }, [fetchUserError]);
  // useEffect(() => {
  //   console.log('fetchUserLoading update:');
  //   // console.log(fetchUserLoading);
  // }, [fetchUserLoading]);
  const { formState, formDispatch } = useFormReducer(initialState);
  const handleFormUpdate = (id: string, content: string, validity: boolean) => {
    formDispatch({ type: 'UPDATE', payload: { id, content, validity } });
  };
  useEffect(() => {
    console.log(formState);
  }, [formState]);

  useEffect(() => {
    console.log('useEffect!!!!!');
    formDispatch({
      type: 'UPDATE',
      payload: { id: 'firstName', content: userData?.data.first_name, validity: true },
    });
    formDispatch({
      type: 'UPDATE',
      payload: { id: 'lastName', content: userData?.data.last_name, validity: true },
    });
    formDispatch({
      type: 'UPDATE',
      payload: { id: 'address', content: userData?.data.address || '', validity: true },
    });
    formDispatch({
      type: 'UPDATE',
      payload: { id: 'phoneNumber', content: userData?.data.phone_number || '', validity: true },
    });
    formDispatch({
      type: 'UPDATE',
      payload: { id: 'birthday', content: userData?.data.birthday || '', validity: true },
    });

    if (userState.role == 'nurse') {
      formDispatch({
        type: 'ADD_INPUT',
        payload: { id: 'seniority', content: userData?.data.seniority || '', validity: true },
      });
    }
    if (userState.role == 'supervisor') {
      formDispatch({
        type: 'ADD_INPUT',
        payload: { id: 'hospitalId', content: userData?.data.hospital_id || '', validity: true },
      });
    }
  }, [userData]);

  return (
    <CustomModal
      open={visibility}
      onClose={() => {
        onCloseModal();
      }}
      onSubmit={() => {
        onSubmitModal();
      }}
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
              value={formState.inputs.firstName.content as string}
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
              value={formState.inputs.lastName.content as string}
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
          >
            <CustomInput
              value={formState.inputs.address.content as string}
              element="input"
              id="address"
              label="Address"
              type="text"
              placeholder="Adress"
              errorText=""
              validators={[]}
              onUpdate={handleFormUpdate}
            />
          </Grid>
          <Grid
            size={{ xs: 12, lg: 6 }}
            padding={{ xs: '10px', md: '0px' }}
            sx={{ border: 'dashed', height: '30px' }}
          >
            <CustomInput
              value={formState.inputs.phoneNumber.content as string}
              element="input"
              id="phoneNumber"
              label="Phone Number"
              type="text"
              placeholder="Phone Number"
              errorText="number, max 13."
              validators={[VALIDATOR_MAXLENGTH(13)]}
              onUpdate={handleFormUpdate}
            />
          </Grid>
          <Grid
            size={{ xs: 12, lg: 6 }}
            padding={{ xs: '10px', md: '0px' }}
            sx={{ border: 'dashed', height: '30px' }}
          ></Grid>
        </Grid>
      </Box>
    </CustomModal>
  );
}
