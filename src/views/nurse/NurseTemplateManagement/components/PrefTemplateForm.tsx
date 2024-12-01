import React, { useEffect } from 'react';
import { PrefTemplate } from '../../../../store/apiSlices/prefTemplateApiSlice';
import {
  Accordion,
  AccordionSummary,
  Box,
  Pagination,
  Tooltip,
  Chip,
  AccordionDetails,
  Typography,
  Slider,
  Autocomplete,
  TextField,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { z } from 'zod';
import Grid from '@mui/material/Grid2';

import { useFormState } from '../../../../shared/utils/useFormState';
import HospitalsRanking from '../../PreferenceManagement/components/HospitalsRanking';

interface PrefTemplateFormProps {
  initTemplate: PrefTemplate;
  accordionWidth?: string;
}

let formSchema = z.object({
  templateName: z.string().min(1, { message: 'template name must be billed.' }),
  maxHoursPerShift: z
    .number()
    .lte(12, { message: 'must smaller or equal 12' })
    .gte(1, { message: 'must greater or equal 1' }),
  hoursPerWeek: z
    .number()
    .lte(84, { message: 'must smaller or equal 84' })
    .gte(1, { message: 'must greater or equal 1' }),
  timeOfDay: z.string().min(1, { message: 'must selcet time of day' }),
  preferredWeekDays: z.array(z.string()).min(1, { message: 'must select at least one weekday' }),
  HospitalsRanking: z.array(z.number()).min(1, { message: 'hospital ranking is empty' }),
});

const PrefTemplateForm: React.FC<PrefTemplateFormProps> = ({
  initTemplate,
  accordionWidth = '600px',
}) => {
  const {
    formState,
    handleFormChange,
    handleFormBlur,
    handleFormFocus,
    addInputs,
    removeInputs,
    formIsValid: formValidity,
  } = useFormState(formSchema);

  useEffect(() => {
    if (initTemplate) {
      console.log('initTemplate', initTemplate);

      let dataList: {
        field: keyof typeof formSchema.shape;
        value: string | number | string[] | number[];
      }[] = [
        {
          field: 'templateName' as keyof typeof formSchema.shape,
          value: initTemplate.template_name,
        },
        {
          field: 'hoursPerWeek' as keyof typeof formSchema.shape,
          value: initTemplate.hours_per_week,
        },
        {
          field: 'maxHoursPerShift' as keyof typeof formSchema.shape,
          value: initTemplate.max_hours_per_shift,
        },
        {
          field: 'preferredWeekDays' as keyof typeof formSchema.shape,
          value: initTemplate.preferred_week_days,
        },
        { field: 'timeOfDay' as keyof typeof formSchema.shape, value: initTemplate.time_of_day },
        {
          field: 'HospitalsRanking' as keyof typeof formSchema.shape,
          value: initTemplate.hospitals_ranking,
        },
      ];
      console.log('Init formState:', dataList);

      addInputs(dataList);
    }
  }, [initTemplate]);

  useEffect(() => {
    console.log('formState:', formState);
  }, [formState]);

  return (
    <Box>
      {initTemplate && (
        <Accordion
          sx={{
            // border: '1px solid #000',
            p: '10px 0',
            marginBottom: 2,
            borderRadius: 2,
            backgroundColor: '#f0f4f8',
            width: accordionWidth,
            // '&.Mui-expanded': { backgroundColor: '#f0f4f8' },
            ':hover': { border: '1px solid #000' },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <Tooltip title="Template Name">
              <Chip label={initTemplate.template_name} color="primary" variant="outlined" />
            </Tooltip>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              id="templateFormContainer"
              sx={{
                border: '1px solid black', // Adds a border with a light grey color
              }}
            >
              {formState.templateName &&
                formState.maxHoursPerShift &&
                formState.hoursPerWeek &&
                formState.timeOfDay &&
                formState.preferredWeekDays &&
                formState.HospitalsRanking && (
                  <Grid
                    container
                    spacing={3}
                    // sx={{ padding: '15px 30px' }}
                    padding={{ xs: '15px 10px', lg: '15px 30px' }}
                  >
                    <Grid size={{ xs: 12 }} padding={{ xs: '10px', md: '0px' }}>
                      <TextField
                        id="templateName"
                        label="Template Name"
                        // type="number"
                        value={formState.templateName.content}
                        onChange={e => handleFormChange('templateName', e.target.value)}
                        onBlur={() => handleFormBlur('templateName')}
                        onFocus={() => handleFormFocus('templateName')}
                        error={
                          !!formState.templateName.errorMessage && !formState.templateName.isFocused
                        }
                        helperText={
                          !!formState.templateName.errorMessage &&
                          !formState.templateName.isFocused &&
                          formState.templateName.errorMessage
                        }
                        sx={{ width: '100%' }}
                        variant="outlined"
                        // disabled={!editMode}
                      />
                    </Grid>
                    {/* hoursPerWeek */}
                    <Grid size={{ xs: 12 }} padding={{ xs: '10px', md: '0px' }}>
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
                    {/* maxHoursPerShift */}
                    <Grid size={{ xs: 12 }} padding={{ xs: '10px', md: '0px' }}>
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
                    {/* preferredWeekDays */}
                    <Grid size={{ xs: 12 }} padding={{ xs: '10px', md: '0px' }}>
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
                        // blurOnSelect
                        disableCloseOnSelect
                      />
                    </Grid>
                    {/* timeOfDay */}
                    <Grid size={{ xs: 12 }} padding={{ xs: '10px', md: '0px' }}>
                      <Autocomplete
                        options={['morning', 'afternoon', 'night']}
                        getOptionLabel={(option: string) => option}
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
                    <Grid size={{ xs: 12, lg: 6 }} padding={{ xs: '10px', md: '0px' }}>
                      <HospitalsRanking
                        disable={false}
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
                  </Grid>
                )}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};
export default PrefTemplateForm;
