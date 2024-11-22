import dayjs, { Dayjs } from 'dayjs';
import React, { useState, useEffect, useMemo } from 'react';
import cloneDeep from 'lodash/cloneDeep';

import WeekSelector from './components/WeekSelector';
import ReqTopBar from './components/ReqTopBar';
import {
  useFetchReqListQuery,
  Request,
  fetchReqListRes,
} from '../../../store/apiSlices/requestApiSlice';
import { useAppSelector } from '../../../store/storeHooks';
import { Box } from '@mui/material';
import TimeTable from './components/TimeTable';

export interface ArrangedReqList {
  [key: string]: Request[][];
}

export default function RequestManagement() {
  const user = useAppSelector(state => state.user);

  const [startDate, setStartDate] = useState<Dayjs | undefined>();
  const [endDate, setEndDate] = useState<Dayjs | undefined>();

  // Fetching Week Requests
  const { data: fetchReqListData, ...othersFetchReqList } = useFetchReqListQuery(
    {
      supervisor_id: user.uId,
      start_date: startDate?.format('YYYY-MM-DD') as string,
      end_date: endDate?.format('YYYY-MM-DD') as string,
    },
    { skip: !startDate || !endDate, refetchOnMountOrArgChange: true }
  );
  useEffect(() => {
    console.log(`!!! fetched list:`, fetchReqListData);
  }, [fetchReqListData]);

  const arrangedReqList = useMemo(() => {
    if (fetchReqListData) {
      // var newObject = cloneDeep(fetchReqListData);
      var newObject: ArrangedReqList = {};
      Object.entries(fetchReqListData as fetchReqListRes).forEach(([key, values]) => {
        let newList: Request[][] = [[], [], []];
        values.forEach(reqObj => {
          if (reqObj.shift_type == 'morning') {
            newList[0].push(reqObj);
          } else if (reqObj.shift_type == 'afternoon') {
            newList[1].push(reqObj);
          } else {
            newList[2].push(reqObj);
          }
        });
        newObject[key] = newList;
      });
      return newObject;
    }
  }, [fetchReqListData]);
  useEffect(() => {
    console.log('arrangedReqList:', arrangedReqList);
  }, [arrangedReqList]);

  const handleCreateReq = () => {
    console.log('Create Request');
  };

  return (
    <Box
      sx={{
        width: '100%', // !!!!!!!!
        height: '100%', // !!!!!!!!
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        p: '10px',
        // backgroundColor: 'red',
        // border: '2px solid red', // Adds a border with a light grey color
      }}
    >
      <ReqTopBar
        onCreateClick={handleCreateReq}
        onDatesChange={(startDate, endDate) => {
          setStartDate(startDate);
          setEndDate(endDate);
        }}
      />
      <Box
        sx={{
          width: '100%',
          flexGrow: 1,
          overflowY: 'scroll', // !!!!!
          scrollbarWidth: 'none', // !!!
          msOverflowStyle: 'none', // !!!!
          border: '1px solid red', // Adds a border with a light grey color
        }}
      >
        {arrangedReqList && <TimeTable arrangedReqList={arrangedReqList as ArrangedReqList} />}
      </Box>
    </Box>
  );
}
