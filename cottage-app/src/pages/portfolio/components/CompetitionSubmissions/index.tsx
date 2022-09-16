// You need to import React into every file that contains a React component.
import React, { useState } from "react";

// Import any component you need from the Material UI packacge below.
// List of available components can be viewed in the left sidebar of this page: https://mui.com/material-ui/react-autocomplete/
import {
  Box,
  Container,
  Typography,
  Grid,
  Divider,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import CompetitionCard from "./CompetitionCard";
import Modal from "./Modal";
import ProfileData from "../../types/ProfileData";
import EditProject from "../EditProject";

const Paper = ({
  children,
  sx,
}: {
  children?: JSX.Element | JSX.Element[];
  sx?: any;
}) => (
  <Box
    sx={{
      width: "100%",
      borderRadius: "12px",
      boxShadow:
        "0px 2px 10px rgba(0, 0, 0, 0.05), 0px 1px 1px rgba(0, 0, 0, 0.1)",
      minHeight: "72px",
      ...sx,
    }}
  >
    {children}
  </Box>
);

interface OwnProps {
  profileData: ProfileData;
  hideNewProjectButton: boolean;
}

export default function CompetitionSubmissions({
  profileData,
  hideNewProjectButton,
}: OwnProps) {
  const [modalOpen, toggleModal] = useState(false);
  const openModal = () => {
    toggleModal(true);
  };

  const [isModalForEdit, setIsModalForEdit] = useState(true);

  const onAddProject = () => {
    setIsModalForEdit(false);
    openModal();
  };
  const onEditProject = (index: number) => {
    console.log(index);
    setIsModalForEdit(true);
    openModal();
  };

  const [selectedProject, setSelectedProject] = useState<number>(0);

  const [deletedProjects, setDeletedProjects] = useState<string[]>([]);
  const handleProjectCardDelete = (recordId: string) => {
    setDeletedProjects([...deletedProjects, recordId]);
  };

  return (
    <Paper>
      <Modal open={modalOpen} setOpen={toggleModal}>
        <EditProject
          onComplete={({ project }) => {
            toggleModal(false);
          }}
          onClose={() => toggleModal(false)}
          isModalForEdit={isModalForEdit}
          project={
            isModalForEdit ? profileData.projects[selectedProject] : null
          }
        />
      </Modal>
      <Box
        sx={{
          p: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Typography
            variant="h5"
            sx={{
              color: "#111827",
              fontWeight: "500",
              fontSize: "18px",
              marginRight: "auto",
            }}
          >
            Competition Submissions
          </Typography>
          {!hideNewProjectButton && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                fontSize: "14px",
                fontWeight: "500",
                padding: "7px 16px",
                borderRadius: "100px",
              }}
              onClick={onAddProject}
            >
              New Submission
            </Button>
          )}
          {/* {profileData.projects.length > 0 ? (
            <Button
              variant="contained"
              sx={{
                color: "#374151",
                fontSize: "14px",
                fontWeight: "500",
                padding: "7px 16px",
                borderRadius: "100px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E5E7EB",
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.04)",
              }}
              onClick={() => toggleModal(true)}
            >
              Edit
            </Button>
          ) : null} */}
        </Box>

        {profileData.projects.filter(
          (p) => !deletedProjects.includes(p.recordId)
        ).length > 0 ? (
          <Divider color="black" sx={{ margin: "24px 0", opacity: "0.1", }} />
        ) : null}

        <Grid container spacing={4} sx={{ padding: "0 24px" }}>
          {profileData.projects
            .filter((p) => !deletedProjects.includes(p.recordId))
            .map((project, index) => (
              <Grid item xs={12} md={6} lg={4}>
                <CompetitionCard
                  project={project}
                  key={index}
                  onDelete={handleProjectCardDelete}
                />
              </Grid>
            ))}
        </Grid>
      </Box>
    </Paper>
  );
}
