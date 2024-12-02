import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  TextField,
  Autocomplete,
  FormControl,
  Typography,
  FormHelperText,
  Button,
} from '@mui/material';
import Slider from '@mui/material/Slider';
import dayjs, { Dayjs } from 'dayjs';
import Grid from '@mui/material/Grid2';
import { z } from 'zod';

import PrefTopBar from './components/pref-top-bar';
import HospitalsRanking from './components/HospitalsRanking';

import { useAppSelector, useAppDispatch } from '../../../store/storeHooks';
import { useFormState } from '../../../shared/utils/useFormState';
import {
  useFetchPreferenceQuery,
  useUpdatePreferenceMutation,
  updatePreferenceData,
  useCreatePreferenceMutation,
  CreatePreferenceData,
} from '../../../store/apiSlices/preferenceApiSlice';
import { showAlert } from '../../../store/alertSlice';
import TemplateSelectionModal from './components/TemplateSelectionModal';
import { PrefTemplateInputs } from '../NurseTemplateManagement/components/PrefTemplateForm';

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
  timeOfDay: z.string().min(1, { message: 'must selcet time of day' }),
  HospitalsRanking: z.array(z.number()).min(1, { message: 'hospital ranking is empty' }),
});

export default function PreferenceManagement() {
  const dispatch = useAppDispatch();

  const user = useAppSelector(state => state.user);
  const [startDate, setStartDate] = useState<Dayjs | undefined>();
  const [endDate, setEndDate] = useState<Dayjs | undefined>();

  // fetch preference data for chosen date (startDate)
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
  // useEffect(() => {
  //   fetchPrefData && console.log('fetchPrefData: ', fetchPrefData);
  // }, [fetchPrefData]);

  // calculate if current week is due(isDue => not editable, !isDue => editable)
  const isDue = useMemo(() => {
    if (startDate) {
      const today = dayjs();
      const dayOfWeek = today.day();
      const daysSinceMonday = (dayOfWeek + 6) % 7; // Adjust to make Monday (1) the start of the week, thus Monday will be 0
      const currentMonday = today.subtract(daysSinceMonday, 'day');
      const twoWeeksFromMonday = currentMonday.add(13, 'day');
      // return twoWeeksFromMonday.isBefore(startDate);
      return startDate.isBefore(twoWeeksFromMonday);
    }
  }, [startDate]);

  const isSubmitted = useMemo(() => {
    if (fetchPrefData) {
      if (fetchPrefData.submitted) {
        return true;
      } else {
        return false;
      }
    }
  }, [startDate, fetchPrefData]);

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
        value: string | number | string[] | number[];
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
      console.log('Init formState:', dataList);

      addInputs(dataList);
    }
  }, [fetchPrefData]);
  useEffect(() => {
    console.log('watch formState:', formState);
  }, [formState]);

  // Template Modal
  const [templateModalVisible, setTemplateModalVisible] = useState(false);
  const handleOpenTemplate = () => {
    setTemplateModalVisible(true);
  };
  const handleSelectTemplate = (template: PrefTemplateInputs) => {
    // console.log('HIT:', template);
    const fieldsToRemove = Object.keys(template).map(key => key as keyof typeof formSchema.shape);
    console.log('fieldsToRemove:', fieldsToRemove);
    removeInputs(fieldsToRemove);

    let dataList = Object.entries(template).map(([key, val]) => {
      return { field: key as keyof typeof formSchema.shape, value: val };
    });
    addInputs(dataList);
    console.log('dataList', dataList);
    setTemplateModalVisible(false);

    // addInputs(dataList);
  };

  // Preference Update
  const [updatePreference, { ...updatePrefOthers }] = useUpdatePreferenceMutation();
  const handlePrefUpdate = async () => {
    if (formValidity) {
      try {
        let data: updatePreferenceData = {
          nurse_id: user.uId,
          start_date: startDate?.format('YYYY-MM-DD') as string,
          hospitals_ranking: formState.HospitalsRanking?.content as number[],
          hours_per_week: formState.hoursPerWeek?.content as number,
          max_hours_per_shift: formState.maxHoursPerShift?.content as number,
          preferred_week_days: formState.preferredWeekDays?.content as string[],
          time_of_day: formState.timeOfDay?.content as string,
        };
        console.log('!! Update: ', data);

        let res = await updatePreference(data).unwrap();
        // console.log('update res: ', res);
        dispatch(showAlert({ msg: 'Preference Updated.', severity: 'success' }));
      } catch (error: any) {
        console.log('!!! Error Updating:', error);
      }
    } else {
      dispatch(showAlert({ msg: 'preference form invalid.', severity: 'error' }));
    }
  };

  // Preference Submit
  const [createPreference, { ...createPrefOthers }] = useCreatePreferenceMutation();
  const handlePrefSubmit = async () => {
    if (formValidity) {
      try {
        let data: CreatePreferenceData = {
          nurse_id: user.uId,
          start_date: startDate?.format('YYYY-MM-DD') as string,
          end_date: endDate?.format('YYYY-MM-DD') as string,
          hospitals_ranking: formState.HospitalsRanking?.content as number[],
          hours_per_week: formState.hoursPerWeek?.content as number,
          max_hours_per_shift: formState.maxHoursPerShift?.content as number,
          preferred_week_days: formState.preferredWeekDays?.content as string[],
          time_of_day: formState.timeOfDay?.content as string,
        };
        console.log('!! Create: ', data);

        let res = await createPreference(data).unwrap();
        // console.log('Create res: ', res);
        dispatch(showAlert({ msg: 'Preference Submitted', severity: 'success' }));
      } catch (error: any) {
        dispatch(showAlert({ msg: 'preference form invalid.', severity: 'error' }));
      }
    }
  };

  return (
    <>
      {templateModalVisible && (
        <TemplateSelectionModal
          onApplyTemplate={handleSelectTemplate}
          visible={templateModalVisible}
          onCloseModal={() => {
            setTemplateModalVisible(false);
          }}
        />
      )}
      <Box
        id="pref-master-container"
        sx={{
          width: '100%', // !!!!!!!!
          height: '100%', // !!!!!!!!
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          p: '10px',
          // backgroundColor: 'red',
          // border: '2px solid red', // Adds a border with a light grey color
        }}
      >
        <div>
          <PrefTopBar
            isDue={isDue as boolean}
            isSubmitted={isSubmitted as boolean}
            onDatesChange={(startDate, endDate) => {
              // console.log(date);
              setStartDate(startDate);
              setEndDate(endDate);
            }}
          />
        </div>

        <Box
          id="pref-mid-container"
          sx={{
            width: '100%',
            flexGrow: 1,
            overflowY: 'scroll', // !!!!!
            scrollbarWidth: 'none', // !!!
            msOverflowStyle: 'none', // !!!!
          }}
        >
          <Box
            id="pref-form-container"
            sx={{
              width: '100%',
              // height: '1000px',
              height: '100%', // !!!!
            }}
          >
            <Grid
              container
              spacing={3}
              // sx={{ padding: '15px 30px' }}
              padding={{ xs: '15px 10px', lg: '15px 30px' }}
            >
              {formState?.hoursPerWeek &&
                formState?.maxHoursPerShift &&
                formState?.preferredWeekDays &&
                formState?.timeOfDay &&
                formState?.HospitalsRanking && (
                  <>
                    <Grid size={{ xs: 12, lg: 6 }} padding={{ xs: '10px', md: '0px' }}>
                      <Typography>Max Hours Per Week</Typography>
                      <Box
                        sx={{
                          p: '3px 20px 0 20px',
                          borderRadius: '5px',
                          border: '1px solid rgba(0, 0, 0, 0.23)',
                        }}
                        onBlur={() => {
                          handleFormBlur('hoursPerWeek');
                        }}
                        onFocus={() => {
                          handleFormFocus('hoursPerWeek');
                        }}
                      >
                        <Slider
                          aria-label="Custom marks"
                          value={formState?.hoursPerWeek?.content as number}
                          onChange={(e, val) => {
                            handleFormChange('hoursPerWeek', val);
                          }}
                          disabled={isDue}
                          // getAriaValueText={valuetext}
                          step={4}
                          min={0}
                          max={84}
                          valueLabelDisplay="auto"
                          marks={[
                            { value: 0, label: '0' },
                            { value: 12, label: '12h' },
                            { value: 24, label: '24h' },
                            { value: 36, label: '36h' },
                            { value: 48, label: '48h' },
                            { value: 60, label: '60h' },
                            { value: 72, label: '72h' },
                            { value: 84, label: '84h' },
                          ]}
                        />
                      </Box>
                      {!!formState.hoursPerWeek.errorMessage &&
                        !!!formState.hoursPerWeek.isFocused && (
                          <Typography color="error">
                            {formState.hoursPerWeek.errorMessage}
                          </Typography>
                        )}
                    </Grid>
                    <Grid size={{ xs: 12, lg: 6 }} padding={{ xs: '10px', md: '0px' }}>
                      <Typography>Max Hours Per Shift</Typography>
                      <Box
                        sx={{
                          p: '3px 20px 0 20px',
                          borderRadius: '5px',
                          border: '1px solid rgba(0, 0, 0, 0.23)',
                        }}
                        onBlur={() => {
                          handleFormBlur('maxHoursPerShift');
                        }}
                        onFocus={() => {
                          handleFormFocus('maxHoursPerShift');
                        }}
                      >
                        <Slider
                          aria-label="MaxHoursPerShift"
                          value={formState.maxHoursPerShift.content as number}
                          onChange={(e, val) => handleFormChange('maxHoursPerShift', val)}
                          disabled={isDue}
                          step={1}
                          min={0}
                          max={12}
                          valueLabelDisplay="auto"
                          marks={[
                            { value: 0, label: '0' },
                            { value: 3, label: '3h' },
                            { value: 6, label: '6h' },
                            { value: 9, label: '9h' },
                            { value: 12, label: '12h' },
                          ]}
                        />
                      </Box>
                      {!!formState.maxHoursPerShift.errorMessage &&
                        !!!formState.maxHoursPerShift.isFocused && (
                          <Typography color="error">
                            {formState.maxHoursPerShift.errorMessage}
                          </Typography>
                        )}
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
                        disabled={isDue}
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
                        // blurOnSelect
                        disableCloseOnSelect
                      />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 6 }} padding={{ xs: '10px', md: '0px' }}>
                      <Autocomplete
                        options={['morning', 'afternoon', 'night']}
                        getOptionLabel={(option: string) => option}
                        value={formState.timeOfDay.content as string}
                        onChange={(event, newValue: string) => {
                          handleFormChange('timeOfDay', newValue);
                        }}
                        disabled={isDue}
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
                        disable={isDue as boolean}
                        initRanking={
                          (formState.HospitalsRanking?.content as number[]).length
                            ? (formState.HospitalsRanking?.content as number[])
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

        <Box
          id="pref-bottom-container"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 3,
            p: '15px',
            height: '70px',
            borderTop: 'solid 1px #475862',
          }}
        >
          {/* <Typography>{isDue ? 'isDue' : 'OK'}</Typography> */}
          <Button disabled={isDue} onClick={handleOpenTemplate} variant="outlined" color="inherit">
            {`Use Preference template`}
          </Button>
          <Button
            disabled={isDue}
            onClick={() => {
              isSubmitted ? handlePrefUpdate() : handlePrefSubmit();
            }}
            variant="contained"
            color="primary"
          >
            {isDue ? 'Not submittable' : isSubmitted ? 'Update' : 'Submit'}
          </Button>
          {/* <Typography>{isSubmitted ? 'submitted' : 'not submitted'}</Typography> */}
        </Box>
      </Box>
    </>
  );
}
