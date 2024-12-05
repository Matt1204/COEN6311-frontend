import { useEffect, useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { useLocation } from 'react-router-dom';

import NurSchedulePanel from './components/NurSchedulePanel';
import HosSchedulePabel from './components/HosSchedulePanel';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ScheduleManagement() {
  const location = useLocation();
  const routeState = location.state;
  // console.log('routeState: ', routeState);

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    console.log('routeState:', routeState);
    if (routeState) {
      if (routeState.type == 'supervisor') {
        setTabValue(1);
      }
    }
  }, []);

  return (
    <Box
      sx={{
        width: '100%', // !!!!!!!!
        height: '100%', // !!!!!!!!
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        p: '0px 7px 5px 5px',
      }}
    >
      <Box id="tabContainer" sx={{ width: '100%', borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
          <Tab label="Nurse Schedule" {...a11yProps(0)} />
          <Tab label="Hospital Schedule" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <Box id="tabContentContainer" sx={{ flexGrow: 1, width: '100%', display: 'flex' }}>
        <Box sx={{ display: tabValue === 0 ? 'flex' : 'none', height: '100%', width: '100%' }}>
          <NurSchedulePanel
            initUserId={routeState && routeState.type == 'nurse' ? routeState.payload : null}
          />
          {/* <NurSchedulePanel /> */}
        </Box>
        <Box
          sx={{
            display: tabValue === 1 ? 'flex' : 'none',
            height: '100%',
            width: '100%',
            // backgroundColor: 'blue',
          }}
        >
          <HosSchedulePabel
            initHospitalId={
              routeState && routeState.type == 'supervisor' ? routeState.payload : null
            }
          />
        </Box>
      </Box>
    </Box>
  );
}
