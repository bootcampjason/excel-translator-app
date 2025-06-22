import React from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Button,
} from '@mui/material';

function SheetSelector({
  sheetNames,
  sheetPreviews,
  expandedSheets,
  onToggleExpand,
  previewVisible,
}) {
  if (!sheetNames || sheetNames.length === 0) return null;

  return (
    <Box mt={3}>
      <Typography variant="subtitle1" gutterBottom>
        Sheet Previews:
      </Typography>

      {sheetNames.map((sheet) => {
        const allRows = sheetPreviews?.[sheet] || [];
        const isExpanded = expandedSheets.includes(sheet);
        const rowsToShow = isExpanded ? allRows : allRows.slice(0, 5);

        return (
          <Box key={sheet} mt={2}>
            <Typography variant="subtitle2">{sheet}</Typography>

            {previewVisible && rowsToShow.length > 0 && (
              <Paper variant="outlined" sx={{ mt: 1, p: 1, overflowX: 'auto' }}>
                <Table size="small">
                  <TableBody>
                    {rowsToShow.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <TableCell key={cellIndex}>
                            {String(cell ?? '')}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {allRows.length > 5 && (
                  <Box display="flex" justifyContent="flex-end" mt={1}>
                    <Button
                      size="small"
                      onClick={() => onToggleExpand(sheet)}
                    >
                      {isExpanded ? 'Hide Full Preview' : 'Show Full Preview'}
                    </Button>
                  </Box>
                )}
              </Paper>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

export default SheetSelector;
