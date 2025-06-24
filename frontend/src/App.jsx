import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import FileUpload from './components/FileUpload';
import LanguageSelector from './components/LanguageSelector';
import TranslateButton from './components/TranslateButton';
import SheetSelector from './components/SheetSelector';
import { Button } from '@mui/material';

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [sourceLang, setSourceLang] = useState('ja');
  const [targetLang, setTargetLang] = useState('ko');
  const [sheetNames, setSheetNames] = useState([]);
  const [sheetPreviews, setSheetPreviews] = useState({});
  const [expandedSheets, setExpandedSheets] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(true);

  const handleFileReady = async (file) => {
    setUploadedFile(file);

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

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h1>Excel Language Translator</h1>

      <FileUpload onFileReady={handleFileReady} />
      <LanguageSelector
        sourceLang={sourceLang}
        targetLang={targetLang}
        onChange={(type, val) =>
          type === 'source' ? setSourceLang(val) : setTargetLang(val)
        }
      />
      <TranslateButton
        file={uploadedFile}
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
