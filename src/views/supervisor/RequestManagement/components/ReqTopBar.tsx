import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';

import WeekSelector from './WeekSelector';
function getNextWeekToSubmit(): dayjs.Dayjs {
  const today = dayjs();
  const dayOfWeek = today.day(); // day() returns the day of the week where Sunday is 0 and Saturday is 6
  const daysUntilNextMonday = (dayOfWeek === 0 ? 1 : 8 - dayOfWeek) % 7;
  return today.add(daysUntilNextMonday + 7, 'day');
}

interface ReqTopBarProps {
  onDatesChange: (startDate: Dayjs, endDate: Dayjs) => void;
  onCreateClick: () => void;
}
const ReqTopBar: React.FC<ReqTopBarProps> = ({ onDatesChange, onCreateClick }) => {
  const handleDatesChange = (startDate: Dayjs, endDate: Dayjs) => {
    onDatesChange(startDate, endDate);
  };
  return (
    <Box
      sx={{
        width: '100%',
        // height: '50px',
        height: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignContent: 'center',
        borderBottom: 'solid 1px #475862',
        padding: '1px 8px 3px 8px',
      }}
    >
      <WeekSelector initDate={getNextWeekToSubmit()} onDatesChange={handleDatesChange} />
      <Button
        onClick={onCreateClick}
        variant="outlined"
        startIcon={<EditCalendarIcon />}
        sx={{ maxHeight: '50px' }}
      >
        Create New
      </Button>
    </Box>
  );
};

export default ReqTopBar;
