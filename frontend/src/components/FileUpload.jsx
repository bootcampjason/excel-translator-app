import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Typography, Paper } from '@mui/material';

function FileUpload({ onFileReady, resetTrigger }) {
  const [fileName, setFileName] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {

    for (const file of acceptedFiles) {
      const isExcel = file.name.toLowerCase().endsWith('.xls') || file.name.toLowerCase().endsWith('.xlsx');
      if (!isExcel) {
        alert(`❌ ${file.name} is not a valid Excel file`);
        continue;
      }

      setFileName(file.name);
      onFileReady(file); // Call your existing logic for each file
    }
  }, [onFileReady]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: [], multiple: true });

  useEffect(() => {
    setFileName('');
  }, [resetTrigger]);

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
      <input {...getInputProps()} multiple />
      <Typography variant="h6" gutterBottom>
        {isDragActive ? 'Drop your Excel file here...' : 'Drag & drop or click to upload Excel file(s)'}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        (.xls or .xlsx only)
      </Typography>
      {fileName && (
        <Typography variant="subtitle2" mt={2}>
          📄 {fileName}
        </Typography>
      )}
    </Paper>
  );
}

export default FileUpload;
