import {
  Card,
  CardHeader,
  Avatar,
  IconButton,
  CardContent,
  Typography,
  CardActions,
  Button,
  Menu,
  MenuItem,
  Box,
  Modal,
  Paper,
  Stack,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import React from "react";

interface OwnProps {
  taskList: any;
  ordinal: number;
}

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
};

export default function StageAndTasksCard({ taskList, ordinal }: OwnProps) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      {/* @ts-ignore */}
      <PopupState variant="popover" popupId="demo-popup-menu">
        {(popupState) => (
          <Card
            sx={{
              minWidth: 175,
              border: `1px solid ${taskList[0]["Stage Color"]}`,
              borderRadius: "12px",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "8px",
                background: taskList[0]["Stage Color"],
                top: 0,
                bottom: 0,
                left: 0,
              }}
            ></div>
            <CardHeader
              action={
                <>
                  <IconButton
                    aria-label="settings"
                    {...bindTrigger(popupState)}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                  <Menu {...bindMenu(popupState)}>
                    <MenuItem
                      onClick={() => {
                        popupState.close();
                        handleOpen();
                      }}
                    >
                      View Tasks
                    </MenuItem>
                  </Menu>
                  <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={modalStyle}>
                      <Paper elevation={3} sx={{ p: 4 }}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                          >
                            {taskList[0]["Stage"]} Tasks
                          </Typography>
                          <Button variant="outlined" onClick={handleClose}>
                            Cancel
                          </Button>
                        </Stack>
                        <ul
                          style={{
                            maxHeight: 800,
                            overflowY: "scroll",
                            overflowX: "hidden",
                          }}
                        >
                          {taskList.map((t: any) => (
                            <li>
                              <Typography sx={{ mt: 2 }}>{t.Name}</Typography>
                            </li>
                          ))}
                        </ul>
                      </Paper>
                    </Box>
                  </Modal>
                </>
              }
              sx={{ paddingBottom: 0, paddingTop: "4px", height: "4px" }}
            />
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                STAGE {ordinal}
              </Typography>
              <Typography variant="body1" component="div">
                {taskList[0].Stage}
              </Typography>
            </CardContent>
          </Card>
        )}
      </PopupState>
    </>
  );
}
