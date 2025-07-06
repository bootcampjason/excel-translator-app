import React, { useRef, useState } from 'react';
import { Button, Box, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { translateExcelFile } from '../helpers/translateExcel';
import { saveAs } from 'file-saver';
import TranslateIcon from '@mui/icons-material/GTranslate';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import StopIcon from '@mui/icons-material/Stop';

function TranslateAllButton({
  uploadedFiles,
  sourceLang,
  targetLang,
  isTranslating,
  setIsTranslating,
  fileStatuses,
  setFileStatuses,
  setGlobalProgress,
  setCompletionMessage,
  isCompleted,
  setIsCompleted,
  onCancelRefReset, // new optional prop for start-over reset
}) {
  const navigate = useNavigate();
  const shouldCancelRef = useRef(false);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'info' });
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const showSnackbar = (message, severity = 'info') => {
    setSnack({ open: true, message, severity });
  };

  const handleTranslateAll = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      navigate('/login');
      return;
    }

    shouldCancelRef.current = false;
    if (onCancelRefReset) onCancelRefReset(shouldCancelRef); // notify ClearAllButton

    setIsTranslating(true);
    setGlobalProgress(0);
    setFileStatuses({}); // Reset all statuses

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];

      if (shouldCancelRef.current) {
        showSnackbar('Translation cancelled.');
        break;
      }

      try {
        setFileStatuses(prev => ({ ...prev, [file.name]: 'Translating' }));

        const { translatedBlob, filename } = await translateExcelFile(file, sourceLang, targetLang);
        saveAs(translatedBlob, filename);

        setFileStatuses(prev => ({ ...prev, [file.name]: 'Done' }));
      } catch (err) {
        console.error(`[ERROR] ${file.name} failed to translate:`, err);
        setFileStatuses(prev => ({ ...prev, [file.name]: 'Error' }));
      }

      // Update global progress
      const percent = Math.round(((i + 1) / uploadedFiles.length) * 100);
      setGlobalProgress(percent);
    }
    setIsTranslating(false);
    setIsCompleted(true);

    if (!shouldCancelRef.current) {
      setGlobalProgress(100);
      setCompletionMessage('✅ All files have been translated and downloaded successfully.');
    }
  };
  const handleCancelConfirm = () => {
    shouldCancelRef.current = true;
    setIsTranslating(false);
    setShowCancelConfirm(false);
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
          onClick={setShowCancelConfirm}
          size="large"
          sx={{
            mt: 3,
            px: 3,
          }}
        >
          Cancel
        </Button>
      )}

      <Dialog
        open={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(1px)',
          },
        }}>
        <DialogTitle>Cancel Translation?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to stop the translation process? Files that are not yet translated will not be processed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCancelConfirm(false)} size="large" color="primary">
            No, Continue
          </Button>
          <Button onClick={handleCancelConfirm} size="large" color="error">
            Yes, Stop
          </Button>
        </DialogActions>
      </Dialog>
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
