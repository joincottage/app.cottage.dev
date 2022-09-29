import React, { useState } from "react";
import {
  Stack,
  Container,
  Typography,
  Box,
  Paper,
  Button,
  useMediaQuery,
} from "@mui/material";
import ProfileData from "../../types/ProfileData";

interface OwnProps {
  profileData: ProfileData;
}

export default function CompetitionSuggestions({
  profileData: initialProfileData,
}: OwnProps) {
  let direction;
  let breakWidth;
  const isBreakWidth = useMediaQuery("(max-width:900px)");
  const [profileData, setProfileData] = useState(initialProfileData);
  isBreakWidth ? direction = "column" : direction = "row" ;
  isBreakWidth ? breakWidth = "55vw" : breakWidth = "15vw";
  return (
    <>
        <Typography variant="h6" sx={{ fontSize: "16px", textAlign: "center", mt: "1rem", mb: 2, }}>
            Latest Competitions
        </Typography>
       
            <Paper sx={{
              display: "flex",
        borderRadius: "10px",
        color: "black",
        padding: "1rem 2.4rem",
        backgroundColor: "#fff",
        width: "56%",
        alignContent: "center",
        justifyContent: "space-around",
               }}>
        <Stack direction={"column"} sx={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          justifyContent: "space-around",
        }}>
          <Typography></Typography>
          
         </Stack>
         </Paper>
    </>
  );
}