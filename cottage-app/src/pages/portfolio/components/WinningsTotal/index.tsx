import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
} from "@mui/material";
import ProfileData from "../../types/ProfileData";

interface OwnProps {
  profileData: ProfileData;
}

export default function TotalWinnings({
  profileData: initialProfileData,
}: OwnProps) {
  
  const [profileData, setProfileData] = useState(initialProfileData);

  return (
   
        <Box sx={{ 
          display: "flex", 
          gap: "12px", 
          alignItems: "center", 
          justifyContent: "space-around", 
          }}>
            <Paper sx={{
        borderRadius: "10px",
        color: "black",
        padding: "1rem 2.4rem",
        backgroundColor: "#fff",
               }}>
          <Typography
            variant="h2"
            sx={{
              padding: "1.2rem 1rem",
              borderRadius: "10px",
              fontWeight: "500",
              fontSize: "18px",
              backgroundColor: "white",
              textAlign: "center",
              opacity: "0.9",
            }}
          >
            Total Competition Submissions
            <Typography sx={{ 
              marginTop: "1rem", 
              backgroundColor: "rgb(38, 97, 246)", 
              border: '2px solid #fff', 
              borderRadius: "10px", 
              color: "#fff",
              fontSize: "1.4rem",
              paddingY: ".7rem",
              }}>
           {profileData.totalSubmissions}
          </Typography>
          </Typography>
          </Paper>
          <Paper sx={{
        borderRadius: "10px",
        color: "black",
        padding: "1rem 2.4rem",
        backgroundColor: "#fff",
               }}>
          <Typography
            variant="h2"
            sx={{
              padding: "1.2rem 1rem",
              borderRadius: "10px",
              fontWeight: "500",
              fontSize: "18px",
              backgroundColor: "white",
              textAlign: "center",
              opacity: "0.9",
            }}
          >
            Total Competitions Won  
          <Typography sx={{ 
              marginTop: "1rem", 
              backgroundColor: "rgb(38, 97, 246)", 
              border: '2px solid #fff', 
              borderRadius: "10px", 
              color: "#fff",
              fontSize: "1.4rem",
              paddingY: ".7rem",
              }}>
              {profileData.totalWon}
              </Typography>
           </Typography>
          </Paper>
          <Paper sx={{
        borderRadius: "10px",
        color: "black",
        padding: "1rem 2.4rem",
        backgroundColor: "#fff",
               }}>
          <Typography
            variant="h2"
            sx={{
              padding: "1.2rem 1rem",
              borderRadius: "10px",
              fontWeight: "500",
              fontSize: "18px",
              backgroundColor: "white",
              textAlign: "center",
              opacity: "0.9",
            }}
          >
            Total Winnings 
          <Typography sx={{ 
              marginTop: "1rem", 
              backgroundColor: "rgb(38, 97, 246)", 
              border: '2px solid #fff', 
              borderRadius: "10px", 
              color: "#fff",
              fontSize: "1.4rem",
              paddingY: ".7rem",
              }}>
                 ${profileData.totalWinnings}   
              </Typography>
           </Typography>
          </Paper>
      </Box>
    
  );
}
