import React from 'react';
import { Button } from '@mui/material';
import { translateExcelFile } from '../helpers/translateExcel';
import { saveAs } from 'file-saver';
import TranslateIcon from '@mui/icons-material/GTranslate';

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
  setIsCompleted
}) {

  const handleTranslateAll = async () => {
    setIsTranslating(true);
    setGlobalProgress(0);
    setFileStatuses({}); // Reset all statuses

    /*
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];

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
    */

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];

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
    setGlobalProgress(100);
    setCompletionMessage('✅ All files have been translated and downloaded successfully.');
    setIsTranslating(false);
    setIsCompleted(true);
  };

  return (
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


  );
}

export default TranslateAllButton;
