import { Stack, Typography } from "@mui/material";
import React from "react";

interface OwnProps {
  submission: any[];
}

export default function Overview({ submission }: OwnProps) {
  return (
    <Stack spacing={2} p={2}>
      <Typography variant="h6">{submission[0]["Name"]}</Typography>
    </Stack>
  );
}
