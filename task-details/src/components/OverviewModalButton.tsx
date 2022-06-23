import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import {
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Slide,
} from "@mui/material";

interface OwnProps {
  task: any;
}

export default function OverviewModalButton({ task }: OwnProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [checked, setChecked] = useState([]);

  const [acceptanceCriteria, setAcceptanceCriteria] = useState([]);
  useEffect(() => {
    setAcceptanceCriteria(task["Acceptance Criteria"].split(";"));
  }, [task]);

  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        Show Task Overview
      </Button>
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
              top: "50%",
              margin: "auto",
              width: "800px",
              bgcolor: "background.paper",
              borderRadius: "6px",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" sx={{ color: "text.primary" }}>
              Description
            </Typography>
            <Typography variant="body1" sx={{ color: "text.primary", mt: 2 }}>
              {task.Description}
            </Typography>
            <Divider sx={{ mt: 2, mb: 2 }} />
            <Typography variant="h6" sx={{ color: "text.primary" }}>
              Acceptance Criteria
            </Typography>
            <FormControl component="fieldset" variant="standard" sx={{ mt: 1 }}>
              <FormGroup>
                {acceptanceCriteria.map(
                  (a) =>
                    a && (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={checked.includes(a)}
                            onChange={() =>
                              checked.includes(a)
                                ? setChecked(checked.filter((c) => c !== a))
                                : setChecked([...checked, a])
                            }
                            name={a}
                          />
                        }
                        label={a}
                        sx={{ color: "text.primary" }}
                      />
                    )
                )}
              </FormGroup>
            </FormControl>
          </Box>
        </Slide>
      </Modal>
    </div>
  );
}
