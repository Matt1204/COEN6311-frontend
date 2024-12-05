import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Chip,
  Menu,
  MenuItem,
  Divider,
  ListItemText,
  ListItemIcon,
  Typography,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import LightModeIcon from '@mui/icons-material/LightMode';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import SavedSearchIcon from '@mui/icons-material/SavedSearch';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ScheduleTwoToneIcon from '@mui/icons-material/ScheduleTwoTone';
import Groups3TwoToneIcon from '@mui/icons-material/Groups3TwoTone';
import SchoolTwoToneIcon from '@mui/icons-material/SchoolTwoTone';

import { FetchHosShiftsRes, HospitalShift } from '../../../../store/apiSlices/hosScheduleApiSlice';
import HospitalShiftModal from './HospitalShiftModal';

export interface ArrangedHosShift {
  [key: string]: HospitalShift[][];
}
interface HospitalTimetableProps {
  fetchedHosShifts: FetchHosShiftsRes;
}

const HospitalTimetable: React.FC<HospitalTimetableProps> = ({ fetchedHosShifts }) => {
  const arrangedHosShifts = useMemo(() => {
    if (fetchedHosShifts) {
      // var newObject = cloneDeep(fetchReqListData);
      var newObject: ArrangedHosShift = {};
      Object.entries(fetchedHosShifts as FetchHosShiftsRes).forEach(([key, values]) => {
        let newList: HospitalShift[][] = [[], [], []];
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
  }, [fetchedHosShifts]);

  useEffect(() => {
    if (arrangedHosShifts) {
      console.log('arrangedHosShifts:', arrangedHosShifts);
    }
  }, [fetchedHosShifts]);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [clcikedItemId, setClickedItemId] = useState<number | null>(null);

  const handleItemClick = (event: React.MouseEvent<HTMLDivElement>, itemId: number) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setClickedItemId(itemId);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [shiftModalVisible, setShiftModalVisible] = useState(false);
  const [shiftModalReqId, setShiftModalReqId] = useState<undefined | number>();
  const handleViewShift = (request_id: number) => {
    setShiftModalReqId(request_id);
    setShiftModalVisible(true);
  };
  const handleShiftModalClose = () => {
    setShiftModalVisible(false);
    setShiftModalReqId(undefined);
  };
  return (
    <>
      {shiftModalVisible && shiftModalReqId && (
        <HospitalShiftModal
          visible={shiftModalVisible}
          requestId={shiftModalReqId}
          onCloseModal={handleShiftModalClose}
        />
      )}
      <Box
        id="tableContainer"
        sx={{ width: '100%', height: '100%', overflow: 'auto', display: 'flex' }}
      >
        {arrangedHosShifts && (
          <>
            <Box
              id={`leftCol`}
              sx={{
                // flex: '1',
                // display: 'inline-block', // This could also be 'block' since 'flex' container is taking care of the layout
                display: 'flex',
                flexDirection: 'column',
                // width: '130px', // Fixed width for each column
                // height: '1000px',
                // minWidth: '110px',
                // width: '35px',
                height: '100%',
                flexShrink: 0, // Prevents the column from shrinking
                // backgroundColor: '#e0ecfc',
              }}
            >
              <Box
                id={`leftColTop`}
                sx={{
                  width: '100%',
                  height: '30px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignContent: 'center',
                  border: '1px solid rgba(0, 0, 0, 0.23)',
                }}
              ></Box>
              <Box
                id={`indicate`}
                sx={{
                  width: '100%',
                  flex: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  // width: 'inherit',
                  height: '100%',
                  // backgroundColor: '#e0ecfc',
                }}
              >
                <Box
                  sx={{
                    flex: '1',
                    display: 'flex',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: 'inherit',
                    border: '1px solid rgba(0, 0, 0, 0.23)',
                    p: '0 3px',
                    backgroundColor: '#e0ecfc',
                  }}
                >
                  <Box sx={{ alignContent: 'center' }}>
                    <LightModeIcon />
                  </Box>
                </Box>
                <Box
                  sx={{
                    flex: '1',
                    display: 'flex',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: 'inherit',
                    border: '1px solid rgba(0, 0, 0, 0.23)',
                    backgroundColor: '#e0ecfc',
                    p: '0 3px',
                  }}
                >
                  <Box sx={{ alignContent: 'center' }}>
                    <WbTwilightIcon />
                  </Box>
                </Box>
                <Box
                  sx={{
                    flex: '1',
                    display: 'flex',
                    justifyContent: 'center',
                    alignContent: 'center',
                    width: 'inherit',
                    border: '1px solid rgba(0, 0, 0, 0.23)',
                    backgroundColor: '#e0ecfc',
                    p: '0 3px',
                  }}
                >
                  <Box sx={{ alignContent: 'center' }}>
                    <Brightness4Icon />
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box
              id="tableBodyContainer"
              sx={{
                flex: '1',
                display: 'flex', // Elements are placed in a row
                flexDirection: 'row', // This is the default but added for clarity
                //   width: 'auto', // Auto width to contain all columns
                height: '100%',
                // backgroundColor: 'grey',
              }}
            >
              {Object.keys(arrangedHosShifts).map((dateStr, index) => {
                return (
                  <Box
                    id={`tableColumn-${index}`}
                    key={index}
                    sx={{
                      flex: '1',
                      // display: 'inline-block', // This could also be 'block' since 'flex' container is taking care of the layout
                      display: 'flex',
                      flexDirection: 'column',
                      // width: '130px', // Fixed width for each column
                      // height: '1000px',
                      minWidth: '110px',
                      height: '100%',
                      flexShrink: 0, // Prevents the column from shrinking
                    }}
                  >
                    <Box
                      id={`tableHeaderCell-${index}`}
                      sx={{
                        width: 'inherit',
                        height: '30px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',
                        backgroundColor: '#e0ecfc',
                        border: '1px solid rgba(0, 0, 0, 0.23)',
                      }}
                    >
                      <Typography variant="subtitle1">{dateStr}</Typography>
                    </Box>
                    <Box
                      id={`bodyColumContainer-${index}`}
                      sx={{
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        width: 'inherit',
                        height: '100%',
                        //   backgroundColor: 'grey',
                      }}
                    >
                      {arrangedHosShifts[dateStr].map((timeOfDayList, timeOfDayListIndex) => {
                        return (
                          <Box
                            key={timeOfDayListIndex}
                            sx={{
                              flex: '1',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'start',
                              width: 'inherit',
                              p: '10px 6px',
                              // height: '50px',
                              border: '1px solid rgba(0, 0, 0, 0.23)',
                              overflowY: 'scroll',
                              scrollbarWidth: 'none', // !!!
                              msOverflowStyle: 'none', // !!!!
                            }}
                          >
                            {timeOfDayList.length ? (
                              timeOfDayList.map((shiftObject, shiftObjectIdx) => {
                                return (
                                  <Box key={shiftObjectIdx}>
                                    <Box
                                      id={`reqObjContainer-${shiftObjectIdx}`}
                                      sx={{
                                        marginBottom: '15px',
                                        '&:hover': {
                                          boxShadow: '8px 8px 20px rgba(0, 0, 0, 0.2)',
                                        },
                                        cursor: 'pointer',
                                      }}
                                      onClick={e => {
                                        handleItemClick(e, shiftObject.request_id);
                                      }}
                                    >
                                      <Paper
                                        sx={{
                                          width: '100%',
                                          backgroundColor: '#fcfcfa',
                                          border: '1px  solid #000',
                                          p: '4px 0',
                                        }}
                                        elevation={4}
                                      >
                                        <Box
                                          sx={{
                                            width: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            p: '4px 4px',
                                          }}
                                        >
                                          <Chip
                                            sx={{ marginBottom: '1px' }}
                                            label={` ${shiftObject.actual_nurse_num}/${shiftObject.request_nurse_num} nurses`}
                                            icon={<Groups3TwoToneIcon />}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                          />
                                          <Chip
                                            sx={{ marginBottom: '1px' }}
                                            label={`${shiftObject.hours_per_shift} hours`}
                                            // onClick={handleClick}
                                            // onDelete={handleDelete}
                                            icon={<ScheduleTwoToneIcon />}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                          />
                                          <Chip
                                            sx={{ marginBottom: '1px' }}
                                            label={`seniority ${shiftObject.min_seniority}`}
                                            // onClick={handleClick}
                                            // onDelete={handleDelete}
                                            icon={<SchoolTwoToneIcon />}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                          />
                                          <Chip
                                            sx={{
                                              marginBottom: '1px',
                                              height: 'auto', // Allow the height to adjust automatically
                                              whiteSpace: 'normal', // Allow text to wrap to multiple lines
                                              wordWrap: 'break-word', // Ensure long words break properly
                                              // padding: '4px', // Add padding for better spacing
                                            }}
                                            label={`posted by ${shiftObject.supervisor_email}`}
                                            // onClick={handleClick}
                                            // onDelete={handleDelete}
                                            // icon={<SchoolTwoToneIcon />}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                          />
                                        </Box>
                                      </Paper>
                                    </Box>
                                    <Menu
                                      id="basic-menu"
                                      anchorEl={anchorEl}
                                      // open={Boolean(anchorEl)}
                                      open={!!anchorEl}
                                      onClose={handleMenuClose}
                                      MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                      }}
                                      sx={{
                                        '& .MuiPaper-root': {
                                          backgroundColor: '#ffffff',
                                          boxShadow: '0px 2px 3px rgba(0,0,0,0.05)',
                                          borderRadius: 4,
                                          minWidth: 150,
                                          border: '1px solid #b0b0af',
                                        },
                                      }}
                                      anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                      }}
                                      transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                      }}
                                    >
                                      <MenuItem
                                        onClick={() => {
                                          setAnchorEl(null);
                                          // onViewItem(clcikedItemId as number);
                                          handleViewShift(clcikedItemId as number);
                                        }}
                                      >
                                        <ListItemIcon>
                                          <SavedSearchIcon fontSize="small" />
                                        </ListItemIcon>
                                        <ListItemText>Detail</ListItemText>
                                      </MenuItem>
                                      <Divider />
                                    </Menu>
                                  </Box>
                                );
                              })
                            ) : (
                              <Chip
                                label={`No Shift`}
                                sx={{ marginBottom: '5px' }}
                                //   icon={<Groups3TwoToneIcon />}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </>
        )}
      </Box>
    </>
  );
};

export default HospitalTimetable;
