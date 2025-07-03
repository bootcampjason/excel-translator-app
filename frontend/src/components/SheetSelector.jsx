import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function SheetSelector({ sheetNames, sheetPreviews, expandedSheets, onToggleExpand }) {
  return (
    <div>
      {sheetNames.map((sheetName) => (
        <Accordion
          key={sheetName}
          expanded={expandedSheets.includes(sheetName)}
          onChange={() => onToggleExpand(sheetName)}
          sx={{ mb: 1, border: '1px solid #ccc', borderRadius: 1 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="bold">
              📄 {sheetName}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: 300,
                overflow: 'auto',
                border: '1px solid #ddd',
                backgroundColor: '#fafafa',
              }}
            >
              <Table size="small">
                <TableBody>
                  {sheetPreviews[sheetName].map((row, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      sx={{
                        backgroundColor: rowIndex % 2 === 0 ? '#fff' : '#f9f9f9',
                      }}
                    >
                      {row.map((cell, colIndex) => (
                        <TableCell key={colIndex} style={{ whiteSpace: 'pre-wrap' }}>
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

export default SheetSelector;
