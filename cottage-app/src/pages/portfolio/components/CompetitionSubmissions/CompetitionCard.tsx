import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Project from "../../types/Project";
import {
  Box,
  Fade,
  Link,
  Stack,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  Grid,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ProgressiveImage from "react-progressive-graceful-image";
import EditProject from "../EditProject";
import Modal from "./Modal";
import queryParams from "../../../../utils/queryParams";
import axios from "axios";
import { API_URL } from "../../../../constants";

interface OwnProps {
  project: Project;
  onDelete: (recordId: string) => void;
}

export default function CompetitionCard({ project, onDelete }: OwnProps) {
  const [updatedProject, setUpdatedProject] = useState<Project | null>(null);
  const { name, demoImage, description, link } = updatedProject || project;
  const isPublicProfile = !!queryParams.publicProfileID;

  const [modalOpen, toggleModal] = useState(false);
  const openModal = () => {
    toggleModal(true);
  };

  const handleDeleteProject = async () => {
    onDelete(project.recordId);
    closeDialog();
    await axios.delete(
      `${API_URL}/api/airtable/projects?recordId=${project.recordId}`
    );
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const openDialog = () => {
    setDialogOpen(true);
  };
  const closeDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "344px",
        height: "280px",
        border: "none",
        boxShadow: "none",
        color: "#111827",
      }}
    >
      <Link href={link}>
        <Modal open={modalOpen} setOpen={toggleModal}>
          <EditProject
            onComplete={({ project: newlyUpdatedProject }) => {
              setUpdatedProject(newlyUpdatedProject);
              toggleModal(false);
            }}
            onClose={() => toggleModal(false)}
            isModalForEdit={true}
            project={project}
          />
        </Modal>
        <ProgressiveImage src={demoImage} placeholder="">
          {(src) => (
            <div
              style={{
                height: 160,
              }}
            >
              <Fade in={!src} timeout={{ enter: 500 }}>
                <Box
                  sx={{
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    background: "#E5E7EB",
                    display: !src ? "" : "none",
                    height: 160,
                    width: "100%",
                  }}
                />
              </Fade>
              <Fade in={!!src} timeout={{ enter: 500 }}>
                <CardMedia
                  component="img"
                  height="160"
                  image={`${src}`}
                  alt="Project Image"
                  sx={{
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                  }}
                />
              </Fade>
            </div>
          )}
        </ProgressiveImage>
      </Link>

      <CardContent
        sx={{
          fontSize: "14px",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Inter",
            fontStyle: "normal",
            fontWeight: "500",
          }}
        >
          {name}
        </Typography>
        <Typography
          sx={{
            fontFamily: "Inter",
            fontSize: "14px",
            lineHeight: "22px",
            color: "#6B7280",
          }}
        >
          {description}
        </Typography>
      </CardContent>
      {!isPublicProfile && (
        <Stack direction="row" justifyContent="space-between">
          <Button
            sx={{
              padding: "7px 16px",
              border: "1px solid #E5E7EB",
              boxShadow: "0px 1px 2px rgba(0,0,0,.04)",
              color: "#374151",
              fontSize: "14px",
              fontWeight: 500,
              width: "65px",
            }}
            onClick={toggleModal}
          >
            Edit
          </Button>
          <IconButton aria-label="delete" onClick={openDialog}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      )}
      <Dialog
        open={dialogOpen}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            You are about to delete this project. The action is permanent, are
            you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteProject} variant="contained">
            Confirm
          </Button>
          <Button onClick={closeDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
