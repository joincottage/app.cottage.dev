import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Columns } from "../../../../types/airtable/schema";
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

export default function Header({
  numProfileFieldsComplete,
  totalFields,
}: {
  numProfileFieldsComplete: number;
  totalFields: number;
}) {
  return (
    <Container >
    <Stack
    direction="column"
    >
      <Typography
        component="h1"
        sx={{
          fontSize: "18px",
          fontWeight: "400",
          color: "#111827",
          textAlign: "center",
        }}
      >
        Completed:
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: "8px",
          position: "relative",
          ml: 1,
          mt: 1,
        }}
      >
        <CheckCircleOutlineIcon
          sx={{
            color: "#F5F5F5",
          }}
        />
        <CircularProgress
          size={20}
          sx={{
            color: "#6366F1",
            position: "absolute",
            top: 2,
            left: 2,
            zIndex: 1,
          }}
          variant="determinate"
          value={(numProfileFieldsComplete / totalFields) * 100}
        />
        <Typography
          variant="h6"
          sx={{
            display: "inline-block",
            fontSize: "14px",
            fontWeight: "500",
            color: "#FFFFFF",
            borderRadius: "4px",
            background: "#6366F1",
            padding: "2px 5px",
            letterSpacing: "2px",
          }}
        >
          {numProfileFieldsComplete}/{totalFields}
        </Typography>
      </Box>
    </Stack>
    </Container>
  );
}
