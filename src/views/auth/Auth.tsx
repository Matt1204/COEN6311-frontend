import React, { useState, useEffect } from 'react';
import CustomInput from './components/CustomInput';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from '../../shared/utils/validators';
import { useFormReducer, State } from '../../shared/utils/useFormReducer'; // Update the import path as needed
import { setUser } from '../../store/userSlice';
import { useAppDispatch } from '../../store/storeHooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDemoRequestQuery } from '../../store/apiSlice';
import { useLoginMutation, useRegisterMutation } from './authApiSlice';
import { Box, Button, Container, Typography } from '@mui/material';

import Grid from '@mui/material/Grid2';
import { showAlert } from '../../store/alertSlice';

const initialState: State = {
  inputs: {
    emailInput: { id: 'emailInput', content: '', validity: false },
    pwdInput: { id: 'pwdInput', content: '', validity: false },
  },
  masterValidity: false,
};

export default function Auth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const { formState, formDispatch } = useFormReducer(initialState);
  // const { httpRequest } = useHttpHook();
  // auto-revoked when re-render OR parameter changes
  // const { data: demoRes, error: demoErr, isLoading } = useDemoRequestQuery({});
  // console.log(demoRes);
  // console.log(demoErr);

  const handleFormUpdate = (id: string, content: string, validity: boolean) => {
    formDispatch({ type: 'UPDATE', payload: { id, content, validity } });
  };
  const handleToSignup = () => {
    formDispatch({
      type: 'ADD_INPUT',
      payload: { id: 'firstNameInput', content: '', validity: false },
    });
    formDispatch({
      type: 'ADD_INPUT',
      payload: { id: 'lastNameInput', content: '', validity: false },
    });
    setIsLoginMode(false);
  };
  const handleToLogin = () => {
    formDispatch({
      type: 'REMOVE_INPUT',
      payload: { id: 'firstNameInput', content: '', validity: false },
    });
    formDispatch({
      type: 'REMOVE_INPUT',
      payload: { id: 'lastNameInput', content: '', validity: false },
    });
    setIsLoginMode(true);
  };

  // useEffect(() => {
  //   console.log('Form State Updated:', formState);
  // }, [formState.inputs, formState.masterValidity]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoginMode) {
      try {
        let res = await login({
          email: formState.inputs.emailInput.content,
          password: formState.inputs.pwdInput.content,
        }).unwrap();
        dispatch(
          setUser({
            email: res.email,
            firstName: res.first_name,
            lastName: res.last_name,
            accessToken: res.access_token,
            role: res.role,
          })
        );
        dispatch(showAlert({ msg: `Hello ${res.first_name}`, severity: 'success' }));
        navigate(from, { replace: true });
      } catch (err: any) {
        console.log(err);

        dispatch(showAlert({ msg: err.data.message, severity: 'error' }));
        // msg
        // if (!err?.originalStatus) {
        //   // isLoading: true until timeout occurs
        //   setErrMsg('No Server Response');
        // } else if (err.originalStatus === 400) {
        //   setErrMsg('Missing Username or Password');
        // } else if (err.originalStatus === 401) {
        //   setErrMsg('Unauthorized');
        // } else {
        //   setErrMsg('Login Failed');
        // }
      }
    } else {
      try {
        let res = await register({
          email: formState.inputs.emailInput.content,
          password: formState.inputs.pwdInput.content,
          first_name: formState.inputs.firstNameInput.content,
          last_name: formState.inputs.lastNameInput.content,
        }).unwrap();
        console.log(res);
        handleToLogin();
      } catch (err: any) {
        console.log(`signup error:${err}`);
        // console.log(err);
      }
    }
  };

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
              <Grid size={{ xs: 12 }} padding={{ xs: '10px', md: '0px' }}>
                <CustomInput
                  element="input"
                  id="emailInput"
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  errorText="Please enter a valid email address."
                  validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
                  autoComplete="email"
                  onUpdate={handleFormUpdate}
                />
              </Grid>
              <Grid size={{ xs: 12 }} padding={{ xs: '10px', md: '0px' }}>
                <CustomInput
                  element="input"
                  id="pwdInput"
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  errorText="Password must be at least 8 characters."
                  validators={[VALIDATOR_MINLENGTH(8)]}
                  onUpdate={handleFormUpdate}
                />
              </Grid>
              {!isLoginMode && (
                <>
                  <Grid size={{ xs: 12 }} padding={{ xs: '10px', md: '0px' }}>
                    <CustomInput
                      element="input"
                      id="firstNameInput"
                      label="First Name"
                      type="text"
                      placeholder="First name"
                      errorText="First name is required."
                      validators={[VALIDATOR_REQUIRE()]}
                      onUpdate={handleFormUpdate}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }} padding={{ xs: '10px', md: '0px' }}>
                    <CustomInput
                      element="input"
                      id="lastNameInput"
                      label="Last Name"
                      type="text"
                      placeholder="Last name"
                      errorText="Last name is required."
                      validators={[VALIDATOR_REQUIRE()]}
                      onUpdate={handleFormUpdate}
                    />
                  </Grid>
                </>
              )}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!formState.masterValidity}
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
