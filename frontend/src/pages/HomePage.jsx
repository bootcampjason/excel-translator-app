import React, { useEffect, useState, useContext } from "react";
import * as XLSX from "xlsx";
import FileUpload from "../components/FileUpload";
import LanguageSelector from "../components/LanguageSelector";
import TranslateAllButton from "../components/TranslateAllButton";
import SheetSelector from "../components/SheetSelector";
import ClearAllButton from "../components/ClearAllButton";
import RestartButton from "../components/RestartButton";
import { Typography, Box, Paper, Button, Snackbar, Alert } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "../App.css";
import TranslationVisual from "../assets/images/excel_tranlate_visual.png";
import { UserContext } from "../context/UserContext";

function HomePage() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("ko");
  const [filePreviews, setFilePreviews] = useState({});
  const [expandedSheets, setExpandedSheets] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [fileStatuses, setFileStatuses] = useState({});
  const [globalProgress, setGlobalProgress] = useState(0);
  const [completionMessage, setCompletionMessage] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [showPreviewMessage, setShowPreviewMessage] = useState(false);
  const [totalChars, setTotalChars] = useState(0);

  const handleFileReady = async (file) => {
    setUploadedFiles((prev) => [...prev, file]);

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const previews = {};

    workbook.SheetNames.forEach((name) => {
      const worksheet = workbook.Sheets[name];
      // Converts the entire worksheet to a 2D array
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      previews[name] = json;
    });

    setFilePreviews((prev) => ({
      ...prev,
      [file.name]: previews,
    }));
    setShowPreviewMessage(true);
  };

  const handleReset = () => {
    setUploadedFiles([]);
    setFilePreviews({});
    setExpandedSheets([]);
    setFileStatuses({});
    setGlobalProgress(0);
    setCompletionMessage("");
    setIsCompleted(false);
    setResetTrigger((prev) => prev + 1); // increment to trigger reset in FileUpload
  };

  return (
    <>
      <Box
        sx={{ minHeight: "100vh", backgroundColor: "#f9fafc", px: 0, pt: 2 }}
      >
        <div style={{ padding: 20, maxWidth: 720, margin: "0 auto" }}>
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Translate Excel Files
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Upload and translate Excel files — keep styles, layout, and
              structure intact.
            </Typography>
          </Box>

          {(isTranslating || globalProgress === 100) && (
            <Box mb={3}>
              <Typography fontWeight={500} mb={1}>
                {isTranslating
                  ? `Translating... (${globalProgress}%)`
                  : `Completed (${globalProgress}%)`}
              </Typography>
              <Box
                sx={{
                  height: 10,
                  width: "100%",
                  backgroundColor: "#e0e0e0",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <Box
                  className={isTranslating ? "progress-fill-animated" : ""}
                  sx={{
                    width: `${globalProgress}%`,
                    height: "100%",
                    backgroundColor: "#1976d2",
                    transition: "width 0.3s ease",
                  }}
                />
              </Box>
              {completionMessage && (
                <Typography
                  mt={1}
                  fontWeight={600}
                  color="success.main"
                  fontSize="0.95rem"
                >
                  {completionMessage}
                </Typography>
              )}
            </Box>
          )}

          <FileUpload
            onFileReady={handleFileReady}
            resetTrigger={resetTrigger}
            disabled={isTranslating || isCompleted}
            setTotalChars={setTotalChars}
          />

          {uploadedFiles.length > 0 && !isTranslating && !isCompleted && (
            <Box
              mt={2}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography fontWeight={500}>
                ✅ {uploadedFiles.length} file
                {uploadedFiles.length > 1 ? "s" : ""} uploaded
                {totalChars > 0 && (
                  <Box
                    component="span"
                    sx={{
                      color: "primary.main",
                      fontWeight: "bold",
                      ml: 1,
                      display: "inline-block",
                    }}
                  >
                    — {totalChars.toLocaleString()} characters
                  </Box>
                )}
              </Typography>
              <ClearAllButton onClear={handleReset} />
            </Box>
          )}

          <Box mt={3}>
            <LanguageSelector
              sourceLang={sourceLang}
              targetLang={targetLang}
              onChange={(type, val) =>
                type === "source" ? setSourceLang(val) : setTargetLang(val)
              }
            />
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <TranslateAllButton
              uploadedFiles={uploadedFiles}
              sourceLang={sourceLang}
              targetLang={targetLang}
              isTranslating={isTranslating}
              setIsTranslating={setIsTranslating}
              setFileStatuses={setFileStatuses}
              setGlobalProgress={setGlobalProgress}
              setCompletionMessage={setCompletionMessage}
              isCompleted={isCompleted}
              setIsCompleted={setIsCompleted}
              totalChars={totalChars}
            />

            {isCompleted && <RestartButton handleReset={handleReset} />}
          </Box>

          {Object.keys(filePreviews).length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 8,
              }}
            >
              <Button
                variant="text"
                size="medium"
                onClick={() => setPreviewVisible((prev) => !prev)}
                endIcon={
                  previewVisible ? (
                    <ExpandLessIcon sx={{ fontSize: 20 }} />
                  ) : (
                    <ExpandMoreIcon sx={{ fontSize: 20 }} />
                  )
                }
                sx={{
                  mt: 1,
                  alignSelf: "flex-end",
                  fontWeight: "bold",
                  color: "#1976d2",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#e3f2fd",
                  },
                }}
              >
                {previewVisible ? "Hide Previews" : "Show Previews"}
              </Button>
              <Snackbar
                open={showPreviewMessage}
                autoHideDuration={4000}
                onClose={() => setShowPreviewMessage(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              >
                <Alert
                  severity="info"
                  sx={{
                    width: "100%",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    background: "linear-gradient(to right, #e8f5e9, #ffffff)", // soft green background
                    color: "#1b5e20", // dark readable green text
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                  onClose={() => setShowPreviewMessage(false)}
                >
                  Scroll down to see the sheet preview.
                </Alert>
              </Snackbar>
            </div>
          )}

          {/* 📄 Sheet Preview Section */}
          {previewVisible &&
            Object.entries(filePreviews).map(([fileName, sheets]) => {
              const isTranslatingThisFile =
                fileStatuses[fileName] === "Translating";
              const statusColor =
                fileStatuses[fileName] === "Done"
                  ? "success.main"
                  : fileStatuses[fileName] === "Error"
                  ? "error.main"
                  : "warning.main";

              return (
                <Box key={fileName} sx={{ mt: 6, mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      📄 {fileName}
                    </Typography>
                    {fileStatuses[fileName] && (
                      <Box
                        sx={{
                          fontSize: 14,
                          fontWeight: 500,
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          backgroundColor: statusColor,
                          color: "#fff",
                        }}
                      >
                        {fileStatuses[fileName]}
                      </Box>
                    )}
                  </Box>

                  {isTranslatingThisFile && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                        color: "#1976d2",
                      }}
                    >
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          border: "2px solid #1976d2",
                          borderTop: "2px solid transparent",
                          borderRadius: "50%",
                          mr: 1,
                          animation: "spin 1s linear infinite",
                        }}
                      />
                      <Typography variant="body2">
                        Translating... (This may take a couple of minutes)
                      </Typography>
                    </Box>
                  )}

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
                  />
                </Box>
              );
            })}
          {/* How It Works Section */}
          <Box
            sx={{
              mt: 10,
              display: "flex",
              justifyContent: "center",
              // px: 2,
            }}
          >
            <Box
              component="img"
              src={TranslationVisual} // replace with actual path or import
              alt="Excel translation visual from French to English"
              sx={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Box>

          {/* Benefits Section */}
          <Box
            sx={{
              mt: 8,
              px: 2,
              py: 5,
              background: "linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%)",
              borderRadius: 3,
              textAlign: "center",
              border: "1px solid #c8e6c9",
            }}
          >
            <Typography
              variant="h5"
              fontWeight={700}
              gutterBottom
              color="#1b5e20"
            >
              Everything You Need to Translate Excel
            </Typography>
            <Typography variant="body1" color="textSecondary" mb={3}>
              Intelligent Excel translation, built for speed, accuracy, and
              simplicity.
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 3,
                maxWidth: 700,
                mx: "auto",
              }}
            >
              {[
                {
                  icon: "📂",
                  text: "Batch upload multiple Excel files effortlessly.",
                },
                {
                  icon: "🎨",
                  text: "Keeps all your styles, layout, and structure intact.",
                },
                {
                  icon: "⚡",
                  text: "Supercharged by GPT-4o for ultra-accurate results.",
                },
                {
                  icon: "💾",
                  text: "Translated files download automatically in one step.",
                },
                {
                  icon: "🔐",
                  text: "Your data never leaves memory — privacy-first design.",
                },
              ].map((item, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    px: 3,
                    py: 2,
                    backgroundColor: "#ffffff",
                    borderRadius: 2,
                    border: "1px solid #a5d6a7",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography fontSize={24}>{item.icon}</Typography>
                  <Typography fontWeight={500}>{item.text}</Typography>
                </Paper>
              ))}
            </Box>
          </Box>

          {/* Security & Privacy Notice */}
          {/* <Paper
          elevation={2}
          sx={{
            mt: 6,
            p: 3,
            backgroundColor: "#f9f9f9",
            borderLeft: "5px solid #d32f2f",
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            🔒 Your Data is Safe
          </Typography>
          <Typography variant="body2" color="textSecondary">
            We take your privacy seriously. All files you upload and any text
            content processed through this service are{" "}
            <strong>never stored, saved, or logged</strong>. Translations are
            handled securely and processed in-memory only. Your data is not used
            for training or shared with any third party.
          </Typography>
        </Paper> */}
        </div>
        <footer
          style={{
            marginTop: "80px",
            padding: "32px 24px",
            backgroundColor: "#f5f5f5",
            borderTop: "1px solid #ddd",
            textAlign: "center",
          }}
        >
          <Typography
            variant="body2"
            color="textSecondary"
            maxWidth={700}
            mx="auto"
          >
            🔒 FileSpeak never stores or logs your data. All translations are
            processed in-memory and permanently discarded after download.
          </Typography>
        </footer>
      </Box>
    </>
  );
}

export default HomePage;
