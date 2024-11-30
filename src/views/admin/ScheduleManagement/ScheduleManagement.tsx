import { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';

import NurSchedulePanel from './components/NurSchedulePanel';
import HosSchedulePabel from './components/HosSchedulePanel';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ScheduleManagement() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
          <NurSchedulePanel />
        </Box>
        <Box
          sx={{
            display: tabValue === 1 ? 'flex' : 'none',
            height: '100%',
            width: '100%',
            // backgroundColor: 'blue',
          }}
        >
          <HosSchedulePabel />
        </Box>
      </Box>
    </Box>
  );
}
