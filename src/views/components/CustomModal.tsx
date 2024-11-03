import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

type CustomModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  showSubmitBtn?: boolean;
  disableSubmitBtn?: boolean;
};

export default function CustomModal({
  open,
  onClose,
  title,
  children,
  onSubmit,
  showSubmitBtn = true,
  disableSubmitBtn = false,
}: CustomModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          overflowY: 'auto', // Enable scrolling if content overflows
          bgcolor: 'background.paper',
          borderRadius: '12px',
          width: { xs: '90%', lg: '55%' },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            p: '5px',
            bgcolor: '#eee', // Custom background color for footer
            height: '60px',
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 'bold',
              justifyContent: 'center',
              flexDirection: 'column',
              alignContent: 'center',
            }}
          >
            {title}
          </Typography>
        </Box>
        <Box
          sx={{
            overflowY: 'auto',
            maxHeight: { xs: '70vh', md: '65vh' },
            minHeight: '200px',
            borderTop: '1px solid #e0e0e0',
            borderBottom: '1px solid #e0e0e0',
            p: 1,
            '::-webkit-scrollbar': {
              width: 0, // hides the scrollbar on WebKit browsers
            },
            scrollbarWidth: 'none', // hides the scrollbar on Firefox
            msOverflowStyle: 'none', // hides scrollbar on IE and Edge
          }}
        >
          {children}
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 3,
            p: '15px',
            bgcolor: '#eee', // Custom background color for footer
            height: '70px',
          }}
        >
          <Button onClick={onClose} variant="outlined" color="inherit">
            Close
          </Button>
          {showSubmitBtn && (
            <Button
              onClick={onSubmit}
              disabled={disableSubmitBtn}
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
