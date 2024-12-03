import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { Box, Typography, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { getWeekBounds } from '../../../../shared/utils/weekMethods';

interface WeekSelectorProps {
  initDate: Dayjs;
  onDatesChange: (startDate: Dayjs, endDate: Dayjs) => void;
}

const WeekSelector: React.FC<WeekSelectorProps> = ({ initDate, onDatesChange }) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(initDate);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    if (selectedDate) {
      const { monday, sunday } = getWeekBounds(selectedDate);
      setStartDate(monday);
      setEndDate(sunday);

      onDatesChange(monday, sunday); // Update the parent component when start date changes
    }
  }, [selectedDate]);

  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Starting date"
          value={startDate}
          onChange={newValue => setSelectedDate(newValue)}
          displayWeekNumber
          slotProps={{ textField: { size: 'small' } }}
        />
        <DatePicker
          label="Ending date"
          value={endDate}
          disabled
          slotProps={{ textField: { size: 'small' } }}

          //   sx={{ height: '15px' }}
          //   onChange={newValue => setSelectedDate(newValue)}
        />
      </LocalizationProvider>
    </Box>
  );
};

export default WeekSelector;
