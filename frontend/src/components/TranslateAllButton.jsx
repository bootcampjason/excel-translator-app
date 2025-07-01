import React, { useState } from 'react';
import { Button } from '@mui/material';
import { translateExcelFile } from '../helpers/translateExcel';
import { saveAs } from 'file-saver';

function TranslateAllButton({ uploadedFiles, sourceLang, targetLang }) {
  const [progress, setProgress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTranslateAll = async () => {
    for (const file of uploadedFiles) {
      try {
        setLoading(true);
        setProgress('Starting translation...');
        const { translatedBlob, filename } = await translateExcelFile(file, sourceLang, targetLang);
        if (uploadedFiles.length > 1) {
          saveAs(translatedBlob, filename);
        }
        saveAs(translatedBlob, filename);
      } catch (err) {
        console.error(`[ERROR] ${file.name} failed to translate:`, err);
      }
    }
  };

  return (
    <>
      {uploadedFiles.length > 1 ?
        <Button
          variant="contained"
          color="primary"
          disabled={uploadedFiles.length === 0}
          onClick={handleTranslateAll}
          sx={{ mt: 2 }}
        >
          Generate All Files
        </Button> :
        <Button
          variant="contained"
          color="primary"
          disabled={uploadedFiles.length === 0}
          onClick={handleTranslateAll}
          sx={{ mt: 2 }}
        >
          Generate File
        </Button>
      }
    </>
  );
}

export default TranslateAllButton;
