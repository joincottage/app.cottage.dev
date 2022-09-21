import React from "react";
import { Box, Checkbox, Typography } from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const completed_text_style = {
  fontSize: "14px",
  textDecoration: "line-through",
  color: "#6B7280",
};

const incomplete_text_style = {
  fontSize: "14px",
  color: "#374151",
};

export default function RadioButton({
  text,
  completed,
}: {
  text: string;
  completed: boolean;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        fontSize: "14px",
      }}
    >
      <Checkbox
        checked={completed}
        // inputProps={{ 'aria-label': 'controlled' }}
        icon={
          <RadioButtonUncheckedIcon
            sx={{
              color: "rgb(38, 97, 246)",
            }}
          />
        }
        checkedIcon={
          <CheckCircleOutlineIcon
            sx={{
              color: "#D1D5DB",
            }}
          />
        }
        sx={{ cursor: "default" }}
      />
      <Typography
        sx={
          completed ? { ...completed_text_style } : { ...incomplete_text_style }
        }
      >
        {text}
      </Typography>
    </Box>
  );
}
