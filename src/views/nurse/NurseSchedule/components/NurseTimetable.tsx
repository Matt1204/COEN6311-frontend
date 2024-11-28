import React, { useMemo } from 'react';
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

import { ArrangedNurShiftList } from '../NurseSchedule';
import { FetchNurShiftListRes, NurseShift } from '../../../../store/apiSlices/nurScheduleApiSlice';

interface NurseTimetableProps {
  fetchNurShiftList: FetchNurShiftListRes;
}

const NurseTimetable: React.FC<NurseTimetableProps> = ({ fetchNurShiftList }) => {
  const arrangedNurShifts = useMemo(() => {
    if (fetchNurShiftList) {
      var newObject: ArrangedNurShiftList = {};

      Object.entries(fetchNurShiftList as FetchNurShiftListRes).forEach(([key, values]) => {
        // let newList: NurseShift[] = [{}, {}, {}];
        // let newList = [{}, {}, {}];
        let newList: NurseShift[] = [{} as NurseShift, {} as NurseShift, {} as NurseShift];
        values.forEach(shiftObj => {
          if (shiftObj.shift_type == 'morning') {
            newList[0] = shiftObj;
          } else if (shiftObj.shift_type == 'afternoon') {
            newList[1] = shiftObj;
          } else {
            newList[2] = shiftObj;
          }
        });
        newObject[key] = newList;
      });
      console.log('arrangedNurShiftList:', newObject);

      return newObject;
    }
  }, [fetchNurShiftList]);

  return (
    <>
      {arrangedNurShifts && (
        <Box
          id="tableContainer"
          sx={{
            width: '100%',
            height: '100%',
            overflow: 'auto',
            display: 'flex',
            // backgroundColor: 'grey',
          }}
        >
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
            {Object.keys(arrangedNurShifts).map((dateStr, index) => {
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
                    {arrangedNurShifts[dateStr].map((shiftObject, shiftObjectIndex) => {
                      return (
                        <Box
                          id={'tableBodyCell'}
                          key={shiftObjectIndex}
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
                          {Object.keys(shiftObject).length ? (
                            <Paper
                              sx={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: '#fcfcfa',
                                // backgroundColor: 'grey',
                                // minHeight: '200px',
                                border: '1px  solid #000', // border style
                                p: '4px 0',
                              }}
                              elevation={4}
                            >
                              <Box
                                id="chipsContainer"
                                sx={{
                                  width: '100%',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  p: '4px 4px',
                                }}
                              >
                                <Chip
                                  sx={{ marginBottom: '5px' }}
                                  label={`${shiftObject.hospital_name} `}
                                  //   icon={<Groups3TwoToneIcon />}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                                <Chip
                                  sx={{ marginBottom: '5px' }}
                                  label={`${shiftObject.hours_per_shift} hours`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                                <Chip
                                  label={`${shiftObject.hospital_address}`}
                                  sx={{ marginBottom: '5px' }}
                                  //   icon={<Groups3TwoToneIcon />}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                                <Chip
                                  label={`${shiftObject.hospital_hotline}`}
                                  sx={{ marginBottom: '5px' }}
                                  //   icon={<Groups3TwoToneIcon />}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              </Box>
                            </Paper>
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
        </Box>
      )}
    </>
  );
};

export default NurseTimetable;
