import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import dayjs, { Dayjs } from 'dayjs';

import { getNextDayToSubmit } from '../../../../shared/utils/weekMethods';
import WeekSelector from './WeekSelector';

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
      <WeekSelector initDate={getNextDayToSubmit()} onDatesChange={handleDatesChange} />
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
