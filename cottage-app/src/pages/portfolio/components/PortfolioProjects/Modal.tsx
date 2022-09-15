import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

interface OwnProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: JSX.Element | JSX.Element[];
}

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  boxShadow: 24,
  backgroundColor: "white",
  py: 2,
  px: 3,
};

export default function BasicModal({ open, setOpen, children }: OwnProps) {
  const handleClose = () => setOpen(false);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>{children}</Box>
    </Modal>
  );
}
