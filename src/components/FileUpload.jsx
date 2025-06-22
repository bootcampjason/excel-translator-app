import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { convertXlsToXlsx } from '../helpers/xlsToXlsx';

function FileUpload({ onFileReady }) {
  const [fileName, setFileName] = useState('');
  const [isConverting, setIsConverting] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const isXls = file.name.toLowerCase().endsWith('.xls');
    const isXlsx = file.name.toLowerCase().endsWith('.xlsx');

    if (!isXls && !isXlsx) {
      alert('Please upload a .xls or .xlsx file');
      return;
    }

    setFileName(file.name);
    setIsConverting(true);

    try {
      let processedFile;

      if (isXls) {
        const xlsxBlob = await convertXlsToXlsx(file);
        processedFile = new File([xlsxBlob], file.name.replace('.xls', '.xlsx'), {
          type: xlsxBlob.type,
        });
      } else {
        processedFile = file;
      }

      onFileReady(processedFile);
    } catch (error) {
      console.error('Conversion failed:', error);
      alert('Failed to convert file');
    } finally {
      setIsConverting(false);
    }
  }, [onFileReady]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: [] });

  return (
    <Paper
      {...getRootProps()}
      elevation={3}
      sx={{
        border: '2px dashed #1976d2',
        padding: 4,
        textAlign: 'center',
        backgroundColor: isDragActive ? '#e3f2fd' : '#f5f5f5',
        transition: 'background-color 0.3s ease',
        cursor: 'pointer',
      }}
    >
      <input {...getInputProps()} />
      <Typography variant="h6" gutterBottom>
        {isDragActive ? 'Drop your Excel file here...' : 'Drag & drop or click to upload an Excel file'}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        (.xls or .xlsx only)
      </Typography>
      {fileName && (
        <Typography variant="subtitle2" mt={2}>
          📄 {fileName}
        </Typography>
      )}
      {isConverting && (
        <Box mt={2} display="flex" alignItems="center" justifyContent="center">
          <CircularProgress size={20} />
          <Typography variant="body2" ml={1}>Converting...</Typography>
        </Box>
      )}
    </Paper>
  );
}

export default FileUpload;
