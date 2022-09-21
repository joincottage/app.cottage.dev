import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ProfileData from "../../types/ProfileData";

interface OwnProps {
  openModal: () => void;
  hideEditProfileButton: boolean;
}

export default function BoxComponent({ openModal, hideEditProfileButton }: OwnProps) {

  const onEdit = () => {
    openModal()
  }

  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItem: "center",
      }}
    >
      <Typography
        component="h1"
        sx={{
          color: "#111827",
          fontSize: "18px",
          fontWeight: "500",
        }}
      >
        Introduction
      </Typography>
      {!hideEditProfileButton && (
        <Button
          sx={{
            padding: "7px 16px",
            border: "1px solid #E5E7EB",
            boxShadow: "0px 1px 2px rgba(0,0,0,.04)",
            borderRadius: "100px",
            color: "#374151",
            fontSize: "14px",
            fontWeight: 500,
          }}
          onClick={onEdit}
        >
          Edit
        </Button>
      )}
    </Box>
  );
}
