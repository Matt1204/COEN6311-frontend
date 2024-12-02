import React, { useEffect, useState } from 'react';
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
  Button,
  Fab,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { z } from 'zod';
import Grid from '@mui/material/Grid2';
import EditIcon from '@mui/icons-material/Edit';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

import { useFormState } from '../../../../shared/utils/useFormState';
import HospitalsRanking from '../../PreferenceManagement/components/HospitalsRanking';
import {
  useUpdatePrefTemplateMutation,
  UpdatePrefTemplateArgs,
  useCreatePrefTemplateMutation,
  CreatePrefTemplateArgs,
} from '../../../../store/apiSlices/prefTemplateApiSlice';
import { useAppDispatch, useAppSelector } from '../../../../store/storeHooks';
import { showAlert } from '../../../../store/alertSlice';

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

export interface PrefTemplateInputs {
  max_hours_per_shift: number;
  hours_per_week: number;
  time_of_day: string;
  preferred_week_days: string[];
  hospitals_ranking: string[];
}

interface PrefTemplateFormProps {
  initTemplate?: PrefTemplate;
  selectionOnlyMode?: boolean;
  accordionWidth?: string;
  onSelectTemplate?: (templateInputs: PrefTemplateInputs, templateId: number) => void;
  isSelected?: boolean;
}

