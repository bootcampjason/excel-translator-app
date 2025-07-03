import React from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Button } from '@mui/material';

function ClearAllButton({ onClear }) {
  return (
    <Button
      variant="outlined"
      color="error"
      size="medium"
      sx={{
        ml: 2,
        borderRadius: '20px',
        textTransform: 'none',
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
      }}
      onClick={onClear}
    >
      <DeleteOutlineIcon fontSize="small" sx={{ mr: 0.5 }} />
      Clear All
    </Button>
  );
}

export default ClearAllButton;
