import { z } from 'zod';
import Grid from '@mui/material/Grid2';
import { useEffect, useMemo } from 'react';
import { Typography, Rating, TextField, Box, Autocomplete, Slider } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

import CustomModal from '../../../components/CustomModal';
import { useFormState } from '../../../../shared/utils/useFormState';
import {
  useCreateReqMutation,
  CreateReqArgs,
  useUpdateReqMutation,
  UpdateReqArgs,
} from '../../../../store/apiSlices/requestApiSlice';
import { useAppSelector, useAppDispatch } from '../../../../store/storeHooks';
import { showAlert } from '../../../../store/alertSlice';
import { useFetchReqQuery } from '../../../../store/apiSlices/requestApiSlice';
import { getNextDayToSubmit } from '../../../../shared/utils/weekMethods';

interface RequestModalProps {
  visible: boolean;
  editMode: boolean; // update,create OR view
  requestId: number | undefined;
  onCloseModal: () => void;
}

let formSchema = z.object({
  shiftDate: z.string().date('date string error....'),
  shiftType: z.string().min(1, { message: 'must selcet shift type' }),
  hoursePerShift: z
    .number()
    .lte(12, { message: 'must smaller or equal 12' })
    .gte(1, { message: 'must greater or equal 1' }),
  nurseNumber: z.number().gte(1, { message: 'nurse number should greater than 1' }),
  minSeniority: z
    .number()
    .gte(1, { message: 'Seniority must be selected' })
    .lte(10, { message: 'Seniority must be selected' }),
});

