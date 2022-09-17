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
  useMediaQuery,
} from "@mui/material";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useLocalStorage } from "usehooks-ts";

interface OwnProps {
  task: any;
}

const TOOLTIP_DISPLAY_TIME_PERIOD_MILLIS = 10000;
const TASK_OVERVIEW_DETAIL_PAGE_BASE_URL =
  "https://app.cottage.dev/task-overview";

export default function OverviewModalButton({ task }: OwnProps) {
  const isOverviewModalTooBig = useMediaQuery("(max-width:1200px)");
  const [hasSeenTooltip, setHasSeenTooltip] = useLocalStorage(
    "hasSeenTooltip",
    false
  );

  const [open, setOpen] = useState(false);
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
    // @ts-ignore
    //window.posthog.capture("opened task details modal in new tab");

    window.open(
      `${TASK_OVERVIEW_DETAIL_PAGE_BASE_URL}?recordId=${task["Record ID"]}`,
      "_blank"
    );
    handleClose();
  };

  const [showTooltip, setShowTooltip] = useState(false);

  const [checked, setChecked] = useState([]);

  const [acceptanceCriteria, setAcceptanceCriteria] = useState([]);
  useEffect(() => {
    setAcceptanceCriteria(
      task["Acceptance Criteria"] && task["Acceptance Criteria"].split(";")
    );
  }, [task]);

  return (
    <div>
        <Button
          variant="contained"
          onClick={() => {
            handleOpen();
            
            // @ts-ignore
            //window.posthog.capture("clicked 'Show task overview'");
          }}
        >
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
              margin: "auto",
              width: isOverviewModalTooBig ? "800px" : "1200px",
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
                  onClick={() => {
                    // @ts-ignore
                    //window.posthog.capture("opened Figma design in new tab");

                    window.open(task["Figma Direct Link"], "_blank");
                  }}
                >
                  Open Interactive Figma Design
                </Button>
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  maxHeight: "70vh",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
              >
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
                                  onChange={() => {
                                    // @ts-ignore
                                    //window.posthog.capture(
                                    //  "checked a checkbox in acceptance criteria"
                                    //);

                                    return checked.includes(a)
                                      ? setChecked(
                                          checked.filter((c) => c !== a)
                                        )
                                      : setChecked([...checked, a]);
                                  }}
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
              <Button
                variant="text"
                color="info"
                onClick={handleOpenNewTab}
                sx={{ mt: 3 }}
              >
                Open this window in new tab <OpenInNewIcon sx={{ ml: 1 }} />
              </Button>
            </Stack>
          </Box>
        </Slide>
      </Modal>
    </div>
  );
}
