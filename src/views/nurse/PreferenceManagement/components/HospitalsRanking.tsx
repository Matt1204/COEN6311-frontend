import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Box, Chip, Typography, Paper } from '@mui/material';
import { Hospital, useFetchAllHospitalsQuery } from '../../../../store/apiSlices/hospitalApiSlice';

interface HospitalsRankingProps {
  disable?: boolean;
  initRanking: number[];
  onRankingChange: (newRanking: number[]) => void;
}

export default function HospitalsRanking({
  initRanking,
  onRankingChange,
  disable = false,
}: HospitalsRankingProps) {
  const { data: hospitalsData, isLoading: fetchHospitalsLoading } = useFetchAllHospitalsQuery();

  const [hospitalsRanking, setHospitalsRanking] = useState<number[]>([]);

  // Only update state if initialRanking actually changes
  useEffect(() => {
    //   setHospitalsRanking(initialRanking);
    if (hospitalsData?.data && initRanking.length > 0) {
      // console.log(`!!!!!! init with props`, initialRanking);
      setHospitalsRanking(initRanking);
    } else if (hospitalsData?.data) {
      const defaultRanking = hospitalsData.data.map(hospital => hospital.h_id);
      // console.log(`!!!!!! init with default`, defaultRanking);
      setHospitalsRanking(defaultRanking);
    }
  }, [initRanking, hospitalsData]); // isEqual checks for deep equality

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination || destination.index === source.index) {
      return;
    }

    const newHospitalsRanking = Array.from(hospitalsRanking);
    const [removed] = newHospitalsRanking.splice(source.index, 1);
    newHospitalsRanking.splice(destination.index, 0, removed);

    setHospitalsRanking(newHospitalsRanking);
    onRankingChange(newHospitalsRanking);
  };

  if (fetchHospitalsLoading || !hospitalsData?.data) {
    return <Typography>Loading...</Typography>; // Or any other loading indicator
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" isDropDisabled={disable}>
          {provided => (
            <Paper
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{ width: '100%', mx: 'auto', my: 2, padding: 2 }}
              elevation={3}
            >
              {hospitalsRanking.map((hospitalId, index) => (
                <Draggable
                  key={hospitalId.toString()}
                  draggableId={hospitalId.toString()}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{ mb: 1, textAlign: 'center' }}
                    >
                      <Chip
                        label={
                          <Typography variant="body2" component="div">
                            {'#'}
                            {index + 1}{' '}
                            {
                              hospitalsData.data.find(hospital => hospital.h_id === hospitalId)
                                ?.h_name
                            }
                          </Typography>
                        }
                        sx={{
                          width: '75%',
                          fontSize: 16,
                          backgroundColor: disable
                            ? '#e0e0df'
                            : snapshot.isDragging
                              ? '#e0f7fa'
                              : 'none',
                        }}
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Paper>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}
