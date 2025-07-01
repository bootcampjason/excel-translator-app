import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import FileUpload from './components/FileUpload';
import LanguageSelector from './components/LanguageSelector';
import TranslateAllButton from './components/TranslateAllButton';
import SheetSelector from './components/SheetSelector';
import { Button } from '@mui/material';
import ClearAllButton from './components/ClearAllButton';

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [sourceLang, setSourceLang] = useState('ja');
  const [targetLang, setTargetLang] = useState('ko');
  const [sheetNames, setSheetNames] = useState([]);
  const [sheetPreviews, setSheetPreviews] = useState({});
  const [expandedSheets, setExpandedSheets] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(true);

  const handleFileReady = async (file) => {
    setUploadedFiles(prev => [...prev, file]);

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const sheets = workbook.SheetNames;

    setSheetNames(sheets);

    const previews = {};
    for (const name of sheets) {
      const worksheet = workbook.Sheets[name];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      previews[name] = json;
    }
    setSheetPreviews(previews);
  };

  useEffect(() => {
    console.log('sheetPreviews', sheetPreviews)
  }, [sheetPreviews]);

  useEffect(() => {
    console.log('uploadedFiles', uploadedFiles)
  }, [uploadedFiles]);

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h1>Excel Language Translator</h1>

      <FileUpload onFileReady={handleFileReady} />
      {uploadedFiles.length > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '10px',
            padding: '0 10px',
          }}
        >
          <p style={{ margin: 0, fontWeight: 500 }}>
            ✅ {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} uploaded
          </p>
          <ClearAllButton onClear={() => setUploadedFiles([])} />
        </div>
      )}

      <LanguageSelector
        sourceLang={sourceLang}
        targetLang={targetLang}
        onChange={(type, val) =>
          type === 'source' ? setSourceLang(val) : setTargetLang(val)
        }
      />

      <TranslateAllButton
        uploadedFiles={uploadedFiles}
        sourceLang={sourceLang}
        targetLang={targetLang}
      />
      {sheetNames.length > 0 && (
        <Button
          variant="outlined"
          size="medium"
          sx={{ mt: 2 }}
          onClick={() => setPreviewVisible((prev) => !prev)}
        >
          {previewVisible ? 'Hide Previews' : 'Show Previews'}
        </Button>

      )}


      <SheetSelector
        sheetNames={sheetNames}
        sheetPreviews={sheetPreviews}
        expandedSheets={expandedSheets}
        onToggleExpand={(sheetName) =>
          setExpandedSheets((prev) =>
            prev.includes(sheetName)
              ? prev.filter((n) => n !== sheetName)
              : [...prev, sheetName]
          )
        }
        previewVisible={previewVisible}
      />
    </div>
  );
}

export default App;
