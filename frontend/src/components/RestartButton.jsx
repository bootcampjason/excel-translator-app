import React from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Button, Box } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

function RestartButton({ handleReset }) {
  return (
    <Box mt={3} display="flex" gap={2}>
      <Button
        variant="contained"
        color="success"
        size="large"
        
        startIcon={<RestartAltIcon />}
        onClick={handleReset}
        sx={{
          mt: 3,
          px: 3,
        }}
      >
        Start Over
      </Button>
    </Box>
  );
}

export default RestartButton;
