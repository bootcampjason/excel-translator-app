import React, { useState } from 'react';
import { translateExcelFile } from '../helpers/translateExcel';
import { saveAs } from 'file-saver';
import {
  Button,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';

function TranslateButton({ file, sourceLang, targetLang, selectedSheets }) {
  const [progress, setProgress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!file) {
      alert('Please upload a file first.');
      return;
    }

    setLoading(true);
    setProgress('Starting translation...');

    try {
      const translatedBlob = await translateExcelFile(
        file,
        sourceLang,
        targetLang,
        (chunk, total) => setProgress(`Translating chunk ${chunk} of ${total}...`)
      );

      saveAs(translatedBlob, file.name.replace(/\.xlsx$/, `_${targetLang}.xlsx`));
      setProgress('✅ Translation complete!');
    } catch (err) {
      console.error(err);
      if (err.message.includes('Microsoft Excel is not installed')) {
        alert("❌ Excel is not available on the server. Please upload a .xlsx file instead.");
        window.location.href = '/'; // Redirect to homepage
      } else {
        setProgress('❌ An error occurred during translation.');
      }
    }

  };

  return (
    <Box mt={4}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleTranslate}
        disabled={loading}
      >
        {loading ? 'Translating...' : 'Generate Excel'}
      </Button>
      {progress && (
        <Box mt={2} display="flex" alignItems="center">
          {loading && <CircularProgress size={18} sx={{ mr: 1 }} />}
          <Typography variant="body2">{progress}</Typography>
        </Box>
      )}
    </Box>
  );
}

export default TranslateButton;
