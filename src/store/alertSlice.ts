import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { AlertColor } from '@mui/material/Alert';
// Define a custom type that includes only the allowed values
type SeverityType = AlertColor | undefined;

type Payload = {
  msg: string;
  severity?: SeverityType;
};

type Alert = {
  visible: boolean;
  msg: string;
  severity: SeverityType;
};

const initialState: Alert = {
  visible: false,
  msg: '',
  severity: 'info',
};

export const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    showAlert: (state, action: PayloadAction<Payload>) => {
      const { msg, severity = 'info' } = action.payload;
      state.visible = true;
      state.msg = msg;
      state.severity = severity;
    },
    closeAlert: state => {
      state.visible = false;
      state.msg = '';
      // state.severity = 'info';
    },
  },
});

export const { showAlert, closeAlert } = alertSlice.actions;
