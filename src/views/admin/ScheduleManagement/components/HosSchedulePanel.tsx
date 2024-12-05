import React, { useEffect, useState } from 'react';
import { Autocomplete, Box, TextField } from '@mui/material';

import { useFetchAllHospitalsQuery, Hospital } from '../../../../store/apiSlices/hospitalApiSlice';
import HospitalSchedule from '../../../supervisor/HosipitalSchedule/HosipitalSchedule';
import { showAlert } from '../../../../store/alertSlice';
import { useAppDispatch } from '../../../../store/storeHooks';
interface HosSchedulePanelProps {
  initHospitalId?: number;
}

const HosSchedulePanel: React.FC<HosSchedulePanelProps> = ({ initHospitalId }) => {
  const dispatch = useAppDispatch();
  const { data: fetchedHospitalList } = useFetchAllHospitalsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [hospitalId, setHospitalId] = useState<null | number>(null);
  useEffect(() => {
    if (fetchedHospitalList) {
      if (initHospitalId) {
        console.log('!!!!! HIT:', initHospitalId);

        setHospitalId(initHospitalId);

        dispatch(
          showAlert({
            msg: `selected supervisor belongs to ${fetchedHospitalList.data.find(h => h.h_id == initHospitalId)?.h_name}`,
            severity: 'success',
          })
        );
      } else {
        setHospitalId(fetchedHospitalList.data[0].h_id);
      }
    }
  }, [fetchedHospitalList, initHospitalId]);

  return (
    <Box
      id="topContainer"
      sx={{
        flexGrow: '1',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        // backgroundColor: 'red',
      }}
    >
      <Box id="hosSelectorContainer" sx={{ p: '5px 7px 0px 13px' }}>
        {fetchedHospitalList && hospitalId && (
          <Autocomplete
            options={fetchedHospitalList.data}
            getOptionLabel={(option: Hospital) => option.h_name}
            isOptionEqualToValue={(option, value) => option.h_id === value?.h_id}
            value={fetchedHospitalList.data.find(hospital => hospital.h_id === hospitalId)}
            onChange={(event, newValue: Hospital) =>
              //   handleFilterUpdate('hospital_id', newValue?.h_id || null)
              setHospitalId(newValue.h_id)
            }
            disableClearable
            renderInput={params => <TextField {...params} size="small" />}
          />
        )}
      </Box>
      <Box sx={{ width: '100%', flexGrow: '1' }}>
        {hospitalId && <HospitalSchedule propHospitalId={hospitalId} />}
      </Box>
    </Box>
  );
};

export default HosSchedulePanel;
