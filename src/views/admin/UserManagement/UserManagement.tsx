import {
  Accordion,
  AccordionDetails,
  Box,
  Button,
  Pagination,
  Tooltip,
  AccordionSummary,
  Chip,
  Avatar,
  Typography,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import UserFilter, { UserFilterType } from './components/UserFilter';
import {
  useFetchUserListQuery,
  useLazyFetchUserListQuery,
} from '../../../store/apiSlices/userManagementApiSlice';
import { useFetchAllHospitalsQuery } from '../../../store/apiSlices/hospitalApiSlice';

export const initialFilter: UserFilterType = {
  email: '',
  first_name: '',
  last_name: '',
  address: '',
  phone_number: '',
  role: '',
  seniority: null,
  hospital_id: null,
};

export default function UserManagement() {
  const { data: fetchedHospitals } = useFetchAllHospitalsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [filter, setFilter] = useState<UserFilterType | null>(null);
  const handleFilterUpdate = (filter: UserFilterType) => {
    // console.log(filter);
    setFilter(filter);
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetching users
  const [fetchUserList, { data: fetchedUsersData, isLoading, isError }] =
    useLazyFetchUserListQuery();
  useEffect(() => {
    fetchedUsersData && console.log(fetchedUsersData);
  }, [fetchedUsersData]);

  // initial fetch
  const initialFetch = () => {
    fetchUserList({ filter: initialFilter, page_size: pageSize, currect_page: currentPage });
  };

  // Fetch initial user list
  useEffect(() => {
    initialFetch();
  }, []);

  // re-fetch
  const handleFetchUser = () => {
    setCurrentPage(1);
    filter &&
      fetchUserList({
        filter: filter as UserFilterType,
        page_size: pageSize,
        currect_page: 1,
      });
  };

  // re-fetch when page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    // handleFetchUser();
    fetchUserList({
      filter: filter as UserFilterType,
      page_size: pageSize,
      currect_page: value,
    });
  };

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
    <>
      <Box
        sx={{
          width: '100%', // !!!!!!!!
          height: '100%', // !!!!!!!!
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          p: '10px 7px 3px 5px',
        }}
      >
        <Box
          id="upperContainer"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <UserFilter
            initialFilter={initialFilter}
            onFilterUpdate={handleFilterUpdate}
            onFilterClear={initialFetch}
          />
          <Box>
            <Button
              variant="outlined"
              // color="secondary"
              size="small"
              onClick={handleFetchUser}
              startIcon={<PersonSearchIcon />} // Add Delete Icon
              sx={{
                ml: '10px',
                maxHeight: '55px',
                textTransform: 'none',
                borderRadius: '16px',
                fontSize: '1.2rem',
              }}
            >
              Search
            </Button>
          </Box>
        </Box>
        <Box
          id="midContainer"
          sx={{
            width: '100%',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'start',
            padding: '20px 60px',
            overflowY: 'scroll', // !!!!!
            scrollbarWidth: 'none', // !!!
            msOverflowStyle: 'none', // !!!!
            border: '1px solid black', // Adds a border with a light grey color
          }}
        >
          {fetchedUsersData &&
            fetchedUsersData.user_list.map((userObject, index) => {
              return (
                <Accordion
                  key={index}
                  sx={{
                    // border: '1px solid #000',
                    p: '10px 0',
                    marginBottom: 2,
                    borderRadius: 2,
                    backgroundColor: '#f0f4f8',
                    // '&.Mui-expanded': { backgroundColor: '#f0f4f8' },
                    ':hover': { border: '1px solid #000' },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    id={`panel-${index}`}
                    sx={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <Tooltip title="Nurse Email" arrow>
                      <Chip
                        avatar={<Avatar>{userObject.last_name?.charAt(0)}</Avatar>}
                        label={userObject.email}
                        color="primary"
                        variant="outlined"
                      />
                    </Tooltip>
                  </AccordionSummary>
                  <AccordionDetails>
                    {[
                      {
                        label: 'u_id',
                        value: `${userObject.u_id}`,
                      },
                      {
                        label: 'Name',
                        value: `${userObject.first_name} ${userObject.last_name}`,
                      },
                      {
                        label: 'Email',
                        value: `${userObject.email}`,
                      },
                      {
                        label: 'Role',
                        value: `${userObject.role}`,
                      },
                      {
                        label: 'Phone Number',
                        value: userObject.phone_number || 'Not Filled',
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
                    {userObject.role == 'nurse' ? (
                      <Box key={'Seniority'} sx={{ marginBottom: 1 }}>
                        <Typography sx={labelTypographyStyle} component="span">
                          {'Seniority'}:&nbsp;
                        </Typography>
                        <Typography sx={dataTypographyStyle} component="span">
                          {userObject.seniority}
                        </Typography>
                      </Box>
                    ) : (
                      <Box key={'Hospital'} sx={{ marginBottom: 1 }}>
                        <Typography sx={labelTypographyStyle} component="span">
                          {'Hospital'}:&nbsp;
                        </Typography>
                        <Typography sx={dataTypographyStyle} component="span">
                          {
                            fetchedHospitals?.data.find(
                              hospital => hospital.h_id == userObject.hospital_id
                            )?.h_name
                          }
                        </Typography>
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              );
            })}
        </Box>
        <Box
          id="paginationContainer"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            padding: '5px 0px',
          }}
        >
          <Pagination
            count={fetchedUsersData?.total_page_num}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Box>
    </>
  );
}
