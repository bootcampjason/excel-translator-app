import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import FileUpload from '../components/FileUpload';
import LanguageSelector from '../components/LanguageSelector';
import TranslateAllButton from '../components/TranslateAllButton';
import SheetSelector from '../components/SheetSelector';
import ClearAllButton from '../components/ClearAllButton';
import AuthAppBar from '../components/AuthAppBar';
import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import '../App.css';

function HomePage() {
  const [user, setUser] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('ko');
  const [filePreviews, setFilePreviews] = useState({});
  const [expandedSheets, setExpandedSheets] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [fileStatuses, setFileStatuses] = useState({});
  const [globalProgress, setGlobalProgress] = useState(0);
  const [completionMessage, setCompletionMessage] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  

  const handleFileReady = async (file) => {
    setUploadedFiles((prev) => [...prev, file]);

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const previews = {};

    workbook.SheetNames.forEach((name) => {
      const worksheet = workbook.Sheets[name];
      // Converts the entire worksheet to a 2D array
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      previews[name] = json;
    });

    setFilePreviews((prev) => ({
      ...prev,
      [file.name]: previews
    }));
  };

  const handleReset = () => {
    setUploadedFiles([]);
    setFilePreviews({});
    setExpandedSheets([]);
    setFileStatuses({});
    setGlobalProgress(0);
    setCompletionMessage('');
    setIsCompleted(false);
    setResetTrigger(prev => prev + 1); // increment to trigger reset in FileUpload
  };

    useEffect(() => {
      const unsub = onAuthStateChanged(auth, setUser);
      return unsub;
    }, []);

  return (
    <>
      <div style={{ padding: 20, maxWidth: 800, margin: '0 auto' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Excel Language Translator
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
          Upload and translate Excel files & download
        </Typography>

        {(isTranslating || globalProgress === 100) && (
          <div style={{ margin: '20px 0' }}>
            <p>{isTranslating ? `Translating... (${globalProgress}%)` : `Completed (${globalProgress}%)`}</p>
            <div style={{
              height: 10,
              width: '100%',
              backgroundColor: '#eee',
              borderRadius: 4,
              overflow: 'hidden'
            }}>
              <div
                className={isTranslating ? 'progress-fill-animated' : ''}
                style={{
                  width: `${globalProgress}%`,
                  height: '100%',
                  backgroundColor: '#1976d2',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            {completionMessage && (
              <p style={{ marginTop: 8, fontWeight: 'bold', color: 'green' }}>{completionMessage}</p>
            )}
          </div>
        )}

        <FileUpload onFileReady={handleFileReady} resetTrigger={resetTrigger} disabled={isTranslating || isCompleted} />

        {uploadedFiles.length > 0 && !isTranslating && !isCompleted && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '10px',
            padding: '0 10px',
          }}>
            <p style={{ margin: 0, fontWeight: 500 }}>
              ✅ {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} uploaded
            </p>
            <ClearAllButton onClear={handleReset} />
          </div>
        )}

        <LanguageSelector
          sourceLang={sourceLang}
          targetLang={targetLang}
          onChange={(type, val) => type === 'source' ? setSourceLang(val) : setTargetLang(val)}
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
          isCompleted={isCompleted}
          setIsCompleted={setIsCompleted}
          user={user}
        />

        {Object.keys(filePreviews).length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <Button
              variant="text"
              size="medium"
              onClick={() => setPreviewVisible(prev => !prev)}
              endIcon={
                previewVisible
                  ? <ExpandLessIcon sx={{ fontSize: 20 }} />
                  : <ExpandMoreIcon sx={{ fontSize: 20 }} />
              }
              sx={{
                mt: 1,
                alignSelf: 'flex-end',
                fontWeight: 'bold',
                color: '#1976d2',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#e3f2fd'
                }
              }}
            >
              {previewVisible ? 'Hide Previews' : 'Show Previews'}
            </Button>
          </div>
        )}

        {isCompleted && (
          <div className="start-over-container">
            <Button
              variant="contained"
              color="success"
              size="large"
              onClick={handleReset}
            >
              <RestartAltIcon /> Start Over
            </Button>
          </div>
        )}

        {previewVisible &&
          Object.entries(filePreviews).map(([fileName, sheets]) => {
            const isTranslatingThisFile = fileStatuses[fileName] === 'Translating';
            return (
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
                  {isTranslatingThisFile && (
                    <span style={{ display: 'flex', alignItems: 'center', color: '#1976d2', fontSize: 14 }}>
                      <span
                        className="spinner"
                        style={{
                          width: 16,
                          height: 16,
                          border: '2px solid #1976d2',
                          borderTop: '2px solid transparent',
                          borderRadius: '50%',
                          marginRight: 8,
                          animation: 'spin 1s linear infinite'
                        }}
                      />
                      Translating... (This may take a couple of minutes)
                    </span>
                  )}
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
            );
          })}

        {/* Benefits Section */}
        <Box
          sx={{
            mt: 3,
            mb: 4,
            px: 2,
            py: 2,
            backgroundColor: '#f9f9f9',
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography variant="h6" align="center" gutterBottom sx={{ fontWeight: 600 }}>
            Why Use This App?
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon sx={{ color: 'green' }} />
              </ListItemIcon>
              <ListItemText primary="Upload multiple Excel files at once" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon sx={{ color: 'green' }} />
              </ListItemIcon>
              <ListItemText primary="Preserves Excel formatting and styles" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon sx={{ color: 'green' }} />
              </ListItemIcon>
              <ListItemText primary="Supports both .xls and .xlsx formats" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon sx={{ color: 'green' }} />
              </ListItemIcon>
              <ListItemText primary="Fast and secure translation powered by GPT" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon sx={{ color: 'green' }} />
              </ListItemIcon>
              <ListItemText primary="Translated files automatically downloaded" />
            </ListItem>
          </List>
        </Box>

        {/* Security & Privacy Notice */}
        <Paper
          elevation={2}
          sx={{
            mt: 6,
            p: 3,
            backgroundColor: '#f9f9f9',
            borderLeft: '5px solid #d32f2f',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            🔒 Your Data is Safe
          </Typography>
          <Typography variant="body2" color="textSecondary">
            We take your privacy seriously. All files you upload and any text content processed through this service are{' '}
            <strong>never stored, saved, or logged</strong>. Translations are handled securely and processed in-memory only.
            Your data is not used for training or shared with any third party.
          </Typography>
        </Paper>
      </div>
    </>
  );
}

export default HomePage;
