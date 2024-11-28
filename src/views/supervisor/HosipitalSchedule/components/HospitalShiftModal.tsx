import React from 'react';
// import Grid from '@mui/material/Grid';
import Grid from '@mui/material/Grid2';

import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Box,
  Chip,
  Avatar,
  Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';

import CustomModal from '../../../components/CustomModal';
import { useFetchShiftInfoQuery } from '../../../../store/apiSlices/hosScheduleApiSlice';

interface HospitalShiftModalProps {
  visible: boolean;
  requestId: number | undefined;
  onCloseModal: () => void;
}

const HospitalShiftModal: React.FC<HospitalShiftModalProps> = ({
  visible,
  requestId,
  onCloseModal,
}) => {
  const { data: fetchedShiftInfo } = useFetchShiftInfoQuery(requestId as number, {
    skip: !requestId,
    refetchOnMountOrArgChange: true,
  });

  const dataTypographyStyle = {
    fontWeight: 500,
    fontSize: '1.2rem',
    color: 'text.primary',
  };

  const labelTypographyStyle = {
    fontWeight: 600,
    fontSize: '1.2rem',
    color: 'text.secondary',
  };

  return (
    <CustomModal open={visible} onClose={onCloseModal} showSubmitBtn={false} title="Shift Info">
      <Grid container spacing={2} sx={{ padding: 2 }}>
        {fetchedShiftInfo && (
          <>
            {/* Shift Details */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Card sx={{ boxShadow: 3, backgroundColor: 'background.paper', height: '100%' }}>
                <CardHeader
                  avatar={<AccessTimeIcon color="primary" />}
                  title="Shift Details"
                  titleTypographyProps={{ fontWeight: 700, fontSize: '1.5rem' }}
                />
                <Divider />
                <CardContent>
                  {[
                    { label: 'Date', value: fetchedShiftInfo?.shift_info.shift_date },
                    { label: 'Week Day', value: fetchedShiftInfo?.shift_info.day_of_week },
                    { label: 'Time of Day', value: fetchedShiftInfo?.shift_info.shift_type },
                    {
                      label: 'Shift Length',
                      value: `${fetchedShiftInfo?.shift_info.hours_per_shift} hours`,
                    },
                    {
                      label: 'Minimum Seniority',
                      value: `${fetchedShiftInfo?.shift_info.min_seniority}/10`,
                    },
                    {
                      label: 'Nurse Number',
                      value: `${fetchedShiftInfo?.shift_info.actual_nurse_num}/${fetchedShiftInfo?.shift_info.request_nurse_num}`,
                    },
                  ].map(({ label, value }) => (
                    <Box key={label} sx={{ marginBottom: 2 }}>
                      <Typography sx={labelTypographyStyle} component="span">
                        {label}:&nbsp;
                      </Typography>
                      <Typography sx={dataTypographyStyle} component="span">
                        {value || 'Not Filled'}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            {/* Supervisor Info */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Card sx={{ boxShadow: 3, backgroundColor: '#f0f4f8', height: '100%' }}>
                <CardHeader
                  avatar={<SupervisorAccountIcon color="secondary" />}
                  title="Supervisor Info"
                  titleTypographyProps={{ fontWeight: 700, fontSize: '1.5rem' }}
                />
                <Divider />
                <CardContent>
                  {[
                    { label: 'Email', value: fetchedShiftInfo?.shift_info.supervisor_email },
                    {
                      label: 'Name',
                      value: `${fetchedShiftInfo?.shift_info.supervisor_firstname} ${fetchedShiftInfo?.shift_info.supervisor_lastname}`,
                    },
                    {
                      label: 'Phone Number',
                      value: fetchedShiftInfo?.shift_info.supervisor_phone_number || 'Not Filled',
                    },
                    {
                      label: 'Home Address',
                      value: fetchedShiftInfo?.shift_info.supervisor_address || 'Not Filled',
                    },
                  ].map(({ label, value }) => (
                    <Box key={label} sx={{ marginBottom: 2 }}>
                      <Typography sx={labelTypographyStyle} component="span">
                        {label}:&nbsp;
                      </Typography>
                      <Typography sx={dataTypographyStyle} component="span">
                        {value}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            {/* Hospital Info */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Card sx={{ boxShadow: 3, backgroundColor: '#e8f5e9', height: '100%' }}>
                <CardHeader
                  avatar={<LocalHospitalIcon color="success" />}
                  title="Hospital Info"
                  titleTypographyProps={{ fontWeight: 700, fontSize: '1.5rem' }}
                />
                <Divider />
                <CardContent>
                  {[
                    { label: 'Hospital', value: fetchedShiftInfo?.shift_info.hospital_name },
                    { label: 'Address', value: fetchedShiftInfo?.shift_info.hospital_address },
                    { label: 'Hotline', value: fetchedShiftInfo?.shift_info.hospital_hotline },
                  ].map(({ label, value }) => (
                    <Box key={label} sx={{ marginBottom: 2 }}>
                      <Typography sx={labelTypographyStyle} component="span">
                        {label}:&nbsp;
                      </Typography>
                      <Typography sx={dataTypographyStyle} component="span">
                        {value || 'Not Filled'}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            {/* Nurse List */}
            <Grid size={{ xs: 12 }}>
              <Card>
                <CardHeader
                  avatar={<PersonIcon color="warning" />}
                  title="Nurse List"
                  titleTypographyProps={{ fontWeight: 700, fontSize: '1.5rem' }}
                />
                <Divider />
                <CardContent>
                  {fetchedShiftInfo?.nurse_list.map((nurseObject, index) => (
                    <Accordion
                      key={index}
                      sx={{
                        marginBottom: 1,
                        borderRadius: 2,
                        '&.Mui-expanded': { backgroundColor: '#f0f4f8' },
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />} id={`panel-${index}`}>
                        <Tooltip title="Nurse Email" arrow>
                          <Chip
                            avatar={<Avatar>{nurseObject.nurse_email?.charAt(0)}</Avatar>}
                            label={nurseObject.nurse_email || 'Not Filled'}
                            color="primary"
                            variant="outlined"
                          />
                        </Tooltip>
                      </AccordionSummary>
                      <AccordionDetails>
                        {[
                          {
                            label: 'Name',
                            value: `${nurseObject.nurse_firstname} ${nurseObject.nurse_lastname}`,
                          },
                          { label: 'Seniority', value: `${nurseObject.nurse_seniority}/10` },
                          {
                            label: 'Phone Number',
                            value: nurseObject.nurse_phone_number || 'Not Filled',
                          },
                          {
                            label: 'Birthday',
                            value: nurseObject.nurse_birthday || 'Not Filled',
                          },
                        ].map(({ label, value }) => (
                          <Box key={label} sx={{ marginBottom: 1 }}>
                            <Typography sx={labelTypographyStyle} component="span">
                              {label}:&nbsp;
                            </Typography>
                            <Typography sx={dataTypographyStyle} component="span">
                              {value}
                            </Typography>
                          </Box>
                        ))}
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </>
        )}
      </Grid>
    </CustomModal>
  );
};

export default HospitalShiftModal;
