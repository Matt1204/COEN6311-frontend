import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from './userSlice';
import { apiSlice } from './apiSlice';
import { alertSlice } from './alertSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    user: userSlice.reducer,
    alert: alertSlice.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
