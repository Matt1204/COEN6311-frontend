import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, { Dayjs } from 'dayjs';
import { Box, Typography, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';

function getNextWeekToSubmit(): dayjs.Dayjs {
  const today = dayjs();
  const dayOfWeek = today.day(); // day() returns the day of the week where Sunday is 0 and Saturday is 6
  const daysUntilNextMonday = (dayOfWeek === 0 ? 1 : 8 - dayOfWeek) % 7;
  return today.add(daysUntilNextMonday + 7, 'day');
}

function getWeekBounds(date: dayjs.Dayjs): { monday: dayjs.Dayjs; sunday: dayjs.Dayjs } {
  // Calculate the difference to Monday (1 - day()) where Monday is 1 and Sunday is 0
  const diffToMonday = date.day() === 0 ? -6 : 1 - date.day();
  const monday = date.add(diffToMonday, 'day');

  // Sunday is always 6 days after Monday
  const sunday = monday.add(6, 'days');

  return { monday, sunday };
}

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
