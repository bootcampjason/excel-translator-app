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
  const [filePreviews, setFilePreviews] = useState({}); // { fileName: { sheetName: [...data] } }
  const [expandedSheets, setExpandedSheets] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [fileStatuses, setFileStatuses] = useState({}); // { filename: 'Pending' | 'Translating' | 'Done' | 'Error' }
  const [globalProgress, setGlobalProgress] = useState(0); // 0–100%
  const [completionMessage, setCompletionMessage] = useState('');
  const [showTranslateMore, setShowTranslateMore] = useState(false);

  const handleFileReady = async (file) => {
    setUploadedFiles(prev => [...prev, file]);

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const previews = {};

    workbook.SheetNames.forEach((name) => {
      const worksheet = workbook.Sheets[name];
      // Converts the entire worksheet to a 2D array
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      previews[name] = json;
    });

    setFilePreviews(prev => ({
      ...prev,
      [file.name]: previews
    }));
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
      <h1>Excel Language Translator</h1>

      {isTranslating && (
        <div style={{ margin: '20px 0' }}>
          <p>Translating... ({globalProgress}%)</p>
          <div style={{
            height: 10,
            width: '100%',
            backgroundColor: '#eee',
            borderRadius: 4,
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${globalProgress}%`,
              height: '100%',
              backgroundColor: '#1976d2',
              transition: 'width 0.3s ease'
            }} />
          </div>
          {completionMessage && (
            <p style={{ marginTop: 8, fontWeight: 'bold', color: 'green' }}>{completionMessage}</p>
          )}
        </div>
      )}

      {showTranslateMore && (
        <Button
          variant="outlined"
          color="secondary"
          sx={{ mt: 2 }}
          onClick={() => {
            setUploadedFiles([]);
            setFilePreviews({});
            setExpandedSheets([]);
            setFileStatuses({});
            setGlobalProgress(0);
            setCompletionMessage('');
            setShowTranslateMore(false);
          }}
        >
          Translate More Files
        </Button>
      )}

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
          <ClearAllButton
            onClear={() => {
              setUploadedFiles([]);
              setFilePreviews({});
              setExpandedSheets([]);
              setFileStatuses({});
              setGlobalProgress(0);
            }}
          />
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
        isTranslating={isTranslating}
        setIsTranslating={setIsTranslating}
        fileStatuses={fileStatuses}
        setFileStatuses={setFileStatuses}
        setGlobalProgress={setGlobalProgress}
        setCompletionMessage={setCompletionMessage}
        setShowTranslateMore={setShowTranslateMore}
      />
      {Object.keys(filePreviews).length > 0 && (
        <Button
          variant="outlined"
          size="medium"
          sx={{ mt: 2 }}
          onClick={() => setPreviewVisible((prev) => !prev)}
        >
          {previewVisible ? 'Hide Previews' : 'Show Previews'}
        </Button>

      )}


      {previewVisible && Object.keys(filePreviews).length > 0 && (
        Object.entries(filePreviews).map(([fileName, sheets]) => (
          <div key={fileName} style={{ marginTop: 24 }}>
            <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>
                {fileName}
                {fileStatuses[fileName] && (
                  <span style={{ marginLeft: 12, fontSize: 14, fontWeight: 400, color: '#888' }}>
                    — {fileStatuses[fileName]}
                  </span>
                )}
              </span>
            </h3>

            <SheetSelector
              sheetNames={Object.keys(sheets)}
              sheetPreviews={sheets}
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
        ))
      )}

    </div>
  );
}

export default App;
