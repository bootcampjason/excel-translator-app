import React, { useRef, useState } from 'react';
import { Button, Box, Snackbar, Alert } from '@mui/material';
import { translateExcelFile } from '../helpers/translateExcel';
import { saveAs } from 'file-saver';
import TranslateIcon from '@mui/icons-material/GTranslate';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import StopIcon from '@mui/icons-material/Stop';

function CancelButton ({
  uploadedFiles,
  isTranslating,
  setIsTranslating,
}) {
  const shouldCancelRef = useRef(false);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'info' });

  const handleCancel = () => {
    shouldCancelRef.current = true;
    setIsTranslating(false);
  };

  return (
    <Box mt={3} display="flex" gap={2}>
      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<TranslateIcon />}
        disabled={uploadedFiles.length === 0 || isTranslating}
        onClick={handleTranslateAll}
        sx={{
          mt: 3,
          px: 3,
        }}
      >
        {isTranslating
          ? 'Translating...'
          : uploadedFiles.length > 1
            ? 'Generate All Files'
            : 'Generate File'}
      </Button>
      {isTranslating && (
        <Button
          variant="outlined"
          color="error"
          startIcon={<StopIcon />}
          onClick={handleCancel}
        >
          Stop
        </Button>
      )}

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snack.severity} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default TranslateAllButton;