export default function RequestModal({
  visible,
  editMode = false,
  requestId,
  onCloseModal,
}: RequestModalProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);

  const {
    formState,
    handleFormChange,
    handleFormBlur,
    handleFormFocus,
    addInputs,
    removeInputs,
    formIsValid: formValidity,
  } = useFormState(formSchema);

  //   Initialize form data
  const { data: fetchReqData, ...othersFetchReq } = useFetchReqQuery(
    { request_id: requestId as number },
    { skip: !requestId, refetchOnMountOrArgChange: true }
  );
  useEffect(() => {
    console.log('fetchReqData:', fetchReqData);
  }, [fetchReqData]);

  useEffect(() => {
    let dataList: { field: keyof typeof formSchema.shape; value: string | number }[] = [];
    if (!requestId && !fetchReqData) {
      // create
      dataList = [
        {
          field: 'shiftDate' as keyof typeof formSchema.shape,
          value: getNextDayToSubmit().format('YYYY-MM-DD'),
        },
        { field: 'minSeniority' as keyof typeof formSchema.shape, value: 5 },
        { field: 'shiftType' as keyof typeof formSchema.shape, value: 'morning' },
        { field: 'hoursePerShift' as keyof typeof formSchema.shape, value: 6 },
        { field: 'nurseNumber' as keyof typeof formSchema.shape, value: 1 },
      ];
      console.log('!!!!! Default init: ', dataList);
      addInputs(dataList);
    }
    if (fetchReqData && requestId) {
      dataList = [
        {
          field: 'shiftDate' as keyof typeof formSchema.shape,
          value: fetchReqData.shift_date,
        },
        {
          field: 'minSeniority' as keyof typeof formSchema.shape,
          value: fetchReqData.min_seniority,
        },
        {
          field: 'shiftType' as keyof typeof formSchema.shape,
          value: fetchReqData.shift_type,
        },
        {
          field: 'hoursePerShift' as keyof typeof formSchema.shape,
          value: fetchReqData.hours_per_shift,
        },
        {
          field: 'nurseNumber' as keyof typeof formSchema.shape,
          value: fetchReqData.nurse_number,
        },
      ];
      console.log(`!!!!! Fetch ${requestId} to init:`, dataList);
      addInputs(dataList);
    }
  }, [fetchReqData]);
  useEffect(() => {
    console.log('Modal formState:', formState);
  }, [formState]);

  //   Submit
  const [createReq, { ...othersCreateReq }] = useCreateReqMutation();
  const [updateReq, { ...othersUpdateReq }] = useUpdateReqMutation();
  const handleSubmit = async () => {
    if (formValidity) {
      try {
        // Update
        if (requestId) {
          let day_of_week = dayjs(formState.shiftDate?.content as string).format('dddd');
          let payload: UpdateReqArgs = {
            request_id: requestId,
            supervisor_id: user.uId,
            shift_date: formState.shiftDate?.content as string,
            shift_type: formState.shiftType?.content as string,
            day_of_week,
            hours_per_shift: formState.hoursePerShift?.content as number,
            min_seniority: formState.minSeniority?.content as number,
            nurse_number: formState.nurseNumber?.content as number,
          };
          let res = await updateReq(payload).unwrap();
          console.log('updateReq:', payload);
          console.log('!!! Rse: ', res);
          dispatch(showAlert({ msg: res.message, severity: 'success' }));
          onCloseModal();
        }
        // Create
        else {
          let day_of_week = dayjs(formState.shiftDate?.content as string).format('dddd');
          let payload: CreateReqArgs = {
            supervisor_id: user.uId,
            shift_date: formState.shiftDate?.content as string,
            day_of_week,
            shift_type: formState.shiftType?.content as string,
            hours_per_shift: formState.hoursePerShift?.content as number,
            nurse_number: formState.nurseNumber?.content as number,
            min_seniority: formState.minSeniority?.content as number,
          };

          let res = await createReq(payload).unwrap();
          console.log('createReq:', payload);
          console.log('!!! Rse: ', res);
          dispatch(showAlert({ msg: res.message, severity: 'success' }));
          onCloseModal();
        }
      } catch (error: any) {
        console.log('!!! Error: ', error);
      }
    } else {
      dispatch(showAlert({ msg: 'preference form invalid.', severity: 'error' }));
    }
  };

  return (
    <>
      <CustomModal
        open={visible}
        onClose={() => {
          console.log('close:');
          onCloseModal();
        }}
        onSubmit={handleSubmit}
        title={'Request'}
        showSubmitBtn={editMode}
        disableSubmitBtn={!formValidity}
      >
        <Grid container spacing={4} sx={{ padding: '25px 15px' }}>
          {formState.minSeniority &&
            formState.shiftType &&
            formState.shiftDate &&
            formState.hoursePerShift &&
            formState.nurseNumber && (
              <>
                <Grid size={{ xs: 12, lg: 6 }} padding={{ xs: '10px', md: '0px' }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box
                      onBlur={() => {
                        handleFormBlur('shiftDate');
                      }}
                      onFocus={() => {
                        handleFormFocus('shiftDate');
                      }}

                      // sx={{ backgroundColor: 'grey' }}
                    >
                      <DatePicker
                        label="Shift Date"
                        value={dayjs(formState.shiftDate?.content as string)}
                        onChange={newDate => {
                          newDate && handleFormChange('shiftDate', newDate.format('YYYY-MM-DD'));
                        }}
                        shouldDisableDate={date => {
                          return date && editMode && date.isBefore(getNextDayToSubmit(), 'day');
                        }}
                        sx={{ width: '100%' }}
                        readOnly={!editMode}
                      />
                    </Box>
                  </LocalizationProvider>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }} padding={{ xs: '10px', md: '0px' }}>
                  <Autocomplete
                    options={['morning', 'afternoon', 'night']}
                    getOptionLabel={(option: string) => option}
                    value={formState?.shiftType?.content as string}
                    onChange={(event, newValue: string) => {
                      handleFormChange('shiftType', newValue);
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label="Select time of day"
                        error={
                          !!formState.shiftType?.errorMessage && !formState.shiftType.isFocused
                        }
                        helperText={
                          !!formState.shiftType?.errorMessage && !formState.shiftType?.isFocused
                            ? formState.shiftType?.errorMessage
                            : ''
                        }
                      />
                    )}
                    onBlur={() => {
                      handleFormBlur('shiftType');
                    }}
                    onFocus={() => {
                      handleFormFocus('shiftType');
                    }}
                    disablePortal
                    disableClearable
                    blurOnSelect
                    readOnly={!editMode}
                  />
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
                      handleFormBlur('hoursePerShift');
                    }}
                    onFocus={() => {
                      handleFormFocus('hoursePerShift');
                    }}
                  >
                    <Slider
                      aria-label="hoursePerShift"
                      value={formState.hoursePerShift.content as number}
                      onChange={(e, val) => handleFormChange('hoursePerShift', val)}
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
                      disabled={!editMode}
                    />
                    {!!formState.hoursePerShift.errorMessage &&
                      !!!formState.hoursePerShift.isFocused && (
                        <Typography color="error">
                          {formState.hoursePerShift.errorMessage}
                        </Typography>
                      )}
                  </Box>
                </Grid>
                <Grid
                  size={{ xs: 12, lg: 6 }}
                  padding={{ xs: '10px', md: '0px' }}
                  sx={{ display: 'flex', alignItems: 'end' }}
                >
                  <TextField
                    id="nurseNumber"
                    label="Nurse number"
                    type="number"
                    value={formState.nurseNumber.content}
                    onChange={e => handleFormChange('nurseNumber', +e.target.value)}
                    onBlur={() => handleFormBlur('nurseNumber')}
                    onFocus={() => handleFormFocus('nurseNumber')}
                    error={!!formState.nurseNumber.errorMessage && !formState.nurseNumber.isFocused}
                    helperText={
                      !!formState.nurseNumber.errorMessage &&
                      !formState.nurseNumber.isFocused &&
                      formState.nurseNumber.errorMessage
                    }
                    sx={{ width: '100%' }}
                    variant="outlined"
                    disabled={!editMode}
                  />
                </Grid>
                <Grid
                  size={{ xs: 12, lg: 6 }}
                  padding={{ xs: '10px', md: '0px' }}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <Box>
                    <Typography component="legend">
                      Minimum Seniority: {`${formState?.minSeniority?.content}`}
                    </Typography>
                    <Rating
                      value={formState?.minSeniority?.content as number}
                      onChange={(e, val) => {
                        val && handleFormChange('minSeniority', val);
                      }}
                      // defaultValue={5}
                      max={10}
                      readOnly={!editMode}
                    />
                  </Box>
                </Grid>
              </>
            )}
        </Grid>
      </CustomModal>
    </>
  );
}
