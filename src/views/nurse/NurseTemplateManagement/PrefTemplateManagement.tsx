import { useState } from 'react';
// import HospitalsRanking from '../PreferenceManagement/components/HospitalsRanking';
import { Box } from '@mui/material';

import { useAppSelector } from '../../../store/storeHooks';
import PrefTemplateList from './components/PrefTemplateList';

export default function PrefTemplateManagement() {
  const sliceNurseId = useAppSelector(state => state.user.uId);

  return (
    <Box
      sx={{
        width: '100%', // !!!!!!!!
        height: '100%', // !!!!!!!!
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        p: '10px 7px 3px 5px',
        backgroundColor: 'gray',
      }}
    >
      {sliceNurseId && <PrefTemplateList nurseId={sliceNurseId} />}
    </Box>
  );
}
