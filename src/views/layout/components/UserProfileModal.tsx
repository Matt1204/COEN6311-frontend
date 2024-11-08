import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MAXLENGTH,
} from '../../../shared/utils/validators';

import { useFormReducer, State } from '../../../shared/utils/useFormReducer';
import CustomModal from '../../components/CustomModal';
import CustomInput from '../../auth/components/CustomInput';
import { Box, TextField, Autocomplete, Fab } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveAsIcon from '@mui/icons-material/SaveAs';
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
import { useFormState } from '../../../shared/utils/useFormState';
import { z } from 'zod';

let formSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  address: z.string(),
  phoneNumber: z.string(),
  seniority: z
    .number()
    .gte(1, { message: 'Seniority must be selected' })
    .lte(10, { message: 'Seniority must be selected' }),
  hospitalId: z.number({ message: 'hospital musted be selected' }),
});

type UserProfileModal = {
  visibility: boolean;
  onCloseModal: () => void;
};
export default function UserProfileModal({ visibility = false, onCloseModal }: UserProfileModal) {
  const dispatch = useAppDispatch();
  let userState = useAppSelector(state => state.user);
  // fetch all hospitals data
  const {
    data: hospitalsData,
    error: fetchHospitalsErr,
    isLoading: fetchHospitalsLoading,
  } = useFetchAllHospitalsQuery(undefined, { skip: !(userState.role == 'supervisor') });

  // fetch User information
  const { data: userData, refetch: refetchUser } = useFetchUserQuery(userState.email, {
    refetchOnMountOrArgChange: true,
  });

  // useEffect(() => {
  //   console.log('watch formState:', formState);
  // }, [formState]);
  // useEffect(() => {
  //   console.log('watch userData: ', userData);
  // }, [userData]);
  // initialize form State
  const {
    formState,
    handleFormChange,
    handleFormBlur,
    handleFormFocus,
    addInputs,
    removeInputs,
    formIsValid: formValidity,
  } = useFormState(formSchema);
  useEffect(() => {
    console.log('watch formState:', formState);
  }, [formState]);
  // initialize formState with User informtion
  useEffect(() => {
    if (userData && userData?.data) {
      let dataList: { field: keyof typeof formSchema.shape; value: string | number }[] = [
        { field: 'firstName' as keyof typeof formSchema.shape, value: userData.data.first_name },
        { field: 'lastName' as keyof typeof formSchema.shape, value: userData.data.last_name },
        {
          field: 'phoneNumber' as keyof typeof formSchema.shape,
          value: userData.data.phone_number || '',
        },
        { field: 'address' as keyof typeof formSchema.shape, value: userData.data.address || '' },
      ];
      if (userState.role == 'nurse') {
        dataList.push({
          field: 'seniority' as keyof typeof formSchema.shape,
          value: userData.data.seniority || 0,
        });
      }
      if (userState.role == 'supervisor') {
        dataList.push({
          field: 'hospitalId' as keyof typeof formSchema.shape,
          value: userData.data.hospital_id || 0,
        });
      }
      console.log('adding inputs using: ', dataList);
      addInputs(dataList);
    }
  }, [userData]);

  // Submitting
  const [updateUser, { ...updateUserOthers }] = useUpdateUserMutation();
  const handleModalSubmit = async () => {
    if (
      formValidity &&
      formState?.firstName &&
      formState?.lastName &&
      formState?.address &&
      formState?.phoneNumber
    ) {
      try {
        let payload: UpdateUser = {
          email: userState.email,
          first_name: formState.firstName.content as string,
          last_name: formState.lastName.content as string,
          address: formState.address.content as string,
          phone_number: formState.phoneNumber.content as string,
        };
        if (userState.role == 'nurse' && formState?.seniority) {
          payload['seniority'] = formState.seniority.content as number;
        }
        if (userState.role == 'supervisor' && formState?.hospitalId) {
          payload['hospital_id'] = formState.hospitalId.content as number;
        }
        console.log('submitting:', payload);

        let res = await updateUser(payload).unwrap();
        // onCloseModal();
        dispatch(showAlert({ msg: 'update success', severity: 'success' }));
        setEditMode(false);
        console.log(res);
      } catch (error: any) {
        console.log(error);
        dispatch(showAlert({ msg: error?.data?.message, severity: 'error' }));
      }
    } else {
      dispatch(showAlert({ msg: 'form invalid.', severity: 'error' }));
    }
  };

  const [editMode, setEditMode] = useState(false);

  return (
    <CustomModal
      open={visibility}
      onClose={() => {
        onCloseModal();
        console.log('close:', formState);
      }}
      // onSubmit={handleModalSubmit}
      // disableSubmitBtn={!formValidity}
      showSubmitBtn={false}
      title={'My Profile'}
    >
      <Box
        sx={{
          position: 'absolute',
          bottom: '90px',
          right: '20px',
          // backgroundColor: 'red',
          // height: '20px',
          // width: '20px',
        }}
      >
        {editMode ? (
          <Fab
            color="secondary"
            aria-label="edit"
            onClick={() => {
              handleModalSubmit();
            }}
          >
            <SaveAsIcon />
          </Fab>
        ) : (
          <Fab
            color="secondary"
            aria-label="edit"
            onClick={() => {
              setEditMode(true);
            }}
          >
            <EditIcon />
          </Fab>
        )}
      </Box>
      <Box sx={{ width: '100%', position: 'relative', p: '0 80px' }}>
        <Grid container spacing={3} sx={{ padding: '25px 15px' }}>
          {formState?.firstName &&
            formState?.lastName &&
            formState?.address &&
            formState?.phoneNumber && (
              <>
                <Grid size={{ xs: 12, lg: 6 }} padding={{ xs: '10px', md: '0px' }}>
                  <TextField
                    variant="outlined"
                    id={'firstNameInput'}
                    label={'first name'}
                    placeholder={'first name'}
                    error={!!formState.firstName.errorMessage && !formState.firstName.isFocused}
                    helperText={
                      !!formState.firstName.errorMessage && !formState.firstName.isFocused
                        ? formState.firstName.errorMessage
                        : ''
                    }
                    required
                    // autoComplete={true}
                    value={formState?.firstName.content}
                    onChange={e => {
                      handleFormChange('firstName', e.target.value);
                    }}
                    onBlur={() => {
                      handleFormBlur('firstName');
                    }}
                    onFocus={() => {
                      handleFormFocus('firstName');
                    }}
                    slotProps={{
                      input: {
                        readOnly: !editMode,
                      },
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid
                  size={{ xs: 12, lg: 6 }}
                  padding={{ xs: '10px', md: '0px' }}
                  // sx={{ border: 'dashed' }}
                >
                  <TextField
                    variant="outlined"
                    id={'lastNameInput'}
                    label={'last name'}
                    placeholder={'input your last name'}
                    error={!!formState.lastName.errorMessage && !formState.lastName.isFocused}
                    helperText={
                      !!formState.lastName.errorMessage && !formState.lastName.isFocused
                        ? formState.lastName.errorMessage
                        : ''
                    }
                    required
                    // autoComplete={true}
                    value={formState?.lastName.content}
                    onChange={e => {
                      handleFormChange('lastName', e.target.value);
                    }}
                    onBlur={() => {
                      handleFormBlur('lastName');
                    }}
                    onFocus={() => {
                      handleFormFocus('lastName');
                    }}
                    slotProps={{
                      input: {
                        readOnly: !editMode,
                      },
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid
                  size={{ xs: 12, lg: 6 }}
                  padding={{ xs: '10px', md: '0px' }}
                  // sx={{ border: 'dashed' }}
                >
                  <TextField
                    variant="outlined"
                    id={'addressInput'}
                    label={'address'}
                    placeholder={'your address'}
                    error={!!formState.address.errorMessage && !formState.address.isFocused}
                    helperText={
                      !!formState.lastName.errorMessage &&
                      !formState.lastName.isFocused &&
                      formState.lastName.errorMessage
                    }
                    required
                    // autoComplete={true}
                    value={formState?.address.content}
                    onChange={e => {
                      handleFormChange('address', e.target.value);
                    }}
                    onBlur={() => {
                      handleFormBlur('address');
                    }}
                    onFocus={() => {
                      handleFormFocus('address');
                    }}
                    slotProps={{
                      input: {
                        readOnly: !editMode,
                      },
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid
                  size={{ xs: 12, lg: 6 }}
                  padding={{ xs: '10px', md: '0px' }}
                  // sx={{ border: 'dashed' }}
                >
                  <TextField
                    variant="outlined"
                    id={'phoneNumberInput'}
                    label={'phone number'}
                    placeholder={'your phone number'}
                    error={!!formState.phoneNumber.errorMessage && !formState.phoneNumber.isFocused}
                    helperText={
                      !!formState.phoneNumber.errorMessage &&
                      !formState.phoneNumber.isFocused &&
                      formState.phoneNumber.errorMessage
                    }
                    required
                    // autoComplete={true}
                    value={formState?.phoneNumber.content}
                    onChange={e => {
                      handleFormChange('phoneNumber', e.target.value);
                    }}
                    onBlur={() => {
                      handleFormBlur('phoneNumber');
                    }}
                    onFocus={() => {
                      handleFormFocus('phoneNumber');
                    }}
                    slotProps={{
                      input: {
                        readOnly: !editMode,
                      },
                    }}
                    fullWidth
                  />
                </Grid>
              </>
            )}

          {userState.role == 'nurse' && formState?.seniority && (
            <Grid
              size={{ xs: 12, lg: 6 }}
              padding={{ xs: '10px', md: '0px' }}
              sx={{ padding: '0 0 0 10px' }}
            >
              <Typography component="legend">
                *Seniority level: {`${formState?.seniority?.content}`}
              </Typography>
              <Rating
                value={formState?.seniority?.content as number}
                onChange={(e, val) => {
                  val && handleFormChange('seniority', val);
                }}
                // defaultValue={5}
                max={10}
                readOnly={!editMode}
              />
            </Grid>
          )}
          {userState.role == 'supervisor' && hospitalsData?.data && formState?.hospitalId && (
            <Grid size={{ xs: 12, lg: 6 }} padding={{ xs: '10px', md: '0px' }}>
              <Autocomplete
                // Props for customizing behavior
                options={hospitalsData.data}
                getOptionLabel={(option: Hospital) => option.h_name}
                isOptionEqualToValue={(option, value) => option.h_id === value.h_id}
                value={hospitalsData.data.find(
                  hospital => hospital.h_id == formState?.hospitalId?.content
                )}
                onChange={(event, newValue: Hospital | null) => {
                  newValue && handleFormChange('hospitalId', newValue?.h_id);
                }}
                renderInput={params => <TextField {...params} label="Select a Hospital *" />}
                disablePortal
                disableClearable
                blurOnSelect
                readOnly={!editMode}
              />
            </Grid>
          )}
        </Grid>
      </Box>
    </CustomModal>
  );
}
