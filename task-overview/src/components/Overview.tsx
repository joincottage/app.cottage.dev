import { Box, Stack, Typography } from "@mui/material";
import React from "react";

interface OwnProps {
  task?: any[];
}

export default function Overview({ task }: OwnProps) {
  return (
    <Box sx={{ position: "absolute", top: 0, bottom: 0, right: 0, left: 0 }}>
      <Stack spacing={2} p={2}>
        <Typography variant="h6">{task ? task[0]["Name"] : ""}</Typography>
      </Stack>
    </Box>
  );
}
