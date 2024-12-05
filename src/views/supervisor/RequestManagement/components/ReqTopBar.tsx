import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, List } from '@mui/material';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import dayjs, { Dayjs } from 'dayjs';

import { getNextDayToSubmit } from '../../../../shared/utils/weekMethods';
import WeekSelector from './WeekSelector';

interface ReqTopBarProps {
  onDatesChange: (startDate: Dayjs, endDate: Dayjs) => void;
  onCreateClick: () => void;
  isDue: boolean;
}
const ReqTopBar: React.FC<ReqTopBarProps> = ({ onDatesChange, onCreateClick, isDue }) => {
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
      <Box sx={{ display: 'flex', justifyContent: 'start', height: '45px' }}>
        <WeekSelector initDate={getNextDayToSubmit()} onDatesChange={handleDatesChange} />
        <Box
          sx={{
            padding: '5px 12px', // Slightly reduce padding for a smaller component
            backgroundColor: isDue ? 'error.light' : 'success.light', // Uses the theme's paper background color
            border: '1px solid', // Maintains a simple border
            borderColor: 'divider', // Uses the theme's divider color for consistency
            borderRadius: '4px', // Keeps the corners rounded
            boxShadow: 1, // Adds a subtle shadow for depth
            display: 'flex', // Keeps the layout flexible
            alignItems: 'center', // Centers the text vertically
            width: 'fit-content', // Adjusts width to the content size
            height: '39px',
            ml: '5px',
          }}
        >
          <Typography
            component="h2"
            variant="subtitle2" // Smaller text size variant
            sx={{
              fontWeight: isDue ? 'bold' : 'regular', // Conditionally bolds the text based on submission status
            }}
          >
            <List>
              <li>{'Status: '}</li>
              <li>{isDue ? 'Due' : 'Open to submit'}</li>
            </List>
          </Typography>
        </Box>
      </Box>
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
