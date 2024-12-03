import React, { useState, useEffect, useMemo } from 'react';
import { setUser } from '../../store/userSlice';
import { useAppDispatch } from '../../store/storeHooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLoginMutation, useRegisterMutation } from '../../store/apiSlices/authApiSlice';
import { useFetchAllHospitalsQuery, Hospital } from '../../store/apiSlices/hospitalApiSlice';
import {
  Box,
  Button,
  Container,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Rating,
  Autocomplete,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { showAlert } from '../../store/alertSlice';
import { z } from 'zod';
import { useFormState } from '../../shared/utils/useFormState';

// Define the validation schema using Zod for the form fields.
// Initial schema definition with Zod.
let formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Must be 8 or more characters long' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  role: z.string({ message: 'Role is required' }),
  seniority: z
    .number()
    .gte(1, { message: 'Seniority must be selected' })
    .lte(10, { message: 'Seniority must be selected' }),
  hospitalId: z.number({ message: 'hospital musted be selected' }),
});
type FormSchemaType = z.infer<typeof formSchema>;

type Input = { content: string | number; errorMessage: string; isFocused: boolean };
type FormState = Record<string, Input>;

export default function Auth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // const location = useLocation();
  // const forcedLogOut = location.state?.from?.pathname || '/';

  // useEffect(() => {
  //   console.log(location.state);

  //   console.log(location.state.forcedLogOut);

  //   if (location?.state?.forcedLogOut) {
  //     dispatch(showAlert({ msg: `Your session is out.` }));
  //   }
  // }, []);

  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();
  const {
    data: hospitalsData,
    error: fetchHospitalsErr,
    isLoading: fetchHospitalsLoading,
  } = useFetchAllHospitalsQuery(undefined);

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
    addInputs([
      { field: 'email', value: '' },
      { field: 'password', value: '' },
    ]);
  }, []);

  useEffect(() => {
    console.log('watch formState: ', formState);
  }, [formState]);

  // Switching Sing-in, Sign-up
  const [isLoginMode, setIsLoginMode] = useState(true);
  const handleToSignup = () => {
    setIsLoginMode(false);
    addInputs([
      { field: 'firstName', value: '' },
      { field: 'lastName', value: '' },
      { field: 'role', value: 'nurse' },
      { field: 'seniority', value: 5 },
    ]);
  };
  const handleToLogin = () => {
    setIsLoginMode(true);
    removeInputs(['firstName', 'lastName', 'role', 'seniority', 'hospitalId']);
  };

  // handling role change
  const roleOptions = ['nurse', 'supervisor'] as const;
  const handleRoleChange = (newRole: string) => {
    handleFormChange('role', newRole);
    if (newRole == 'nurse') {
      removeInputs(['hospitalId']);
      addInputs([{ field: 'seniority', value: 5 }]);
    }
    if (newRole == 'supervisor') {
      removeInputs(['seniority']);
      addInputs([{ field: 'hospitalId', value: hospitalsData?.data[0]?.h_id || 0 }]);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formValidity) {
      return;
    }
    if (isLoginMode) {
      if (formState?.email && formState?.password) {
        try {
          let res = await login({
            email: formState.email.content,
            password: formState.password.content,
          }).unwrap();
          dispatch(
            setUser({
              email: res.email,
              firstName: res.first_name,
              lastName: res.last_name,
              accessToken: res.access_token,
              role: res.role,
              uId: res.u_id,
            })
          );
          dispatch(showAlert({ msg: `Hello ${res.first_name}`, severity: 'success' }));
          let directTo =
            res.role == 'nurse'
              ? '/my-schedule'
              : res.role == 'supervisor'
                ? '/hospital-schedule'
                : '/user-management';
          navigate(directTo ? directTo : '/home', { replace: true });
          // navigate('/', { replace: true });
        } catch (err: any) {
          console.log(err);
          dispatch(showAlert({ msg: err.data.message, severity: 'error' }));
        }
      }
    } else {
      if (
        formState?.email &&
        formState?.password &&
        formState?.firstName &&
        formState?.lastName &&
        formState.role
      ) {
        try {
          const roleSpecificData =
            formState.role.content === 'nurse'
              ? { seniority: formState?.seniority?.content }
              : { hospital_id: formState?.hospitalId?.content };
          let reqPayload = {
            email: formState.email.content,
            password: formState.password.content,
            first_name: formState.firstName.content,
            last_name: formState.lastName.content,
            role: formState.role.content,
            ...roleSpecificData,
          };

          let res = await register(reqPayload).unwrap();
          // console.log(res.data);
          dispatch(showAlert({ msg: `${res.email} registered`, severity: 'success' }));
          handleToLogin();
        } catch (err: any) {
          console.log(err);
          dispatch(showAlert({ msg: err.data.message, severity: 'error' }));
        }
      }
    }
  };

  let renderForRole =
    formState?.role?.content &&
    (formState.role.content == 'nurse' ? (
      <Grid size={{ xs: 12 }} padding={{ xs: '10px', md: '0px' }}>
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
        />
      </Grid>
    ) : (
      hospitalsData?.data && (
        <Grid size={{ xs: 12 }} padding={{ xs: '10px', md: '0px' }}>
          <Autocomplete
            // Props for customizing behavior
            options={hospitalsData.data}
            getOptionLabel={(option: Hospital) => option.h_name}
            isOptionEqualToValue={(option, value) => option.h_id === value.h_id}
            // defaultValue={hospitalsData.data[0]}
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
          />
        </Grid>
      )
    ));

  return (
    <>
      <Container
        component="main"
        sx={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%', // Ensures the Box uses the Container's full width
            maxWidth: 500, // Optional, for better control of form width
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 3, // Padding inside the Box for some spacing around
            border: '1px solid #ccc', // Adds a border with a light grey color
            borderRadius: '8px', // Sets a border radius of 8 pixels
            backgroundColor: '#fff', // Optional: sets a white background color for the Box
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Optional: adds a subtle shadow for depth
          }}
        >
          <Typography component="h1" variant="h5">
            {isLoginMode ? 'Sign in' : 'Sign up'}
          </Typography>
          <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 3, width: '100%' }}>
            <Grid container spacing={{ xs: 2, md: 4 }}>
              {formState?.email && (
                <Grid size={{ xs: 12 }} padding={{ xs: '10px', md: '0px' }}>
                  <TextField
                    required
                    variant="outlined"
                    id={'emailInput'}
                    label={'email'}
                    placeholder={'input your email'}
                    error={!!formState.email.errorMessage && !formState.email.isFocused}
                    helperText={
                      !!formState.email.errorMessage && !formState.email.isFocused
                        ? formState.email.errorMessage
                        : ''
                    }
                    // autoComplete={true}
                    value={formState?.email.content}
                    onChange={e => {
                      handleFormChange('email', e.target.value);
                    }}
                    onBlur={() => {
                      handleFormBlur('email');
                    }}
                    onFocus={() => {
                      handleFormFocus('email');
                    }}
                    // onBlur={handleTouch}
                    fullWidth
                  />
                </Grid>
              )}
              {formState?.password && (
                <Grid size={{ xs: 12 }} padding={{ xs: '10px', md: '0px' }}>
                  <TextField
                    variant="outlined"
                    id={'passwordInput'}
                    type="password"
                    label={'password'}
                    placeholder={'input your password'}
                    error={!!formState.password.errorMessage && !formState.password.isFocused}
                    helperText={
                      !!formState.password.errorMessage && !formState.password.isFocused
                        ? formState.password.errorMessage
                        : ''
                    }
                    required
                    // autoComplete={autoComplete}
                    value={formState?.password.content}
                    onChange={e => {
                      handleFormChange('password', e.target.value);
                    }}
                    onBlur={() => {
                      handleFormBlur('password');
                    }}
                    onFocus={() => {
                      handleFormFocus('password');
                    }}
                    // onBlur={handleTouch}
                    fullWidth
                  />
                </Grid>
              )}
              {!isLoginMode && formState?.firstName && formState?.lastName && formState?.role && (
                <>
                  <Grid size={{ xs: 12 }} padding={{ xs: '10px', md: '0px' }}>
                    <TextField
                      variant="outlined"
                      id={'firstNameInput'}
                      label={'first name'}
                      placeholder={'input your first name'}
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
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }} padding={{ xs: '10px', md: '0px' }}>
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
                      fullWidth
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }} padding={{ xs: '10px', md: '0px' }}>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="role-label">role*</InputLabel>
                      <Select
                        labelId="role-label"
                        id="role"
                        label="hhaha"
                        value={formState?.role.content}
                        onChange={e => {
                          if (e.target.value) {
                            handleRoleChange(e.target.value as string);
                            // console.log(`role change: ${e.target.value}`);
                          }
                        }}
                      >
                        {roleOptions.map(role => {
                          return (
                            <MenuItem value={role} key={role}>
                              {role}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                  {renderForRole}
                </>
              )}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!formValidity}
            >
              {isLoginMode ? 'Sign In' : 'Sign Up'}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={isLoginMode ? () => handleToSignup() : () => handleToLogin()}
            >
              {isLoginMode ? 'No account? Sign up' : 'have an account? Sign in'}
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
