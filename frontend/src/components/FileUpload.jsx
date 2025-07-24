import React, { useCallback, useRef, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Typography, Paper } from "@mui/material";
import { estimateChars } from "../helpers/estimateChars";

function FileUpload({ onFileReady, resetTrigger, disabled, setTotalChars }) {
  const [fileName, setFileName] = useState("");

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (disabled) return;

      for (const file of acceptedFiles) {
        const isExcel =
          file.name.toLowerCase().endsWith(".xls") ||
          file.name.toLowerCase().endsWith(".xlsx");
        if (!isExcel) {
          alert(`❌ ${file.name} is not a valid Excel file`);
          continue;
        }
        const numOfChars = await estimateChars(file)
        setTotalChars(preChar => preChar + numOfChars)
        setFileName(file.name);
        onFileReady(file); // Call your existing logic for each file
      }
    },
    [onFileReady]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: [],
    multiple: true,
    disabled,
  });

  useEffect(() => {
    setFileName("");
    setTotalChars(0);
  }, [resetTrigger]);


  return (
    <Paper
      {...getRootProps()}
      elevation={3}
      sx={{
        border: "2px dashed #1976d2",
        padding: 4,
        textAlign: "center",
        backgroundColor: disabled
          ? "#eeeeee"
          : isDragActive
          ? "#e3f2fd"
          : "#f5f5f5",
        transition: "background-color 0.3s ease",
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <input {...getInputProps()} multiple disabled={disabled} />
      <Typography variant="h6" gutterBottom>
        {isDragActive
          ? "Drop your Excel file here..."
          : "Drag & drop or click to upload Excel file(s)"}
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
