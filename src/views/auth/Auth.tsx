import React, { useState, useEffect } from 'react';
import CustomInput from './components/CustomInput';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from '../../shared/utils/validators';
import { useFormReducer, State } from '../../shared/utils/useFormReducer'; // Update the import path as needed
import useHttpHook from '../../shared/utils/useHttpHook';
import { logIn } from '../../store/userSlice';
import { useAppDispatch } from '../../store/storeHooks';
import { useNavigate } from 'react-router-dom';

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

  const handleFormUpdate = (id: string, content: string, validity: boolean) => {
    formDispatch({ type: 'UPDATE', payload: { id, content, validity } });
  };
  const handleToSignup = () => {
    formDispatch({
      type: 'ADD_INPUT',
      payload: { id: 'nameInput', content: '', validity: false },
    });
    setIsLoginMode(false);
  };
  const handleToLogin = () => {
    formDispatch({
      type: 'REMOVE_INPUT',
      payload: { id: 'nameInput', content: '', validity: false },
    });
    setIsLoginMode(true);
  };

  useEffect(() => {
    console.log('Form State Updated:', formState);
  }, [formState.inputs, formState.masterValidity]);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let url: string;
    let postData;
    let header;
    if (isLoginMode) {
      // login
      url = '/user-dummy-data.json';
      //   postData = {
      //     email: ,
      //     password: ,
      //   };
      //   postData = JSON.stringify(postData);
      //   header = { 'Content-Type': 'application/json' };
    } else {
      // signup
      url = '/user-dummy-data.json';
      //   postData = new FormData();
      //   postData.append()
      //   header = { 'Content-Type': 'multipart/form-data' };
    }
    try {
      //   const res = await httpRequest(url, postData, 'POST', header);
      const res = await httpRequest(url, null, 'GET', {}); // Fetching all users from the dummy data
      let loginUser = res.users.find((user: DummyUserType) => {
        return user.email === formState.inputs.emailInput.content;
      });
      if (loginUser) {
        const { password, ...payload } = loginUser;
        console.log(payload);
        dispatch(logIn(payload));
        navigate('/home');
      }

      console.log(res);
    } catch (error) {
      // console.log(`Caught error submitting request: ${error}`);
      console.error(error);
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
          <CustomInput
            element="input"
            id="nameInput"
            defaultContent=""
            defaultValidity={false}
            label="Your name (label)"
            type="text"
            placeholder="Enter your name"
            errorText="Name is required."
            validators={[VALIDATOR_REQUIRE()]}
            onUpdate={handleFormUpdate}
          />
        )}
        {isLoginMode ? (
          <button onClick={handleToSignup}>To Sign-up</button>
        ) : (
          <button onClick={handleToLogin}>To Log-in</button>
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
    </>
  );
}
