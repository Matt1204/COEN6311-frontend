import React, { useEffect, useMemo, useState } from 'react';
import { Box, TextField, Autocomplete } from '@mui/material';
import Slider from '@mui/material/Slider';
import dayjs, { Dayjs } from 'dayjs';
import Grid from '@mui/material/Grid2';
import { z } from 'zod';

import PrefTopBar from './components/pref-top-bar';
import HospitalsRanking from './components/HospitalsRanking';

import { useAppSelector } from '../../../store/storeHooks';
import { useFormState } from '../../../shared/utils/useFormState';
// import { useFetchAllHospitalsQuery, Hospital } from '../../../store/apiSlices/hospitalApiSlice';
import { useFetchPreferenceQuery } from '../../../store/apiSlices/preferenceApiSlice';

let formSchema = z.object({
  hoursPerWeek: z
    .number()
    .lte(84, { message: 'must smaller or equal 84' })
    .gte(1, { message: 'must greater or equal 1' }),
  maxHoursPerShift: z
    .number()
    .lte(12, { message: 'must smaller or equal 12' })
    .gte(1, { message: 'must greater or equal 1' }),
  preferredWeekDays: z.array(z.string()).min(1, { message: 'must select at least one weekday' }),
  timeOfDay: z.string({ message: 'must select time of day' }),
  HospitalsRanking: z.array(z.number()).min(1, { message: 'hospital ranking is empty' }),
});