const PrefTemplateForm: React.FC<PrefTemplateFormProps> = ({
  initTemplate = undefined,
  selectionOnlyMode = true,
  accordionWidth = '600px',
  onSelectTemplate,
  isSelected = false,
}) => {
  const userSlice = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  // Accordion collapse OR expand
  const [isExpanded, setIsExpanded] = useState(false);

  const {
    formState,
    handleFormChange,
    handleFormBlur,
    handleFormFocus,
    addInputs,
    removeInputs,
    formIsValid: formValidity,
  } = useFormState(formSchema);

  const initializeFormState = () => {
    let dataList: {
      field: keyof typeof formSchema.shape;
      value: string | number | string[] | number[];
    }[] = [
      {
        field: 'templateName' as keyof typeof formSchema.shape,
        value: initTemplate?.template_name ? initTemplate.template_name : '',
      },
      {
        field: 'hoursPerWeek' as keyof typeof formSchema.shape,
        value: initTemplate?.hours_per_week ? initTemplate.hours_per_week : 36,
      },
      {
        field: 'maxHoursPerShift' as keyof typeof formSchema.shape,
        value: initTemplate?.max_hours_per_shift ? initTemplate.max_hours_per_shift : 8,
      },
      {
        field: 'preferredWeekDays' as keyof typeof formSchema.shape,
        value: initTemplate?.preferred_week_days ? initTemplate.preferred_week_days : [],
      },
      {
        field: 'timeOfDay' as keyof typeof formSchema.shape,
        value: initTemplate?.time_of_day ? initTemplate.time_of_day : '',
      },
      {
        field: 'HospitalsRanking' as keyof typeof formSchema.shape,
        value: initTemplate?.hospitals_ranking ? initTemplate.hospitals_ranking : [],
      },
    ];
    // console.log('Init formState:', dataList);

    addInputs(dataList);
  };

  useEffect(() => {
    initializeFormState();
  }, [initTemplate]);

  useEffect(() => {
    console.log('formState:', formState);
  }, [formState]);

  // Select template
  const hadnleTemplateSelect = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (selectionOnlyMode && initTemplate && formState && onSelectTemplate) {
      // let templateData: PrefTemplateInputs = {};
      let templateData: { [key: string]: any } = {};
      Object.entries(formState).forEach(([key, val]) => {
        templateData[key] = val['content'];
      });
      // console.log('select:', templateData);
      const templateId = initTemplate.template_id;
      if (templateData && templateId) {
        const { templateName, ...templateInputs } = templateData;
        onSelectTemplate(templateInputs as PrefTemplateInputs, templateId);
      } else {
        console.log('Not sufficient');
      }
    }
  };

  // Edit Template
  const [editable, setEditable] = useState(!!!initTemplate);

  const [updateTemplate, updateResults] = useUpdatePrefTemplateMutation();
  const [createTemplate, createResults] = useCreatePrefTemplateMutation();
  const handleTemplateSubmit = async () => {
    if (formValidity) {
      // initTemplate has a value ==> UPDATE
      if (initTemplate) {
        let updateTemplateArgs: UpdatePrefTemplateArgs = {
          template_id: initTemplate.template_id,
          template_name: formState.templateName?.content as string,
          max_hours_per_shift: formState.maxHoursPerShift?.content as number,
          hours_per_week: formState.hoursPerWeek?.content as number,
          time_of_day: formState.timeOfDay?.content as string,
          preferred_week_days: formState.preferredWeekDays?.content as string[],
          hospitals_ranking: formState.HospitalsRanking?.content as string[],
        };
        console.log('update args:', updateTemplateArgs);
        let res = await updateTemplate(updateTemplateArgs).unwrap();
        console.log('update res:', res);
        dispatch(showAlert({ msg: res.msg, severity: 'success' }));
        setEditable(false);
      } else {
        let createTemplateArgs: CreatePrefTemplateArgs = {
          nurse_id: userSlice.uId,
          template_name: formState.templateName?.content as string,
          max_hours_per_shift: formState.maxHoursPerShift?.content as number,
          hours_per_week: formState.hoursPerWeek?.content as number,
          time_of_day: formState.timeOfDay?.content as string,
          preferred_week_days: formState.preferredWeekDays?.content as string[],
          hospitals_ranking: formState.HospitalsRanking?.content as string[],
        };
        console.log('create args:', createTemplateArgs);
        let res = await createTemplate(createTemplateArgs).unwrap();
        console.log('create res:', res);
        dispatch(showAlert({ msg: res.msg, severity: 'success' }));
        initializeFormState();
        setIsExpanded(false);
      }
    } else {
      dispatch(showAlert({ msg: 'Form Invalid', severity: 'error' }));
    }
  };

  return (
    <Box sx={{ pb: '10px' }}>
      <Accordion
        expanded={isExpanded}
        onChange={() => {
          setIsExpanded(prev => !prev);
        }}
        sx={{
          border: '1px solid #000',
          p: '6px 0',
          marginBottom: 2,
          borderRadius: 2,
          backgroundColor: isSelected ? '#d3f5d5' : '#f0f4f8',
          width: accordionWidth,
          ':hover': { border: '1.5px dotted #000' },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          <Box
            sx={{
              width: '100%',
              pr: '12px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Tooltip title="Template Name">
              <Chip
                // distinguish Accordion Header between tample name OR create
                label={
                  initTemplate?.template_name ? initTemplate?.template_name : 'Create Template'
                }
                color="primary"
                variant={initTemplate ? 'outlined' : 'filled'} // distinguish Accordion Header between tample name OR create
              />
            </Tooltip>
            {selectionOnlyMode && (
              <Button
                onClick={hadnleTemplateSelect}
                disabled={!formValidity}
                variant={isSelected ? 'contained' : 'outlined'}
                color="info"
                sx={{ borderRadius: '12px', height: '100%' }}
              >
                {isSelected ? 'Selected' : `Select`}
              </Button>
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {isExpanded && (
            <Box
              sx={{
                position: 'absolute',
                bottom: '90px',
                right: '20px',
              }}
            >
              {!selectionOnlyMode &&
                (editable ? (
                  <Fab
                    color="secondary"
                    aria-label="edit"
                    onClick={() => {
                      handleTemplateSubmit();
                    }}
                  >
                    {/* Edit or Create */}
                    {initTemplate ? <SaveAsIcon /> : <NoteAddIcon />}
                  </Fab>
                ) : (
                  <Fab
                    color="secondary"
                    aria-label="edit"
                    onClick={() => {
                      setEditable(true);
                    }}
                  >
                    <EditIcon />
                  </Fab>
                ))}
            </Box>
          )}

          <Box
            id="templateFormContainer"
            sx={{
              border: '1px solid black', // Adds a border with a light grey color
              maxHeight: '400px',
              overflowY: 'scroll',
              p: '10px 0',
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
                  {/* templateName */}
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
                      disabled={!editable || selectionOnlyMode}
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
                        disabled={!editable || selectionOnlyMode}
                      />
                    </Box>
                    {!!formState.hoursPerWeek.errorMessage &&
                      !!!formState.hoursPerWeek.isFocused && (
                        <Typography color="error">{formState.hoursPerWeek.errorMessage}</Typography>
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
                        disabled={!editable || selectionOnlyMode}
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
                      readOnly={!editable || selectionOnlyMode}
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
                      readOnly={!editable || selectionOnlyMode}
                    />
                  </Grid>
                  {/* HospitalsRanking */}
                  <Grid size={{ xs: 12, lg: 6 }} padding={{ xs: '10px', md: '0px' }}>
                    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                      <HospitalsRanking
                        disable={!editable || selectionOnlyMode}
                        initRanking={
                          (formState.HospitalsRanking?.content as number[]).length
                            ? (formState.HospitalsRanking?.content as number[])
                            : []
                        }
                        onRankingChange={newRanking => {
                          newRanking && handleFormChange('HospitalsRanking', newRanking);
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              )}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
export default PrefTemplateForm;
