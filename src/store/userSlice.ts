import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type LoginParams = {
  email: string;
  // role: string;
  firstName: string;
  lastName: string;
};

type UserState = LoginParams & {
  isAuthenticated: boolean;
};

const initialState: UserState = {
  email: '',
  // role: '',
  firstName: '',
  lastName: '',
  // phoneNumber: '',
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<LoginParams>) => {
      const { email, firstName, lastName } = action.payload;
      state.email = email;
      state.firstName = firstName;
      state.lastName = lastName;
      // state.role = role;
      state.isAuthenticated = true;
    },
    removeUser: state => {
      state.email = '';
      state.firstName = '';
      state.lastName = '';
      // state.role = '';
      // state.phoneNumber = '';
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
