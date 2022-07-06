import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import CloseIcon from "@mui/icons-material/Close";
import {
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  Slide,
  Stack,
  Tooltip,
} from "@mui/material";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

interface OwnProps {
  task: any;
}

const TOOLTIP_DISPLAY_TIME_PERIOD_MILLIS = 10000;
const TASK_OVERVIEW_DETAIL_PAGE_BASE_URL =
  "https://app.cottage.dev/task-overview";

export default function OverviewModalButton({ task }: OwnProps) {
  const [open, setOpen] = useState(true);
  const handleOpen = () => {
    setOpen(true);

    if (hasSeenTooltip) {
      setShowTooltip(false);
    }
  };
  const handleClose = () => {
    setOpen(false);

    if (!hasSeenTooltip) {
      setTimeout(() => {
        setShowTooltip(true);
        setHasSeenTooltip(true);

        setTimeout(
          () => setShowTooltip(false),
          TOOLTIP_DISPLAY_TIME_PERIOD_MILLIS
        );
      }, 200);
    }
  };
  const handleOpenNewTab = () => {
    window.open(
      `${TASK_OVERVIEW_DETAIL_PAGE_BASE_URL}?recordId=${task["Record ID"]}`,
      "_blank"
    );
    handleClose();
  };

  const [showTooltip, setShowTooltip] = useState(false);
  const [hasSeenTooltip, setHasSeenTooltip] = useState(false);

  const [checked, setChecked] = useState([]);

  const [acceptanceCriteria, setAcceptanceCriteria] = useState([]);
  useEffect(() => {
    setAcceptanceCriteria(
      task["Acceptance Criteria"] && task["Acceptance Criteria"].split(";")
    );
  }, [task]);

  return (
    <div>
      <Tooltip
        title={
          <Box sx={{ display: "relative" }}>
            <Typography variant="body1" sx={{ p: 1, textAlign: "center" }}>
              Just click here to view the task overview again!
            </Typography>
            <CloseIcon
              fontSize="small"
              sx={{
                position: "absolute",
                top: "5px",
                right: "5px",
                cursor: "pointer",
              }}
              onClick={() => setShowTooltip(false)}
            />
          </Box>
        }
        placement="bottom-end"
        arrow
        open={showTooltip}
      >
        <Button variant="contained" onClick={handleOpen}>
          Show Task Overview
        </Button>
      </Tooltip>
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
              width: "800px",
              bgcolor: "background.paper",
              borderRadius: "6px",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Stack direction="row-reverse">
              <Box
                onClick={handleClose}
                sx={{ cursor: "pointer", p: 2, mt: -2, mr: -2 }}
              >
                <CloseIcon sx={{ color: "text.primary" }} />
              </Box>
            </Stack>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h6" sx={{ color: "text.primary" }}>
                  Figma Design Preview
                </Typography>
                <Stack sx={{ mt: 2 }}>
                  <iframe
                    src={task["Figma Embed"]}
                    width="350"
                    height="350"
                    allowFullScreen
                  />
                </Stack>
                <Button
                  variant="contained"
                  sx={{ color: "text.primary", mt: 3, width: "350px" }}
                  onClick={() =>
                    window.open(task["Figma Direct Link"], "_blank")
                  }
                >
                  Open Interactive Figma Design
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" sx={{ color: "text.primary" }}>
                  Description
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "text.primary", mt: 2 }}
                >
                  {task.Description}
                </Typography>
                <Divider sx={{ mt: 2, mb: 2 }} />
                <Typography variant="h6" sx={{ color: "text.primary" }}>
                  Acceptance Criteria
                </Typography>
                <FormControl
                  component="fieldset"
                  variant="standard"
                  sx={{ mt: 1 }}
                >
                  <FormGroup>
                    {acceptanceCriteria &&
                      acceptanceCriteria.map(
                        (a) =>
                          a && (
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={checked.includes(a)}
                                  onChange={() =>
                                    checked.includes(a)
                                      ? setChecked(
                                          checked.filter((c) => c !== a)
                                        )
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
              </Grid>
            </Grid>
            <Stack direction="row-reverse">
              <Button variant="text" color="info" onClick={handleOpenNewTab}>
                Open in new tab <OpenInNewIcon sx={{ ml: 1 }} />
              </Button>
            </Stack>
          </Box>
        </Slide>
      </Modal>
    </div>
  );
}
