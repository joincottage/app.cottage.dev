import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import { Button, Grid, Slide, Stack, Typography } from "@mui/material";
import "react-medium-image-zoom/dist/styles.css";
import LoadingButton from "@mui/lab/LoadingButton";

interface OwnProps {
  showModal: boolean;
  onConfirm(): void;
  onClose(): void;
  loading: boolean;
}

export default function ConfirmationModal({
  showModal,
  onConfirm,
  onClose,
  loading,
}: OwnProps) {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  useEffect(() => {
    setOpen(showModal);
  }, [showModal]);

  const handleConfirm = async () => {
    await onConfirm();
    window.location.href = "/submission-success";
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 200,
      }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Slide in={open} direction="down">
        <Box
          sx={{
            position: "absolute" as "absolute",
            margin: "auto",
            width: "400px",
            bgcolor: "background.paper",
            borderRadius: "6px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Grid container spacing={2}>
            <Stack>
              <Typography variant="h6" color="text.primary">
                Are you sure?
              </Typography>
              <Typography variant="body1" color="text.primary">
                Once you submit your code, you will not be able to edit your
                submission.
              </Typography>
              <Stack direction="row-reverse">
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  onClick={handleConfirm}
                >
                  Yes
                </LoadingButton>
                ,
                <Button
                  sx={{ color: "text.primary" }}
                  variant="text"
                  onClick={handleClose}
                >
                  No
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Box>
      </Slide>
    </Modal>
  );
}
