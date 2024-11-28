import { useState } from 'react';
import { Box } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

import WeekSelector from '../RequestManagement/components/WeekSelector';
import { useAppSelector } from '../../../store/storeHooks';
import { useFetchHosShiftsQuery } from '../../../store/apiSlices/hosScheduleApiSlice';
import { useFetchUserQuery } from '../../../store/apiSlices/userApiSlice';
import HospitalTimetable from './components/HospitalTimeTable';

function getThisMonday(): dayjs.Dayjs {
  const today = dayjs();
  const dayOfWeek = today.day();
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  return today.add(daysToMonday, 'day').startOf('day');
}

export default function HospitalSchedule() {
  const userSlice = useAppSelector(state => state.user);
  // handling starting and ending date
  const [startDate, setStartDate] = useState<Dayjs | undefined>();
  const [endDate, setEndDate] = useState<Dayjs | undefined>();

  const { data: fetchedUserInfo, ...othersFetchUser } = useFetchUserQuery(userSlice.email, {
    refetchOnMountOrArgChange: true,
  });
  // const { data: fetchHosShifts, ...othersFetchHosShifts } =
  const { data: fetchedHosShifts, ...othersFetchHosShifts } = useFetchHosShiftsQuery(
    {
      hospital_id: fetchedUserInfo?.data.hospital_id as number,
      start_date: startDate?.format('YYYY-MM-DD') as string,
      end_date: endDate?.format('YYYY-MM-DD') as string,
    },
    {
      skip: !fetchedUserInfo?.data.hospital_id || !(startDate || endDate),
      refetchOnMountOrArgChange: true,
    }
  );

  return (
    <>
      <Box
        sx={{
          width: '100%', // !!!!!!!!
          height: '100%', // !!!!!!!!
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          p: '10px 7px 3px 5px',
          // backgroundColor: 'red',
          // border: '2px solid red', // Adds a border with a light grey color
        }}
      >
        <Box
          sx={{
            width: '100%',
            // height: '50px',
            height: 'auto',
            display: 'flex',
            justifyContent: 'start',
            alignContent: 'center',
            borderBottom: 'solid 1px #475862',
            padding: '1px 8px 3px 8px',
          }}
        >
          <WeekSelector
            initDate={getThisMonday()}
            onDatesChange={(startDate, endDate) => {
              setStartDate(startDate);
              setEndDate(endDate);
            }}
          />
        </Box>
        <Box
          sx={{
            width: '100%',
            flexGrow: 1,
            overflowY: 'scroll', // !!!!!
            scrollbarWidth: 'none', // !!!
            msOverflowStyle: 'none', // !!!!
            border: '1px solid black', // Adds a border with a light grey color
          }}
        >
          {fetchedHosShifts && <HospitalTimetable fetchedHosShifts={fetchedHosShifts} />}
        </Box>
      </Box>
    </>
  );
}
