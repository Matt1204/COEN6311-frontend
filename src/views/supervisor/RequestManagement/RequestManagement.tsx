import dayjs, { Dayjs } from 'dayjs';
import { useState, useEffect, useMemo } from 'react';

import ReqTopBar from './components/ReqTopBar';
import {
  useFetchReqListQuery,
  Request,
  fetchReqListRes,
} from '../../../store/apiSlices/requestApiSlice';
import { useAppSelector } from '../../../store/storeHooks';
import { Box } from '@mui/material';
import RequestTimetable from './components/RequestTimetable';
import RequestModal from './components/RequestModal';

export interface ArrangedReqList {
  [key: string]: Request[][];
}

export default function RequestManagement() {
  const user = useAppSelector(state => state.user);

  const [startDate, setStartDate] = useState<Dayjs | undefined>();
  const [endDate, setEndDate] = useState<Dayjs | undefined>();

  // Fetching Week Requests Data
  const { data: fetchReqListData, ...othersFetchReqList } = useFetchReqListQuery(
    {
      supervisor_id: user.uId,
      start_date: startDate?.format('YYYY-MM-DD') as string,
      end_date: endDate?.format('YYYY-MM-DD') as string,
    },
    { skip: !startDate || !endDate, refetchOnMountOrArgChange: true }
  );
  // useEffect(() => {
  //   console.log(`!!! fetched list:`, fetchReqListData);
  // }, [fetchReqListData]);

  // Preparing Data for TimeTable
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
  const isDue = useMemo(() => {
    if (startDate) {
      const today = dayjs();
      const dayOfWeek = today.day();
      const daysSinceMonday = (dayOfWeek + 6) % 7; // Adjust to make Monday (1) the start of the week, thus Monday will be 0
      const currentMonday = today.subtract(daysSinceMonday, 'day');
      const twoWeeksFromMonday = currentMonday.add(13, 'day');
      // return twoWeeksFromMonday.isBefore(startDate);
      return startDate.isBefore(twoWeeksFromMonday);
    }
  }, [startDate]);

  // Modal Logic
  const [reqModalVisible, setReqModalVisible] = useState(false);
  const [reqModalEditable, setReqModalEditable] = useState(false);
  const [reqModalReqId, setReqModalReqId] = useState<number | undefined>();
  // Close Modal
  const handleModalClose = () => {
    setReqModalVisible(false);
  };
  // Create Request Modal
  const handleCreateReq = () => {
    setReqModalEditable(true);
    setReqModalReqId(undefined);

    setReqModalVisible(true);
  };
  // View Request Modal
  const handleViewReq = (requestId: number) => {
    setReqModalEditable(false);
    setReqModalReqId(requestId);
    console.log('View: ', requestId);

    setReqModalVisible(true);
  };
  // Edit Request Modal
  const handleEditReq = (requestId: number) => {
    setReqModalEditable(true);
    setReqModalReqId(requestId);
    console.log('Edit: ', requestId);

    setReqModalVisible(true);
  };
  // Delete Request
  const handleDeleteReq = (requestId: number) => {};

  return (
    <>
      {reqModalVisible && (
        <RequestModal
          visible={reqModalVisible}
          editMode={reqModalEditable}
          requestId={reqModalReqId}
          onCloseModal={handleModalClose}
        />
      )}

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
            // border: '1px solid black', // Adds a border with a light grey color
          }}
        >
          {arrangedReqList && (
            <RequestTimetable
              arrangedReqList={arrangedReqList as ArrangedReqList}
              onViewItem={handleViewReq}
              onEditItem={handleEditReq}
              onDeleteItem={handleDeleteReq}
              isDue={isDue as boolean}
            />
          )}
        </Box>
      </Box>
    </>
  );
}
