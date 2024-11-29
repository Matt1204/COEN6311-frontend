import {
  Accordion,
  Box,
  AccordionSummary,
  Button,
  AccordionDetails,
  TextField,
  Autocomplete,
  Rating,
  Typography,
  Divider,
  Badge,
} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import DeleteIcon from '@mui/icons-material/Delete'; // Import Delete Icon

import React, { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid2';
import { useFetchAllHospitalsQuery, Hospital } from '../../../../store/apiSlices/hospitalApiSlice';

export type UserFilterType = {
  email: string;
  first_name: string;
  last_name: string;
  address: string;
  phone_number: string;
  role: string;
  seniority: number | null;
  hospital_id: number | null;
};

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

interface UserFilterProps {
  onFilterUpdate: (filter: UserFilterType) => void;
  onFilterClear: () => void;
}

const UserFilter: React.FC<UserFilterProps> = ({ onFilterUpdate, onFilterClear }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filter, setFilter] = useState(initialFilter);

  useEffect(() => {
    onFilterUpdate(filter);
  }, [filter]);

  const handleFilterUpdate = (field: keyof typeof initialFilter, value: string | number | null) => {
    setFilter(prevState => ({ ...prevState, [field]: value }));
  };

  const isFilterApplied = Object.values(filter).some(value => value !== '' && value !== null);

  const { data: fetchedHospitals } = useFetchAllHospitalsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const handleClearFilters = () => {
    setFilter(initialFilter);
    onFilterClear();
  };

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      {/* Accordion Section */}
      <Accordion
        expanded={isExpanded}
        onChange={() => setIsExpanded(!isExpanded)}
        sx={{
          border: '1px solid #ccc',
          boxShadow: isExpanded ? 4 : 2,
          borderRadius: '8px',
          '&:before': { display: 'none' }, // Remove MUI default divider
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            padding: '0 16px',
            backgroundColor: isFilterApplied ? '#91b896' : 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Filter Users
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: '15px' }}>
            {isFilterApplied && (
              <Button
                variant="outlined"
                // color="secondary"
                size="small"
                onClick={e => {
                  e.stopPropagation();
                  handleClearFilters();
                }}
                startIcon={<DeleteIcon />} // Add Delete Icon
                sx={{
                  textTransform: 'none',
                  borderRadius: '16px',
                  fontSize: '0.8rem',
                  '&:hover': {
                    backgroundColor: isFilterApplied ? '#ffb300' : '#e0e0e0',
                  },
                }}
              >
                Clear Filters
              </Button>
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            padding: 2,
            backgroundColor: '#f9f9f9',
            border: '1px solid #ddd',
            borderRadius: '8px',
            zIndex: isExpanded ? 10 : 'auto',
            position: isExpanded ? 'absolute' : 'relative',
            width: isExpanded ? '100%' : 'auto',
            boxShadow: isExpanded ? 3 : 0,
          }}
        >
          {/* Filter Form */}
          <Grid container spacing={2}>
            {/* Input Fields */}
            {['email', 'first_name', 'last_name', 'address', 'phone_number'].map(field => (
              <Grid size={{ xs: 12, lg: 4 }} key={field}>
                <TextField
                  id={field}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={filter[field as keyof typeof initialFilter]}
                  onChange={e =>
                    handleFilterUpdate(field as keyof typeof initialFilter, e.target.value)
                  }
                  fullWidth
                  variant="outlined"
                  size="small"
                />
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            {/* Role Selection */}
            <Grid size={{ xs: 6 }}>
              <Autocomplete
                options={['nurse', 'supervisor', 'admin']}
                value={filter.role}
                onChange={(event, newValue) => {
                  handleFilterUpdate('role', newValue || '');
                  handleFilterUpdate('seniority', null);
                  handleFilterUpdate('hospital_id', null);
                }}
                renderInput={params => <TextField {...params} label="Role" size="small" />}
              />
            </Grid>

            {/* Seniority Rating (if Role is Nurse) */}
            {filter.role === 'nurse' && (
              <Grid size={{ xs: 6 }} display="flex" alignItems="center">
                <Typography component="legend" sx={{ mr: 2 }}>
                  Seniority:
                </Typography>
                <Rating
                  value={filter.seniority}
                  max={10}
                  onChange={(e, value) => handleFilterUpdate('seniority', value || null)}
                />
                {filter.seniority && (
                  <BlockIcon
                    onClick={() => handleFilterUpdate('seniority', null)}
                    sx={{
                      cursor: 'pointer',
                      ml: 2,
                      color: 'gray',
                      transition: 'all 0.3s ease',
                      ':hover': { color: 'red', transform: 'scale(1.2)' },
                    }}
                  />
                )}
              </Grid>
            )}

            {/* Hospital Selection (if Role is Supervisor) */}
            {filter.role === 'supervisor' && fetchedHospitals && (
              <Grid size={{ xs: 6 }}>
                <Autocomplete
                  options={fetchedHospitals.data}
                  getOptionLabel={(option: Hospital) => option.h_name}
                  isOptionEqualToValue={(option, value) => option.h_id === value?.h_id}
                  value={
                    fetchedHospitals.data.find(hospital => hospital.h_id === filter.hospital_id) ||
                    null
                  }
                  onChange={(event, newValue: Hospital | null) =>
                    handleFilterUpdate('hospital_id', newValue?.h_id || null)
                  }
                  renderInput={params => <TextField {...params} size="small" />}
                />
              </Grid>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default UserFilter;
