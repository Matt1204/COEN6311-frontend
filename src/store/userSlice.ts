import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type LoginParams = {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  accessToken: string;
};

type UserState = LoginParams & {
  accessToken: string;
};

const initialState: UserState = {
  email: '',
  firstName: '',
  lastName: '',
  role: '',
  accessToken: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<LoginParams>) => {
      const { email, firstName, lastName, accessToken, role } = action.payload;
      state.email = email;
      state.firstName = firstName;
      state.lastName = lastName;
      state.role = role;
      state.accessToken = accessToken;
    },
    removeUser: state => {
      state.email = '';
      state.firstName = '';
      state.lastName = '';
      state.role = '';
      // state.phoneNumber = '';
      state.accessToken = '';
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
