import { Autocomplete, Box, TextField } from '@mui/material';
import Grid from '@mui/material/Grid2';
import React, { useEffect, useState } from 'react';

import UserFilter, { UserFilterType } from '../../UserManagement/components/UserFilter';
import { useFetchUserListQuery, User } from '../../../../store/apiSlices/userManagementApiSlice';
import NurseSchedule from '../../../nurse/NurseSchedule/NurseSchedule';
import { useFetchUserQuery } from '../../../../store/apiSlices/userApiSlice';

export const initialFilter: UserFilterType = {
  email: '',
  first_name: '',
  last_name: '',
  address: '',
  phone_number: '',
  role: 'nurse',
  seniority: null,
  hospital_id: null,
};

interface NurSchedulePanelProps {
  initUserId?: number;
}

const NurSchedulePanel: React.FC<NurSchedulePanelProps> = ({ initUserId }) => {
  const [filter, setFilter] = useState<UserFilterType | null>(null);
  const handleFilterUpdate = (filter: UserFilterType) => {
    // console.log(filter);
    setFilter(filter);
  };
  //   useEffect(() => {
  //     console.log(filter);
  //   }, [filter]);

  const { data: fetchedUserListData, ...othersFetchUsers } = useFetchUserListQuery(
    { filter: filter as UserFilterType },
    { refetchOnMountOrArgChange: true, skip: !filter }
  );
  //   useEffect(() => {
  //     if (fetchedUserListData) {
  //       console.log('fetchedUserData', fetchedUserListData);
  //     }
  //   }, [fetchedUserListData]);

  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const handleSelectUser = (user: User) => {
    setSelectedUser(user.u_id);
  };
  useEffect(() => {
    if (initUserId) {
      // console.log('Setting Init User:', initUserId);
      setSelectedUser(initUserId);
    }
  });

  const { data: fetchedUserInfo, ...others } = useFetchUserQuery(selectedUser as number, {
    skip: !selectedUser,
    refetchOnMountOrArgChange: true,
  });

  const [filterExpanded, setFilterExpanded] = useState(false);
  useEffect(() => {
    // fetchedUserInfo && console.log('fetchedUserInfo: ', fetchedUserInfo);
  });

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
      <Box id="upperContainer" sx={{ width: '100%', padding: '3px 0px' }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <UserFilter
              initialFilter={initialFilter}
              nurseOnlyMode={true}
              onFilterUpdate={handleFilterUpdate}
              isExpandedProp={filterExpanded}
              onExpandedChange={expanded => {
                setFilterExpanded(expanded);
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }} sx={{ display: 'flex', alignItems: 'center' }}>
            {fetchedUserListData && (
              <Autocomplete
                sx={{ width: '100%' }}
                options={fetchedUserListData.user_list}
                getOptionLabel={(option: User) =>
                  ` ${option.first_name} ${option.last_name}-${option.email}`
                }
                isOptionEqualToValue={(option, value) => option.u_id == value.u_id}
                defaultValue={
                  !!initUserId && !!fetchedUserInfo ? (fetchedUserInfo.data as User) : undefined
                }
                onChange={(e, newValue: User) => {
                  handleSelectUser(newValue);
                }}
                renderInput={params => <TextField {...params} size="small" />}
                disableClearable
              ></Autocomplete>
            )}
          </Grid>
        </Grid>
      </Box>
      <Box
        id="timetableContainer"
        sx={{
          flexGrow: '1',
          width: '100%',
          overflowY: 'scroll',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          mt: '8px',
          //   backgroundColor: 'red',
        }}
      >
        {selectedUser && <NurseSchedule propUid={selectedUser} />}
      </Box>
    </Box>
  );
};

export default NurSchedulePanel;
