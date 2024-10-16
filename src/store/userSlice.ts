import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type UserState = {
  uid: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

const initialState: UserState = {
  uid: '',
  email: '',
  role: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logIn: (state, action: PayloadAction<UserState>) => {
      const { uid, email, role, firstName, lastName, phoneNumber } =
        action.payload;
      state.uid = uid;
      state.email = email;
      state.role = role;
      state.firstName = firstName;
      state.lastName = lastName;
      state.phoneNumber = phoneNumber;
    },
    logOut: state => {
      state.uid = '';
      state.email = '';
      state.role = '';
      state.firstName = '';
      state.lastName = '';
      state.phoneNumber = '';
    },
  },
});

export const { logIn, logOut } = userSlice.actions;
