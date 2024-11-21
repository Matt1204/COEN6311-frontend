import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Box, Chip, Typography, Paper } from '@mui/material';
import { Hospital, useFetchAllHospitalsQuery } from '../../../../store/apiSlices/hospitalApiSlice';
import isEqual from 'lodash/isEqual'; // You may need to install lodash for this

interface HospitalsRankingProps {
  initialRanking: number[];
  onRankingChange: (newRanking: number[]) => void;
}

export default function HospitalsRanking({
  initialRanking,
  onRankingChange,
}: HospitalsRankingProps) {
  const { data: hospitalsData, isLoading: fetchHospitalsLoading } = useFetchAllHospitalsQuery();

  const [hospitalsRanking, setHospitalsRanking] = useState<number[]>([]);

  // Only update state if initialRanking actually changes
  useEffect(() => {
    if (!isEqual(hospitalsRanking, initialRanking)) {
      //   setHospitalsRanking(initialRanking);
      if (hospitalsData?.data && initialRanking.length > 0) {
        setHospitalsRanking(initialRanking);
      } else if (hospitalsData?.data) {
        const defaultRanking = hospitalsData.data.map(hospital => hospital.h_id);
        setHospitalsRanking(defaultRanking);
      }
    }
  }, [initialRanking]); // isEqual checks for deep equality

  // Notify parent only when hospitalsRanking changes and is different from initialRanking
  //   useEffect(() => {
  //     if (!isEqual(hospitalsRanking, initialRanking)) {
  //       onRankingChange(hospitalsRanking);
  //     }
  //   }, [hospitalsRanking, initialRanking, onRankingChange]);

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
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
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
                        backgroundColor: snapshot.isDragging ? '#e0f7fa' : 'none',
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
  );
}
