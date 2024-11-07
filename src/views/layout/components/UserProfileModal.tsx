import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
} from '../../../shared/utils/validators';

import { useFormReducer, State } from '../../../shared/utils/useFormReducer';
import CustomModal from '../../components/CustomModal';
import CustomInput from '../../auth/components/CustomInput';
import { Box, TextField, Autocomplete } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/storeHooks';
import {
  useFetchUserQuery,
  useLazyFetchUserQuery,
  useUpdateUserMutation,
  UpdateUser,
} from '../../../store/apiSlices/userApiSlice';
import {
  useFetchAllHospitalsQuery,
  useLazyFetchAllHospitalsQuery,
  Hospital,
} from '../../../store/apiSlices/hospitalApiSlice';
import { showAlert } from '../../../store/alertSlice';

// nurse: seniority, supervisor: hospital

type UserProfileModal = {
  visibility: boolean;
  onCloseModal: () => void;
};

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

export default function UserProfileModal({ visibility = false, onCloseModal }: UserProfileModal) {
  const dispatch = useAppDispatch();
  let userState = useAppSelector(state => state.user);

  // fetch User information
  // const [triggerFetchUser, { isLoading: fetchUserLoading, data: userData, error: fetchUserError }] =
  //   useLazyFetchUserQuery(undefined, {refetchOnMountOrArgChange: true});
  const { data: userData, refetch: refetchUser } = useFetchUserQuery(userState.email, {
    // refetchOnMountOrArgChange: true,
  });
  // useEffect(() => {
  //   triggerFetchUser(userState.email);
  //   console.log('setup userData:', userData);
  //   console.log('setup formState:', formState);
  // }, []);

  // fetch all hospitals data
  const {
    data: hospitalsData,
    error: fetchHospitalsErr,
    isLoading: fetchHospitalsLoading,
  } = useFetchAllHospitalsQuery(undefined, { skip: !(userState.role == 'supervisor') });

  // useFormReducer
  const { formState, formDispatch } = useFormReducer(initialState);
  const handleFormUpdate = (id: string, content: string | number, validity: boolean) => {
    formDispatch({ type: 'UPDATE', payload: { id, content, validity } });
  };
  useEffect(() => {
    console.log('watch formState:', formState);
  }, [formState]);
  useEffect(() => {
    console.log('watch userData: ', userData);
  }, [userData]);

  // initialize formState with User informtion
  useEffect(() => {
    if (userData?.data) {
      console.log('initialize formState with:', userData.data);
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

      if (userState.role == 'nurse' && userData?.data?.seniority) {
        console.log(
          `adding nurse-seniorty: ${userData?.data?.seniority} (${typeof userData?.data?.seniority})`
        );
        formDispatch({
          type: 'ADD_INPUT',
          payload: {
            id: 'seniority',
            content: userData?.data?.seniority,
            validity: true,
          },
        });
      }
      if (userState.role == 'supervisor' && userData?.data?.hospital_id) {
        formDispatch({
          type: 'ADD_INPUT',
          payload: { id: 'hospitalId', content: userData.data.hospital_id, validity: true },
        });
      }
      console.log('formState loading finish: ', formState);
    }
    console.log('empty userData, pass loading');
  }, [userData, formDispatch]);

  // Submitting
  const [updateUser, { ...updateUserOthers }] = useUpdateUserMutation();
  const handleModalSubmit = async () => {
    if (formState.masterValidity) {
      try {
        let payload: UpdateUser = {
          email: userState.email,
          first_name: formState.inputs.firstName.content as string,
          last_name: formState.inputs.lastName.content as string,
          address: formState.inputs.address.content as string,
          phone_number: formState.inputs.phoneNumber.content as string,
        };
        if (userState.role == 'nurse' && formState.inputs?.seniority?.content) {
          payload['seniority'] = formState.inputs.seniority.content as number;
        }
        if (userState.role == 'supervisor' && formState.inputs?.hospitalId?.content) {
          payload['hospital_id'] = formState.inputs.hospitalId.content as number;
        }
        console.log('submitting:', payload);

        let res = await updateUser(payload).unwrap();
        onCloseModal();
        dispatch(showAlert({ msg: 'update success', severity: 'success' }));
        console.log(res);
      } catch (error: any) {
        console.log(error);
        dispatch(showAlert({ msg: error?.data?.message, severity: 'error' }));
      }
    } else {
      dispatch(showAlert({ msg: 'form invalid.', severity: 'error' }));
    }
  };

  return (
    <CustomModal
      open={visibility}
      onClose={() => {
        onCloseModal();
        console.log('close:', formState);
      }}
      onSubmit={handleModalSubmit}
      disableSubmitBtn={!formState.masterValidity}
      title={'My Profile'}
    >
      <Box sx={{ width: '100%' }}>
        <Grid container spacing={2} sx={{ padding: '25px 15px' }}>
          {/* first name */}
          <Grid
            size={{ xs: 12, lg: 6 }}
            padding={{ xs: '10px', md: '0px' }}
            // sx={{ border: 'dashed' }}
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
          {/* last name */}
          <Grid
            size={{ xs: 12, lg: 6 }}
            padding={{ xs: '10px', md: '0px' }}
            // sx={{ border: 'dashed' }}
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
          {/* address */}
          <Grid
            size={{ xs: 12, lg: 6 }}
            padding={{ xs: '10px', md: '0px' }}
            // sx={{ border: 'dashed' }}
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
          {/* phone number */}
          <Grid
            size={{ xs: 12, lg: 6 }}
            padding={{ xs: '10px', md: '0px' }}
            // sx={{ border: 'dashed' }}
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
          {userState.role == 'nurse' &&
            formState.inputs?.seniority?.content &&
            userData?.data?.seniority && (
              <Grid
                size={{ xs: 12, lg: 6 }}
                padding={{ xs: '10px', md: '0px' }}
                sx={{ padding: '0 0 0 10px' }}
              >
                <Typography component="legend">
                  Seniority level: {`${formState.inputs.seniority.content}`}
                </Typography>
                <Rating
                  onChange={(e, val) => {
                    console.log('on rating change: ', val);
                    val && handleFormUpdate('seniority', val, true);
                  }}
                  value={formState.inputs.seniority.content as number}
                  // defaultValue={userData.data.seniority}
                  max={10}
                />
              </Grid>
            )}
          {userState.role == 'supervisor' &&
            hospitalsData?.data &&
            userData?.data?.hospital_id &&
            formState.inputs?.hospitalId?.content && (
              <Grid size={{ xs: 12, lg: 6 }} padding={{ xs: '10px', md: '0px' }}>
                <Autocomplete
                  // Props for customizing behavior
                  options={hospitalsData.data}
                  getOptionLabel={(option: Hospital) => option.h_name}
                  isOptionEqualToValue={(option, value) => option.h_id === value.h_id}
                  defaultValue={hospitalsData.data.find(
                    hospital => hospital.h_id == userData.data.hospital_id
                  )}
                  onChange={(event, newValue: Hospital | null) => {
                    newValue && handleFormUpdate('hospitalId', newValue?.h_id, true);
                  }}
                  renderInput={params => <TextField {...params} label="Select a Hospital" />}
                  disablePortal
                  disableClearable
                  blurOnSelect
                />
              </Grid>
            )}
        </Grid>
      </Box>
    </CustomModal>
  );
}
