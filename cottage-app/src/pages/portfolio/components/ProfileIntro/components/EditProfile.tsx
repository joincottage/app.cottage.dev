import {
    Box,
    Button,
    Divider,
    InputAdornment,
    Stack,
    TextField,
    Typography,
  } from "@mui/material";
  import axios from "axios";
  import React, { useContext, useState } from "react";
  import { API_URL } from "../../../../../constants";
  import getLoggedInUserRecordID from "../../../../../utils/getLoggedInUserRecordID";
  import ProfileData from "../../../types/ProfileData";
  import useMediaQuery from "@mui/material/useMediaQuery";
  import setProfileData from "../../../../../state/actions/setProfileData";
  import { AppDataContext } from "../../../../../state/AppContext";
  
  interface OwnProps {
    onComplete: ({ newAvatarUrl }: { newAvatarUrl: string }) => void;
    profileData: ProfileData;
    onDiscard: () => void;
  }
  
  export default function EditProfile({
    onComplete,
    onDiscard,
    profileData: initialProfileData,
  }: OwnProps) {
    const isMobileWidth = useMediaQuery("(max-width:600px)");
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const [formData, setFormData] = useState(initialProfileData);
    const { name, location, skills, competitionSubmission, aboutMe } = formData;
    const onChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const {
      state: { profileData },
      dispatch,
    } = useContext(AppDataContext);
    const handleSaveProfile = async () => {
      setLoading(true);
  
      const fields = {
        "Freelancer Name": name,
        Location: location,
        Description: aboutMe,
        "Hourly Rate": competitionSubmission,
        Skills: skills,
      };
  
      const newProfileData: any = {};
      if (selectedImage) {
        const imageUrl = await uploadToServer();
        newProfileData.newAvatarUrl = imageUrl;
        fields["Profile Picture"] = [
          {
            url: newProfileData.newAvatarUrl,
          },
        ];
      }
  
      const profileUpdateResponse = await axios.patch(
        `${API_URL}/api/airtable/profile?recordId=${profileData.recordId}`,
        {
          fields,
        }
      );
  
      newProfileData.name = name;
      newProfileData.location = location;
      newProfileData.skills = skills;
      newProfileData.aboutMe = aboutMe;
      newProfileData.competitionSubmission = competitionSubmission;
  
      dispatch(
        setProfileData({
          ...profileData,
          ...newProfileData,
          avatarUrl: newProfileData.newAvatarUrl
            ? newProfileData.newAvatarUrl
            : profileData?.avatarUrl,
        })
      );
  
      onComplete(newProfileData);
      setLoading(false);
    };
  
    const uploadToServer = async () => {
      const body = new FormData();
      //@ts-ignore
      body.append("file", selectedImage);
      const imageUrlResponse = await (
        await fetch(
          `${API_URL}/api/google-cloud-storage/upload?subfolder=avatars`,
          {
            method: "POST",
            body,
          }
        )
      ).json();
  
      return `https://storage.googleapis.com/cottage-images/${imageUrlResponse.url}`;
    };
  
    return (
      <Box
        sx={{
          width: isMobileWidth ? "80vw" : "40rem",
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          boxShadow: 24,
          backgroundColor: "white",
          py: 2,
          px: 3,
        }}
      >
        <Typography variant="h6" gutterBottom id="profile-modal-title">
          Edit Profile
        </Typography>
        <Stack spacing={2}>
          <div>
            {selectedImage && URL.createObjectURL(selectedImage) ? (
              <Stack direction="row" justifyContent="space-between">
                <Stack direction="row">
                  <img
                    alt="not found"
                    width={"64px"}
                    src={URL.createObjectURL(selectedImage)}
                  />
                  <Stack sx={{ ml: 2 }}>
                    <Typography variant="body1">{selectedImage.name}</Typography>
                    <Typography variant="body1" sx={{ color: "#6B7280" }}>
                      {Math.round((selectedImage.size / 1024) * 100) / 100} KB
                    </Typography>
                  </Stack>
                </Stack>
                <Button
                  variant="text"
                  onClick={() => setSelectedImage(null)}
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
                  Reupload Avatar Image
                  <input
                    type="file"
                    hidden
                    onChange={(event) => {
                      setSelectedImage(event.target.files[0]);
                    }}
                  />
                </Button>
              </Box>
            )}
          </div>
          <TextField
            label="Name"
            placeholder="John Smith"
            helperText="Tell us your name (50 characters)"
            required
            disabled={loading}
            value={name}
            name="name"
            onChange={onChange}
          />
          <TextField
            label="Location"
            placeholder="Paris"
            helperText="Tell us where you are"
            disabled={loading}
            name="location"
            value={location}
            onChange={onChange}
          />
          <TextField
            label="Skills"
            placeholder="UI/UX Designer, Developer"
            helperText="Tell us what you do"
            required
            name="skills"
            disabled={loading}
            value={skills}
            onChange={onChange}
          />
          
          <TextField
            variant="outlined"
            placeholder="Write awesome things about yourself"
            multiline
            rows={6}
            disabled={loading}
            name="aboutMe"
            value={aboutMe}
            onChange={onChange}
          />
          <Divider color="black" sx={{ my: 2, opacity: "0.1", }} />
          <Stack direction="row-reverse">
            <Button
              variant="contained"
              sx={{ ml: 2 }}
              disabled={loading}
              onClick={handleSaveProfile}
            >
              Save profile
            </Button>
            <Button variant="outlined" onClick={onDiscard}>
              Discard
            </Button>
          </Stack>
        </Stack>
      </Box>
    );
  }
  