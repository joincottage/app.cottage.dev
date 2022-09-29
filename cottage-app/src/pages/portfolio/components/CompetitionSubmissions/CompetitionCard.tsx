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
  Badge,
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

import { styled } from '@mui/material/styles';
import useSubmission from "../../../../hooks/useTask";

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
      `${API_URL}/api/airtable/submissions?recordId=${project.recordId}`
    );
  };

  const [dialogOpen, setDialogOpen] = useState(false);
  const openDialog = () => {
    setDialogOpen(true);
  };
  const closeDialog = () => {
    setDialogOpen(false);
  };

  const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: 25,
      top: 1,
    },
  }));
  let renderStatus;

  switch (description) {
    case "Awaiting Review":
      renderStatus = <Typography display="inline" sx={{ backgroundColor: "rgba(255, 251, 128, 0.8)", borderRadius: "20px",
      fontSize: "1rem", marginRight: "3.2rem", padding: ".35rem .4rem", color: 'black', }}> Awaiting Review </Typography>;
      break;
      case "Rejected":
      renderStatus = <Typography display="inline" sx={{ backgroundColor: "rgba(38, 97, 246, 0.8)", borderRadius: "20px",
      fontSize: "1rem", padding: ".35rem .4rem", color: '#fff',}}> Reviewed </Typography>;
      break;
    case "Finalist":
      renderStatus = <Typography display="inline" sx={{ backgroundColor: "rgba(194, 249, 157, .8)", borderRadius: "20px",
      fontSize: "1.1rem", padding: ".35rem .5rem", color: 'black',}}>  Winner! </Typography>;
      break;
  }

  return (
    
    <StyledBadge 
    badgeContent={renderStatus} 
    sx={{
      zIndex: 7, 
      display: "flex",
      flexDirection: "column", 
      maxWidth: "344px",
      height: "280px", 
      marginRight: '.5rem',
      }}>
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "344px",
        height: "280px",
        boxShadow: "1x 1px",
        backgroundColor: "#FFF",
        zIndex: -5,
        justifySelf: "center",
      }}
    >
    
      
      <Link href={link}>
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
            fontStyle: "normal",
            fontWeight: "500",
            color: "black",
          }}
        >
          {name}
        </Typography>
     
        <Link href={link} target={"_blank"} sx={{textDecoration: "none",}} >
        <Typography
          sx={{
            fontSize: "14px",
            paddingY: ".25rem",
            border: "1px solid #E5E7EB",
            boxShadow: "0px 1px 2px rgba(0,0,0,.04)",
            color: "#374151",
            borderRadius: "20px",
            textAlign: "center",
            opacity: "0.98",
            position: "absolute",
            width: "90%",
            bottom: 12,
          }}
        >
          View in StackBlitz Editor
        </Typography>
        </Link>
      </CardContent>
    </Card>
    </StyledBadge>
  
  );
}
