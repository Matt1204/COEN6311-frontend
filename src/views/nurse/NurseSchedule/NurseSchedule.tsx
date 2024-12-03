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
import { getThisMonday } from '../../../shared/utils/weekMethods';

export interface ArrangedNurShiftList {
  [key: string]: NurseShift[];
}

interface NurseScheduleProps {
  propUid?: number;
}

export default function NurseSchedule({ propUid }: NurseScheduleProps) {
  // Initialize the nurse to view
  const userSliceUid = useAppSelector(state => state.user.uId);

  const [nurseId, setNurseId] = useState<number | null>(null);
  useEffect(() => {
    setNurseId(propUid ? propUid : userSliceUid);
  }, [propUid]);

  // handling starting and ending date
  const [startDate, setStartDate] = useState<Dayjs | undefined>();
  const [endDate, setEndDate] = useState<Dayjs | undefined>();

  const { data: fetchNurShiftList, ...othersFetchNurShiftList } = useFetchNurShiftListQuery(
    {
      nurse_id: nurseId as number,
      start_date: startDate?.format('YYYY-MM-DD') as string,
      end_date: endDate?.format('YYYY-MM-DD') as string,
    },
    { skip: !(startDate || endDate || nurseId), refetchOnMountOrArgChange: true }
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
          p: '6px 7px 3px 5px',
          // backgroundColor: 'red',
          border: '1px solid #000', // Adds a border with a light grey color
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
            // border: '1px solid black', // Adds a border with a light grey color
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
