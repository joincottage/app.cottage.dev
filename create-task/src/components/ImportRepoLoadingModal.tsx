import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import LoadingSpinner from "./LoadingSpinner";
import { Paper } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  width: 400,
  p: 4,
};

interface OwnProps {
  open: boolean;
  setOpen: (b: boolean) => void;
}

export default function ImportRepoLoadingModal({ open, setOpen }: OwnProps) {
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper elevation={3}>
          <Box sx={style}>
            <LoadingSpinner />
          </Box>
        </Paper>
      </Modal>
    </div>
  );
}
