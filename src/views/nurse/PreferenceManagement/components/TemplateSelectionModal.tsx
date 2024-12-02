import React, { useState } from 'react';

import CustomModal from '../../../components/CustomModal';
import { useAppSelector } from '../../../../store/storeHooks';
import { userSlice } from '../../../../store/userSlice';
import PrefTemplateList from '../../NurseTemplateManagement/components/PrefTemplateList';
import { Box } from '@mui/material';

import { PrefTemplateInputs } from '../../NurseTemplateManagement/components/PrefTemplateForm';

interface TemplateSelectionModal {
  visible: boolean;
  onCloseModal: () => void;
  onApplyTemplate: (templateInputs: PrefTemplateInputs) => void;
}

const TemplateSelectionModal: React.FC<TemplateSelectionModal> = ({
  visible,
  onCloseModal,
  onApplyTemplate,
}) => {
  const userSlice = useAppSelector(state => state.user);

  const [selectedTemplate, setSelectedTemplate] = useState<undefined | PrefTemplateInputs>(
    undefined
  );
  const handleSelectTemplate = (templateInputs: PrefTemplateInputs) => {
    setSelectedTemplate(templateInputs);
  };
  const handleApplyTemplate = () => {
    selectedTemplate && onApplyTemplate(selectedTemplate);
  };

  return (
    <CustomModal
      open={visible}
      onClose={onCloseModal}
      onSubmit={handleApplyTemplate}
      title={'Select Template'}
      fixedContentHeight={550}
      submitBtnText="Apply"
      disableSubmitBtn={!!!selectedTemplate}
    >
      <Box
        sx={{
          width: '100%', // !!!!!!!!
          height: '100%', // !!!!!!!!
          //   flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: '10px 7px 3px 5px',
          //   backgroundColor: 'gray',
          //   backgroundColor: '#f9f9f9',
        }}
      >
        <PrefTemplateList
          nurseId={userSlice.uId}
          pageSize={3}
          selectionOnlyMode={true}
          onSelectTemplate={handleSelectTemplate}
        />
      </Box>
    </CustomModal>
  );
};
export default TemplateSelectionModal;
