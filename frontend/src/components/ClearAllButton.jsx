import React from 'react';
import { Button } from '@mui/material';

function ClearAllButton({ onClear }) {
  return (
    <Button
      variant="outlined"
      size="small"
      color="error"
      sx={{ ml: 2 }}
      onClick={onClear}
    >
      Clear All
    </Button>
  );
}

export default ClearAllButton;
