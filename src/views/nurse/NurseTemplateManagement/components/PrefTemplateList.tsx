import {
  Accordion,
  AccordionSummary,
  Box,
  Pagination,
  Tooltip,
  Chip,
  AccordionDetails,
} from '@mui/material';
import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useFetchPrefTemplateListQuery } from '../../../../store/apiSlices/prefTemplateApiSlice';
import PrefTemplateForm from './PrefTemplateForm';

interface PrefTemplateListProps {
  nurseId: number;
}

const PrefTemplateList: React.FC<PrefTemplateListProps> = ({ nurseId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    console.log(value);

    // fetchUserList({
    //   filter: filter as UserFilterType,
    //   page_size: pageSize,
    //   current_page: value,
    // });
  };

  const { data: fetchedTemplateList, ...othersFetched } = useFetchPrefTemplateListQuery(
    { nurse_id: nurseId, current_page: currentPage, page_size: 3 },
    { skip: !nurseId || !currentPage, refetchOnMountOrArgChange: true }
  );

  return (
    <Box
      id="topContainer"
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Box
        id="listContainer"
        sx={{
          flexGrow: '1',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          alignItems: 'center',
        }}
      >
        {fetchedTemplateList &&
          fetchedTemplateList.template_list.map((template, index) => {
            return (
              <Box key={index}>
                <PrefTemplateForm initTemplate={template} />
              </Box>
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
          count={fetchedTemplateList?.page_count}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default PrefTemplateList;
