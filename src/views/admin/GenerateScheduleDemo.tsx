import React, { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import WeekSelector from '../supervisor/RequestManagement/components/WeekSelector';
import { getNextDayToSubmit } from '../../shared/utils/weekMethods';
import { Box, Button } from '@mui/material';
import { useGenerateScheduleDemoMutation } from '../../store/apiSlices/apiSlice';
import { useAppDispatch } from '../../store/storeHooks';
import { showAlert } from '../../store/alertSlice';

const GenerateScheduleDemo: React.FC = () => {
  const dispatch = useAppDispatch();
  const [generateSchedule, { ...others }] = useGenerateScheduleDemoMutation();
  const [startDate, setStartDate] = useState<Dayjs | undefined>();
  const [endDate, setEndDate] = useState<Dayjs | undefined>();

  const handleGenerate = async () => {
    if (startDate) {
      try {
        const start = startDate?.format('YYYY-MM-DD');
        const end = endDate?.format('YYYY-MM-DD');
        console.log(start);
        console.log(end);
        let res = await generateSchedule({ start_date: start as string }).unwrap;
        dispatch(
          showAlert({ msg: `schedule generated from ${start} to ${end}`, severity: 'success' })
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        flexGrow: '1',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <WeekSelector
        initDate={getNextDayToSubmit()}
        onDatesChange={(startDate, endDate) => {
          setStartDate(startDate);
          setEndDate(endDate);
        }}
      />
      <Button onClick={handleGenerate} variant="contained" color="primary" sx={{ mt: '20px' }}>
        {'Generate Schedule'}
      </Button>
    </Box>
  );
};

export default GenerateScheduleDemo;
