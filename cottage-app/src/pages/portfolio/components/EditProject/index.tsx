import {
    Box,
    Button,
    Divider,
    Stack,
    TextField,
    Typography,
  } from "@mui/material";
  import React, { useContext, useState } from "react";
  import { API_URL } from "../../../../constants";
  import { formatProjectAPIResponse } from "../../../../utils/projectFormatters";
  import getLoggedInUserRecordID from "../../../../utils/getLoggedInUserRecordID";
  import Project from "../../types/Project";
  import useMediaQuery from "@mui/material/useMediaQuery";
  import axios from "axios";
  import setProfileData from "../../../../state/actions/setProfileData";
  import { AppDataContext } from "../../../../state/AppContext";
  import { alpha, styled } from '@mui/material/styles';
  
  interface OwnProps {
    onComplete: ({ project }: { project: any }) => void;
    onClose: () => void;
    isModalForEdit: boolean;
    project: Project;
  }

  const CustomTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'rgb(204, 204, 204)',
      },
    },
    "& .MuiOutlinedInput-root:hover": {
      "& fieldset": {
        borderColor: "rgb(38, 97, 246)",
      }
    },
    input: {
      color: "black",
    },
});
  
  export default function EditProject({
    onComplete,
    onClose,
    isModalForEdit,
    project,
  }: OwnProps) {
    const isMobileWidth = useMediaQuery("(max-width:600px)");
  
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const [title, setTitle] = useState(project?.name || "");
    const [desc, setDesc] = useState(project?.description || "");
    const [link, setLink] = useState(project?.link || "");
  
    const {
      state: { profileData },
      dispatch,
    } = useContext(AppDataContext);
    const uploadToServer = async (event: any) => {
      const body = new FormData();
      //@ts-ignore
      body.append("file", selectedImage);
  
      setLoading(true);
  
      let imageUrl = "null";
      if (selectedImage) {
        const imageResponse = await (
          await fetch(
            `${API_URL}/api/google-cloud-storage/upload?subfolder=projects`,
            {
              method: "POST",
              body,
            }
          )
        ).json();
  
        imageUrl = imageResponse.url;
      }
  
      let response;
      if (isModalForEdit) {
        // Update existing project
        response = await axios.patch(
          `${API_URL}/api/airtable/projects?loggedInUsersRecordID=${getLoggedInUserRecordID()}&title=${title}&description=${desc}&link=${link}&imagePath=${imageUrl}&projectRecordId=${
            project.recordId
          }`
        );
      } else {
        // Create new project
        response = await axios.post(
          `${API_URL}/api/airtable/projects?loggedInUsersRecordID=${getLoggedInUserRecordID()}&title=${title}&description=${desc}&link=${link}&imagePath=${imageUrl}`
        );
          // Update profile checklist
          const projectData = formatProjectAPIResponse(response.data);
        dispatch(
          setProfileData({
            ...profileData,
            projects: [...profileData.projects, projectData],
          })
        );
      }
  
      const projectData = formatProjectAPIResponse(response.data);
      setLoading(false);
      onComplete({ project: projectData });
    };
  
    const [imageDeleted, setImageDeleted] = useState(false);
  
    return (
      <Box sx={{ width: isMobileWidth ? "80vw" : "auto" }}>
        <Typography variant="h6" gutterBottom>
          {isModalForEdit ? "Edit Project" : "Add New Project"}
        </Typography>
        <Stack spacing={2}>
          <div>
            {!!(selectedImage || project?.demoImage) && !imageDeleted ? (
              <Stack direction="row" justifyContent="space-between">
                <Stack direction="row">
                  <img
                    alt="not fount"
                    width={"64px"}
                    src={
                      selectedImage
                        ? URL.createObjectURL(selectedImage)
                        : project?.demoImage
                    }
                  />
                  <Stack sx={{ ml: 2 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        maxWidth: isMobileWidth ? "170px" : "auto",
                      }}
                    >
                      {selectedImage
                        ? selectedImage.name
                        : project?.demoImage.substring(
                            project.demoImage.lastIndexOf("/") + 1
                          )}
                    </Typography>
                    {selectedImage && (
                      <Typography variant="body1" sx={{ color: "#6B7280" }}>
                        {Math.round((selectedImage.size / 1024) * 100) / 100} KB
                      </Typography>
                    )}
                  </Stack>
                </Stack>
                <Button
                  variant="text"
                  onClick={() => {
                    setSelectedImage(null);
                    setImageDeleted(true);
                  }}
                  sx={{ color: "red" }}
                  disabled={loading}
                >
                  Delete
                </Button>
              </Stack>
            ) : (
              <Box
                sx={{ width: "100%", display: "flex", justifyContent: "center" }}
              >
                <Button variant="contained" component="label">
                  Upload Image
                  <input
                    type="file"
                    hidden
                    onChange={(event) => {
                      setSelectedImage(event.target.files[0]);
                      setImageDeleted(false);
                    }}
                  />
                </Button>
              </Box>
            )}
          </div>
          <CustomTextField
            label="Name"
            placeholder="ACME Inc."
            helperText="Give your project a short title (50 characters)"
            required
            disabled={loading}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <CustomTextField
            label="Description"
            placeholder="Designing an iOS mobile"
            helperText="Briefly explain your project (100 characters)"
            disabled={loading}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <CustomTextField
            label="Add Link"
            placeholder="https://"
            helperText="Attach the project link which takes user to the main project details."
            required
            disabled={loading}
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <Divider color="black" sx={{ my: 2, opacity: "0.1", }} />
          <Stack direction="row-reverse">
            <Button
              variant="contained"
              sx={{ ml: 2 }}
              disabled={loading}
              onClick={uploadToServer}
            >
              Save project
            </Button>
            <Button variant="outlined" onClick={onClose}>
              Discard
            </Button>
          </Stack>
        </Stack>
      </Box>
    );
  }