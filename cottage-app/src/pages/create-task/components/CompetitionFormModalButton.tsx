import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import CloseIcon from "@mui/icons-material/Close";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {
  InputLabel,
  IconButton,
  OutlinedInput,
  ButtonGroup,
  TextField,
  Checkbox,
  Divider,
  FormControl,
  List,
  ListItem,
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

// interface OwnProps {
// }

const TOOLTIP_DISPLAY_TIME_PERIOD_MILLIS = 10000;
const TASK_OVERVIEW_DETAIL_PAGE_BASE_URL =
  "https://app.cottage.dev/task-overview";

const defaultFigmaLink = "https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FisEfS9oIpv2MnN2vuUGXLk%2FUI%3Fnode-id%3D134%253A1509%26starting-point-node-id%3D134%253A1509"
const initialForm = {
  name: "",
  acceptancecriteria: [],
  description: "",
  figmalink: "",
  prize: 0,
  gettingstartedvideo: ""
}

export default function CompetitionFormModalButton() {
  const isOverviewModalTooBig = useMediaQuery("(max-width:1200px)");


  const [open, setOpen] = useState(true);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSave = () => {

  }

  // Form Data
  const [formData, setFormData] = useState(initialForm)
  const [newAcceptanceCriteria, setNewAcceptanceCriteria] = useState("")
  const [addingNewAC, setAddingNewAC] = useState(false)
  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }
  const handleAddACClick = () => {
    setAddingNewAC(true)
  }
  const handleCancelAddAC = () => {
    setAddingNewAC(false)
    setNewAcceptanceCriteria("")
  }
  const handleAddAC = () => {
    setFormData({
      ...formData, 
      acceptancecriteria: [...formData.acceptancecriteria, newAcceptanceCriteria]
    })
    setNewAcceptanceCriteria("")
  }
  const handleDeleteAC = (i : number) => {
    setFormData(prevFormData => 
      ({...prevFormData, 
        acceptancecriteria: prevFormData.acceptancecriteria.splice(i, 1)
      }))
  }

  return (
    <div>
        <Button
          variant="contained"
          onClick={() => {
            handleOpen();
          }}
        >
            Add Competition
        </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-add-competition"
        aria-describedby="modal-modal-form-to-add-competition"
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
                  Figma
                </Typography>
                <FormControl fullWidth>
                  <InputLabel htmlFor="comp-figma-link">Add Figma Link</InputLabel>
                  <OutlinedInput
                    id="comp-figma-link"
                    value={formData.figmalink}
                    name="figmalink"
                    onChange={handleChange}
                    label="Add Figma Link"
                  />
                </FormControl>
                <Typography variant="h6" sx={{ color: "text.primary", mt: 2 }}>
                  Figma Design Preview
                </Typography>
                <Stack sx={{ mt: 2 }}>
                  <iframe
                    src={formData.figmalink === "" ? defaultFigmaLink : formData.figmalink}
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
                <FormControl fullWidth sx={{}}>
                  <InputLabel htmlFor="comp-figma-link">Add Description</InputLabel>
                  <OutlinedInput
                    id="comp-description"
                    value={formData.description}
                    name="description"
                    onChange={handleChange}
                    label="Add Description"
                    multiline
                  />
                </FormControl>
                <Typography
                  variant="body1"
                  sx={{ color: "text.primary", mt: 2 }}
                >
                </Typography>
                <Typography variant="h6" sx={{ color: "text.primary" }}>
                  Acceptance Criteria
                </Typography>
                <List>
                  {formData.acceptancecriteria.map((a, index) => {
                    return (
                    <ListItem key={index}>
                      <IconButton onClick={() => handleDeleteAC(index)}>
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                      <Typography sx={{color: "text.primary"}}>
                        {a}
                      </Typography>
                      </ListItem>)
                  })}
                </List>
                {
                  addingNewAC &&
                <FormControl fullWidth sx={{mt: 2, mb: 2}}>
                  <InputLabel htmlFor="comp-acceptance-criteria">New Acceptance Criteria</InputLabel>
                  <OutlinedInput
                    id="comp-acceptance-criteria"
                    value={newAcceptanceCriteria}
                    name="description"
                    onChange={(e) => {setNewAcceptanceCriteria(e.target.value)}}
                    label="New Acceptance Criteria"
                    multiline
                  />
                  <ButtonGroup variant="contained" 
                    sx={{mt: 1, justifyContent: 'flex-end'}}
                    disableElevation
                    >
                    <Button variant="outlined" 
                      onClick={handleCancelAddAC}
                    >Cancel</Button>
                    <Button onClick={handleAddAC}>Add</Button>
                  </ButtonGroup>
                </FormControl>
                }
                <Button variant="contained" onClick={handleAddACClick}>Add Acceptance Criteria</Button>
                <FormControl
                  component="fieldset"
                  variant="standard"
                  sx={{ mt: 1 }}
                >
                  <FormGroup>
                  </FormGroup>
                </FormControl>
              </Grid>
            </Grid>
            <Box 
              sx={{display: 'flex', 
              flexDirection: 'row-reverse'}}>
            <Button variant="contained" onClick={handleSave}>Save</Button>
            <Button  onClick={handleClose}>Cancel</Button>
            </Box>
          </Box>
        </Slide>
      </Modal>
    </div>
  );
}