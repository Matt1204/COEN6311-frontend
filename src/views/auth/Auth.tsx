import React, { useState, useEffect } from 'react';
import CustomInput from './components/CustomInput';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from '../../shared/utils/validators';
import { useFormReducer, State } from '../../shared/utils/useFormReducer'; // Update the import path as needed
import useHttpHook from '../../shared/utils/useHttpHook';
import { setUser } from '../../store/userSlice';
import { useAppDispatch } from '../../store/storeHooks';
import { useNavigate } from 'react-router-dom';
import { useDemoRequestQuery } from '../../store/apiSlice';
import { useLoginMutation, useRegisterMutation } from './authApiSlice';

type DummyUserType = {
  uid: string;
  email: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};
const initialState: State = {
  inputs: {
    emailInput: { id: 'emailInput', content: '', validity: false },
    pwdInput: { id: 'pwdInput', content: '', validity: false },
  },
  masterValidity: false,
};

export default function Auth() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { formState, formDispatch } = useFormReducer(initialState);
  const { httpRequest } = useHttpHook();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();
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

  useEffect(() => {
    console.log('Form State Updated:', formState);
  }, [formState.inputs, formState.masterValidity]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoginMode) {
      try {
        let res = await login({
          email: formState.inputs.emailInput.content,
          password: formState.inputs.pwdInput.content,
        }).unwrap();
        console.log(res);
        dispatch(
          setUser({
            email: res.body.email,
            firstName: res.body.firstName,
            lastName: res.body.lastName,
          })
        );
      } catch (err) {
        console.log(err);
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
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <CustomInput
          element="input"
          id="emailInput"
          defaultContent={''}
          defaultValidity={false}
          label="Your email (label)"
          type="email"
          placeholder="email (placeholder)"
          errorText="Please enter a valid email address."
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
          autoComplete="on"
          onUpdate={handleFormUpdate}
        />
        <CustomInput
          element="input"
          id="pwdInput"
          defaultContent={''}
          defaultValidity={false}
          label="Your password (label)"
          type="password"
          placeholder="Enter your password"
          errorText="Password must be longer than 8 characters."
          validators={[VALIDATOR_MINLENGTH(8)]}
          onUpdate={handleFormUpdate}
        />
        {!isLoginMode && (
          <div>
            <CustomInput
              element="input"
              id="firstNameInput"
              defaultContent=""
              defaultValidity={false}
              label="Your first name:"
              type="text"
              placeholder="first name"
              errorText="first name required."
              validators={[VALIDATOR_REQUIRE()]}
              onUpdate={handleFormUpdate}
            />
            <CustomInput
              element="input"
              id="lastNameInput"
              defaultContent=""
              defaultValidity={false}
              label="Your last name:"
              type="text"
              placeholder="last name"
              errorText="last name required"
              validators={[VALIDATOR_REQUIRE()]}
              onUpdate={handleFormUpdate}
            />
          </div>
        )}

        {isLoginMode ? (
          <button type="submit" disabled={!formState.masterValidity}>
            Sign in
          </button>
        ) : (
          <button type="submit" disabled={!formState.masterValidity}>
            Sign up
          </button>
        )}
      </form>
      {isLoginMode ? (
        <button onClick={handleToSignup}>To Sign-up</button>
      ) : (
        <button onClick={handleToLogin}>To Log-in</button>
      )}
    </>
  );
}
