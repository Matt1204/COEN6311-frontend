import React, { useState, useEffect } from 'react';

import { ArrangedReqList } from '../RequestManagement';
import { Box, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import ScheduleTwoToneIcon from '@mui/icons-material/ScheduleTwoTone';
import Groups3TwoToneIcon from '@mui/icons-material/Groups3TwoTone';

interface TimeTableProps {
  arrangedReqList: ArrangedReqList;
}

const TimeTable: React.FC<TimeTableProps> = ({ arrangedReqList }) => {
  return (
    <Box
      id="tableContainer"
      sx={{ width: '100%', height: '100%', overflow: 'auto', display: 'flex' }}
    >
      <Box
        sx={{
          flex: '1',
          display: 'flex', // Elements are placed in a row
          flexDirection: 'row', // This is the default but added for clarity
          //   width: 'auto', // Auto width to contain all columns
          height: '100%',
          //   backgroundColor: 'grey',
        }}
      >
        {Object.keys(arrangedReqList).map((dateStr, index) => {
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
                height: '100%',
                flexShrink: 0, // Prevents the column from shrinking
              }}
            >
              <Box id={`tableHeaderCell-${index}`} sx={{ width: 'inherit', height: '30px' }}>
                {dateStr}
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
                {arrangedReqList[dateStr].map((timeOfDayList, timeOfDayListIndex) => {
                  return (
                    <Box
                      key={timeOfDayListIndex}
                      sx={{
                        flex: '1',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'start',
                        width: 'inherit',
                        p: '10px 10px',
                        // height: '50px',
                        border: '1px solid rgba(0, 0, 0, 0.23)',
                        overflowY: 'scroll',
                        scrollbarWidth: 'none', // !!!
                        msOverflowStyle: 'none', // !!!!
                      }}
                    >
                      {timeOfDayList.map((reqObj, reqObjIdx) => {
                        return (
                          <Box id={`reqObjContainer-${reqObjIdx}`} sx={{ marginBottom: '5px' }}>
                            <Paper sx={{ width: '100%' }} elevation={8}>
                              <List dense={true} sx={{ paddingTop: '2px', paddingBottom: '0' }}>
                                <ListItem sx={{ paddingTop: '0', paddingBottom: '0' }}>
                                  {/* <ListItemIcon>
                                    <FolderIcon />
                                  </ListItemIcon> */}
                                  <ListItemText
                                    primary={'nurse number: ' + reqObj.min_seniority}
                                    sx={{ margin: '0 0 3px 0' }}

                                    // secondary={secondary ? 'Secondary text' : null}
                                  />
                                </ListItem>
                                <ListItem sx={{ paddingTop: '0', paddingBottom: '0' }}>
                                  {/* <ListItemIcon>
                                    <FolderIcon />
                                  </ListItemIcon> */}
                                  <ListItemText
                                    primary={'min seniority: ' + reqObj.min_seniority}
                                    sx={{ margin: '0 0 3px 0' }}

                                    // secondary={secondary ? 'Secondary text' : null}
                                  />
                                </ListItem>
                                <ListItem sx={{ paddingTop: '0', paddingBottom: '0' }}>
                                  {/* <ListItemIcon sx={{ margin: '0', padding: '0' }}>
                                    <ScheduleTwoToneIcon />
                                  </ListItemIcon> */}
                                  <ListItemText
                                    primary={'shift length: ' + reqObj.hours_per_shift}
                                    sx={{ margin: '0 0 3px 0' }}
                                    // secondary={secondary ? 'Secondary text' : null}
                                  />
                                </ListItem>
                              </List>
                            </Paper>
                          </Box>
                        );
                      })}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default TimeTable;
