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
  FormControl,
  List,
  ListItem,
  FormGroup,
  Grid,
  Slide,
  Stack,
  useMediaQuery,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useLocalStorage } from "usehooks-ts";
import { createTaskInAirtable, updateTaskInAirtable, getEditorContents } from "../utils";
import { Task } from "../types/Task";

const TOOLTIP_DISPLAY_TIME_PERIOD_MILLIS = 10000;
const TASK_OVERVIEW_DETAIL_PAGE_BASE_URL =
  "https://app.cottage.dev/task-overview";

const defaultFigmaLink = "https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FisEfS9oIpv2MnN2vuUGXLk%2FUI%3Fnode-id%3D134%253A1509%26starting-point-node-id%3D134%253A1509"

interface OwnProps {
  task : Task | null 
}

export default function CompetitionFormModalButton({task} : OwnProps) {
  const isOverviewModalTooBig = useMediaQuery("(max-width:1200px)");


  const [draftIsBeingSaved, setDraftIsBeingSaved] = useState(false);

  // State for the entire Modal
  const [open, setOpen] = useState(true);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSave = async () => {
    setDraftIsBeingSaved(true)

    const {files, dependencies} = await getEditorContents();
    // Convert array back to string since in Airtable the AC is stored as string
    const acceptanceCriteriaString = formData["Acceptance Criteria Array"].join(";")
    const newTask : Task = {
      Name: formData.Name,
      "Acceptance Criteria": acceptanceCriteriaString,
      Description: formData.Description,
      "Figma Direct Link": formData["Figma Direct Link"],
      "Figma Embed": formData["Figma Embed"],
    }

    if (!task) {
      const response = await createTaskInAirtable(
        newTask, 
        JSON.stringify(files, null, 2), 
        JSON.stringify(dependencies, null, 2),
        )

      // It's a bit jarring to see the loading spinner flash so quickly
      setTimeout(() => {
        setDraftIsBeingSaved(false);
      }, 2000);
      return;
    }
    console.log(task)

    await updateTaskInAirtable(
      {...newTask, "Record ID" : task["Record ID"]},
      JSON.stringify(files, null, 2),
      JSON.stringify(dependencies, null, 2),
      true
    );

    // It's a bit jarring to see the loading spinner flash so quickly
    setTimeout(() => {
      setDraftIsBeingSaved(false);
    }, 2000);
  }


  // State for Form Data
  const initialForm = task ? {
    Name: task["Name"],
    // Convert string to array and convert it back when persisting data
    "Acceptance Criteria Array": task["Acceptance Criteria"].split(";"),
    Description: task["Description"],
    "Figma Direct Link": task["Figma Direct Link"],
    "Figma Embed": task["Figma Embed"], 
  } : {
    Name: "",
    "Acceptance Criteria Array": [],
    Description: "",
    "Figma Direct Link": "",
    "Figma Embed": "",
  }
  const [formData, setFormData] = useState(initialForm)
  const [showAddACButton, setShowAddACButton] = useState(true)
  const [newAcceptanceCriteria, setNewAcceptanceCriteria] = useState("")
  const [addingNewAC, setAddingNewAC] = useState(false)
  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }
  const handleAddACClick = () => {
    setAddingNewAC(true)
    setShowAddACButton(false)
  }
  const handleCancelAddAC = () => {
    setAddingNewAC(false)
    setNewAcceptanceCriteria("")
    setShowAddACButton(true)
  }
  const handleAddAC = () => {
    setFormData({
      ...formData, 
      ["Acceptance Criteria Array"]: [...formData["Acceptance Criteria Array"], newAcceptanceCriteria]
    })
    setNewAcceptanceCriteria("")
  }
  const handleDeleteAC = (content : string) => {
    setFormData(prevFormData => 
      {
        const index = prevFormData["Acceptance Criteria Array"].findIndex(a => a === content)
        const newAC = Array.from(prevFormData["Acceptance Criteria Array"])
        newAC.splice(index, 1)
        return {
          ...prevFormData,
          ["Acceptance Criteria Array"]: [...newAC]
        }
      })
  }

  return (
    <div>
        <Button
          variant="contained"
          onClick={() => {
            handleOpen();
          }}
        >
          {
            task ? "Edit " : "Add "
          }
          Competition
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
                  Figma Link
                </Typography>
                <FormControl fullWidth sx={{mt: 2}}>
                  <InputLabel htmlFor="comp-figma-link">Figma Direct Link</InputLabel>
                  <OutlinedInput
                    id="comp-figma-link"
                    value={formData["Figma Direct Link"]}
                    name="Figma Direct Link"
                    onChange={handleChange}
                    label="Figma Direct Link"
                  />
                </FormControl>
                <FormControl fullWidth sx={{mt: 2}}>
                  <InputLabel htmlFor="comp-figma-embed-link">Figma Embed Link</InputLabel>
                  <OutlinedInput
                    id="comp-figma-embed-link"
                    value={formData["Figma Embed"]}
                    name="Figma Embed"
                    onChange={handleChange}
                    label="Figma Embed Link"
                  />
                </FormControl>
                <Typography variant="h6" sx={{ color: "text.primary", mt: 2 }}>
                  Figma Design Preview
                </Typography>
                <Stack sx={{ mt: 2 }}>
                  <iframe
                    src={formData["Figma Embed"] === "" ? defaultFigmaLink : formData["Figma Direct Link"]}
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
                  Name
                </Typography>
                <FormControl fullWidth sx={{mt: 2}}>
                  <InputLabel htmlFor="comp-figma-link">Name</InputLabel>
                  <OutlinedInput
                    id="comp-description"
                    value={formData.Name}
                    name="Name"
                    onChange={handleChange}
                    label="Name"
                    multiline
                  />
                </FormControl>
                <Typography variant="h6" sx={{ color: "text.primary", mt:3 }}>
                  Description
                </Typography>
                <FormControl fullWidth sx={{mt: 2}}>
                  <InputLabel htmlFor="comp-figma-link">Description</InputLabel>
                  <OutlinedInput
                    id="comp-description"
                    value={formData.Description}
                    name="Description"
                    onChange={handleChange}
                    label="Description"
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
                  {formData["Acceptance Criteria Array"].map((a : string, index) => {
                    if (!a || a.trim() === "") return

                    return (
                    <ListItem key={index}>
                      <IconButton onClick={() => handleDeleteAC(a)}>
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
                    name="newAcceptanceCriteriea"
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
                {
                  showAddACButton && <Button variant="contained" onClick={handleAddACClick}>Add Acceptance Criteria</Button>
                }
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
            <LoadingButton
              loading={draftIsBeingSaved}
              variant="contained"
              onClick={handleSave}
            >
              <SaveIcon sx={{ mr: 1 }} />
              { task ? "Save" : "Add"} 
            </LoadingButton>,
            <Button  onClick={handleClose}>Cancel</Button>
            </Box>
          </Box>
        </Slide>
      </Modal>
    </div>
  );
}