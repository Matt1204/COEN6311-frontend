import {
  Accordion,
  AccordionSummary,
  Box,
  Pagination,
  Tooltip,
  Chip,
  AccordionDetails,
  Divider,
} from '@mui/material';
import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useFetchPrefTemplateListQuery } from '../../../../store/apiSlices/prefTemplateApiSlice';
import PrefTemplateForm from './PrefTemplateForm';
import { PrefTemplateInputs } from './PrefTemplateForm';

interface PrefTemplateListProps {
  nurseId: number;
  pageSize?: number;
  selectionOnlyMode?: boolean;
  onSelectTemplate?: (templateInputs: PrefTemplateInputs) => void;
}

const PrefTemplateList: React.FC<PrefTemplateListProps> = ({
  nurseId,
  pageSize = 5,
  selectionOnlyMode = false,
  onSelectTemplate,
}) => {
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  // Fetching templates
  const { data: fetchedTemplateList, ...othersFetched } = useFetchPrefTemplateListQuery(
    { nurse_id: nurseId, current_page: currentPage, page_size: pageSize },
    { skip: !nurseId || !currentPage, refetchOnMountOrArgChange: true }
  );

  const [selectedTemplateId, setSelectedTemplate] = useState<undefined | number>(undefined);

  const handleSelectTemplate = (templateInputs: PrefTemplateInputs, templateId: number) => {
    // console.log('Receive:::::');
    setSelectedTemplate(templateId);
    // console.log(templateInputs);
    // console.log(templateId);

    onSelectTemplate && onSelectTemplate(templateInputs);
  };

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
          // justifyContent: 'space-between',
          alignItems: 'center',
          pt: '20px',
          overflowY: 'scroll',
          scrollbarWidth: 'none', // !!!
          msOverflowStyle: 'none',
        }}
      >
        {fetchedTemplateList &&
          fetchedTemplateList.template_list.map((template, index) => {
            return (
              <Box key={index}>
                <PrefTemplateForm
                  initTemplate={template}
                  selectionOnlyMode={selectionOnlyMode}
                  onSelectTemplate={handleSelectTemplate}
                  isSelected={template.template_id == selectedTemplateId}
                />
              </Box>
            );
          })}
        {!selectionOnlyMode && <PrefTemplateForm selectionOnlyMode={false} />}
      </Box>
      <Box
        id="paginationContainer"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          padding: '5px 0px',
        }}
      >
        <Divider sx={{ width: '100%', mb: '8px' }} />
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