export default function PreferenceManagement() {
  const user = useAppSelector(state => state.user);
  const [startDate, setStartDate] = useState<Dayjs | undefined>();

  const isDue = useMemo(() => {
    const today = dayjs();
    const dayOfWeek = today.day();
    const daysSinceMonday = (dayOfWeek + 6) % 7; // Adjust to make Monday (1) the start of the week, thus Monday will be 0
    const currentMonday = today.subtract(daysSinceMonday, 'day');
    const twoWeeksFromMonday = currentMonday.add(14, 'day');
    return twoWeeksFromMonday.isBefore(startDate);
  }, [startDate]);

  const { data: fetchPrefData, ...othersFetchPref } = useFetchPreferenceQuery(
    {
      nurseId: user.uId,
      startDate: startDate?.format('YYYY-MM-DD') as string,
    },
    {
      skip: !startDate, // Only run the query if startDate is defined
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    fetchPrefData && console.log('fetchPrefData: ', fetchPrefData);
  }, [fetchPrefData]);

  const {
    formState,
    handleFormChange,
    handleFormBlur,
    handleFormFocus,
    addInputs,
    removeInputs,
    formIsValid: formValidity,
  } = useFormState(formSchema);

  // initialize formState
  useEffect(() => {
    if (fetchPrefData) {
      let dataList: {
        field: keyof typeof formSchema.shape;
        value: string | number | string[] | number[] | null;
      }[] = [
        {
          field: 'hoursPerWeek' as keyof typeof formSchema.shape,
          value: fetchPrefData.hours_per_week,
        },
        {
          field: 'maxHoursPerShift' as keyof typeof formSchema.shape,
          value: fetchPrefData.max_hours_per_shift,
        },
        {
          field: 'preferredWeekDays' as keyof typeof formSchema.shape,
          value: fetchPrefData.preferred_week_days,
        },
        { field: 'timeOfDay' as keyof typeof formSchema.shape, value: fetchPrefData.time_of_day },
        {
          field: 'HospitalsRanking' as keyof typeof formSchema.shape,
          value: fetchPrefData.hospitals_ranking,
        },
      ];

      addInputs(dataList);
    }
  }, [fetchPrefData]);
  useEffect(() => {
    console.log('watch formState:', formState);
  }, [formState]);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100px',
        p: '8px',
        flexGrow: 1,
        // backgroundColor: 'red',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
      }}
    >
      <PrefTopBar
        onStartDateChange={date => {
          // console.log(date);
          setStartDate(date);
        }}
      />
      {/* <Box sx={{ width: '100%', height: '50px', backgroundColor: 'grey' }}></Box> */}
      <Box id="pref-bottom-container" sx={{ width: '100%', flexGrow: 1 }}>
        <Box
          id="pref-form-container"
          sx={{
            width: '100%',
            border: '1px solid red', // Adds a border with a light grey color
          }}
        >
          <Grid container spacing={3} sx={{ padding: '15px 10px' }}>
            {formState?.hoursPerWeek &&
              formState?.maxHoursPerShift &&
              formState?.preferredWeekDays &&
              formState?.timeOfDay &&
              formState?.HospitalsRanking && (
                <>
                  <Grid size={{ xs: 12, lg: 6 }} padding={{ xs: '10px', md: '0px' }}>
                    <Slider
                      aria-label="Custom marks"
                      value={formState?.hoursPerWeek?.content as number}
                      onChange={(e, val) => {
                        handleFormChange('hoursPerWeek', val);
                      }}
                      // getAriaValueText={valuetext}
                      step={4}
                      min={1}
                      max={84}
                      valueLabelDisplay="auto"
                      marks={[
                        { value: 12, label: '12h' },
                        { value: 24, label: '24h' },
                        { value: 36, label: '36h' },
                        { value: 48, label: '48h' },
                        { value: 60, label: '60h' },
                        { value: 72, label: '72h' },
                        { value: 84, label: '84h' },
                      ]}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, lg: 6 }} padding={{ xs: '10px', md: '0px' }}>
                    <Slider
                      aria-label="Custom marks"
                      value={formState?.maxHoursPerShift?.content as number}
                      onChange={(e, val) => {
                        handleFormChange('maxHoursPerShift', val);
                      }}
                      // getAriaValueText={valuetext}
                      step={1}
                      min={1}
                      max={12}
                      valueLabelDisplay="auto"
                      marks={[
                        { value: 3, label: '3' },
                        { value: 6, label: '6' },
                        { value: 9, label: '9' },
                        { value: 12, label: '12' },
                      ]}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, lg: 6 }} padding={{ xs: '10px', md: '0px' }}>
                    <Autocomplete
                      multiple
                      options={[
                        'Monday',
                        'Tuesday',
                        'Wednesday',
                        'Thursday',
                        'Friday',
                        'Saturday',
                        'Sunday',
                      ]}
                      getOptionLabel={(option: string) => option}
                      value={formState.preferredWeekDays.content as string[]}
                      onChange={(event, newValue: string[]) => {
                        handleFormChange('preferredWeekDays', newValue);
                      }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label="Select preferred weekdays"
                          error={
                            !!formState.preferredWeekDays?.errorMessage &&
                            !formState.preferredWeekDays.isFocused
                          }
                          helperText={
                            !!formState.preferredWeekDays?.errorMessage &&
                            !formState.preferredWeekDays?.isFocused
                              ? formState.preferredWeekDays?.errorMessage
                              : ''
                          }
                        />
                      )}
                      onBlur={() => {
                        handleFormBlur('preferredWeekDays');
                      }}
                      onFocus={() => {
                        handleFormFocus('preferredWeekDays');
                      }}
                      disablePortal
                      disableClearable
                      blurOnSelect
                    />
                  </Grid>
                  <Grid size={{ xs: 12, lg: 6 }} padding={{ xs: '10px', md: '0px' }}>
                    <Autocomplete
                      // Props for customizing behavior
                      options={['morning', 'afternoon', 'night']}
                      getOptionLabel={(option: string) => option}
                      // isOptionEqualToValue={(option, value) => option.h_id === value.h_id}
                      value={formState.timeOfDay.content as string}
                      onChange={(event, newValue: string) => {
                        handleFormChange('timeOfDay', newValue);
                      }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label="Select time of day"
                          error={
                            !!formState.timeOfDay?.errorMessage && !formState.timeOfDay.isFocused
                          }
                          helperText={
                            !!formState.timeOfDay?.errorMessage && !formState.timeOfDay?.isFocused
                              ? formState.timeOfDay?.errorMessage
                              : ''
                          }
                        />
                      )}
                      onBlur={() => {
                        handleFormBlur('timeOfDay');
                      }}
                      onFocus={() => {
                        handleFormFocus('timeOfDay');
                      }}
                      disablePortal
                      disableClearable
                      blurOnSelect
                    />
                  </Grid>
                  {/* ADDING initializing logic here!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
                  <Grid size={{ xs: 12, lg: 6 }} padding={{ xs: '10px', md: '0px' }}>
                    <HospitalsRanking
                      // initialRanking={
                      //   (formState.HospitalsRanking?.content as number[]).length
                      //     ? (formState.HospitalsRanking?.content as number[])
                      //     : []
                      // }
                      initialRanking={
                        fetchPrefData && fetchPrefData?.hospitals_ranking.length
                          ? fetchPrefData?.hospitals_ranking
                          : []
                      }
                      onRankingChange={newRanking => {
                        // console.log(`receiving new ranking: ${newRanking}`);
                        newRanking && handleFormChange('HospitalsRanking', newRanking);
                      }}
                    />
                  </Grid>
                </>
              )}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
