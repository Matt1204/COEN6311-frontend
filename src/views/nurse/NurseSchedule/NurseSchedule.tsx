import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../../../store/storeHooks';
import { Box } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';

import WeekSelector from '../../supervisor/RequestManagement/components/WeekSelector';
import {
  useFetchNurShiftListQuery,
  FetchNurShiftListRes,
  NurseShift,
} from '../../../store/apiSlices/nurScheduleApiSlice';
import NurseTimetable from './components/NurseTimetable';
import { fetchReqListRes } from '../../../store/apiSlices/requestApiSlice';

function getThisMonday(): dayjs.Dayjs {
  const today = dayjs();
  const dayOfWeek = today.day();
  const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  return today.add(daysToMonday, 'day').startOf('day');
}

export interface ArrangedNurShiftList {
  [key: string]: NurseShift[];
}

export default function NurseSchedule() {
  // Initialize the nurse to view
  const userSlice = useAppSelector(state => state.user);

  // handling starting and ending date
  const [startDate, setStartDate] = useState<Dayjs | undefined>();
  const [endDate, setEndDate] = useState<Dayjs | undefined>();

  const { data: fetchNurShiftList, ...othersFetchNurShiftList } = useFetchNurShiftListQuery(
    {
      nurse_id: userSlice.uId,
      start_date: startDate?.format('YYYY-MM-DD') as string,
      end_date: endDate?.format('YYYY-MM-DD') as string,
    },
    { skip: !(startDate || endDate), refetchOnMountOrArgChange: true }
  );
  // useEffect(() => {
  //   if (fetchNurShiftList) {
  //     console.log('nurseShiftList:', fetchNurShiftList);
  //   }
  // }, [fetchNurShiftList]);

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
          {fetchNurShiftList && (
            <NurseTimetable fetchNurShiftList={fetchNurShiftList as FetchNurShiftListRes} />
          )}
        </Box>
      </Box>
    </>
  );
}
