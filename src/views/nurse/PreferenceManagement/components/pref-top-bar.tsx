import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, List } from '@mui/material';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';

import { getNextDayToSubmit, getWeekBounds } from '../../../../shared/utils/weekMethods';

interface PrefTopBarProps {
  isDue: boolean;
  isSubmitted: boolean;
  onDatesChange: (startDate: Dayjs, endDate: Dayjs) => void; // Callback function to update the parent component
}

const PrefTopBar: React.FC<PrefTopBarProps> = ({ isDue, isSubmitted, onDatesChange }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    var initialStartDate = getNextDayToSubmit();
    setSelectedDate(initialStartDate); // Update the selected date if initial start date prop changes
    const { monday, sunday } = getWeekBounds(initialStartDate);
    setStartDate(monday);
    setEndDate(sunday);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const { monday, sunday } = getWeekBounds(selectedDate);
      setStartDate(monday);
      setEndDate(sunday);

      onDatesChange(monday, sunday); // Update the parent component when start date changes
    }
  }, [selectedDate]);

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
        padding: '0px 5px 2px 5px',
      }}
    >
      <Box
        sx={{
          padding: '0px 12px', // Slightly reduce padding for a smaller component
          backgroundColor: isDue ? 'error.light' : 'success.light', // Uses the theme's paper background color
          border: '1px solid', // Maintains a simple border
          borderColor: 'divider', // Uses the theme's divider color for consistency
          borderRadius: '4px', // Keeps the corners rounded
          boxShadow: 1, // Adds a subtle shadow for depth
          display: 'flex', // Keeps the layout flexible
          alignItems: 'center', // Centers the text vertically
          width: 'fit-content', // Adjusts width to the content size
          height: '45px',
        }}
      >
        <Typography
          component="h2"
          variant="subtitle2" // Smaller text size variant
          sx={{
            fontWeight: isSubmitted ? 'bold' : 'regular', // Conditionally bolds the text based on submission status
          }}
        >
          <List>
            <li>{'Status: '}</li>
            <li>{isDue ? 'Due' : 'Open to submit'}</li>
          </List>
        </Typography>
      </Box>
      <Box>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Starting date"
            value={startDate}
            onChange={newValue => setSelectedDate(newValue)}
            slotProps={{ textField: { size: 'small' } }}
          />
          <DatePicker
            label="Ending date"
            value={endDate}
            disabled
            slotProps={{ textField: { size: 'small' } }}

            //   onChange={newValue => setSelectedDate(newValue)}
          />
        </LocalizationProvider>
      </Box>
      {/* <Typography
        component="h2"
        variant="h6"
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 'inherit', // Make Typography take full height of its container
        }}
      >
        {`you ${isSubmitted ? 'HAVE' : 'have NOT'} submitted before`}
      </Typography> */}
      <Box
        sx={{
          padding: '0px 12px', // Slightly reduce padding for a smaller component
          backgroundColor: isSubmitted ? 'success.light' : '#e0e0df', // Uses the theme's paper background color
          border: '1px solid', // Maintains a simple border
          borderColor: 'divider', // Uses the theme's divider color for consistency
          borderRadius: '4px', // Keeps the corners rounded
          boxShadow: 1, // Adds a subtle shadow for depth
          display: 'flex', // Keeps the layout flexible
          alignItems: 'center', // Centers the text vertically
          width: 'fit-content', // Adjusts width to the content size
          height: '45px',
        }}
      >
        <Typography
          component="h2"
          variant="subtitle2" // Smaller text size variant
          sx={{
            fontWeight: isSubmitted ? 'bold' : 'regular', // Conditionally bolds the text based on submission status
          }}
        >
          {`${isSubmitted ? 'Submitted' : 'No Submission'}`}
        </Typography>
      </Box>
    </Box>
  );
};

export default PrefTopBar;
