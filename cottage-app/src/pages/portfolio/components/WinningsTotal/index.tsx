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

export default function TotalWinnings({
  profileData: initialProfileData,
}: OwnProps) {
  let direction;
  let breakWidth;
  const isBreakWidth = useMediaQuery("(max-width:900px)");
  const [profileData, setProfileData] = useState(initialProfileData);
  isBreakWidth ? direction = "column" : direction = "row" ;
  isBreakWidth ? breakWidth = "55vw" : breakWidth = "12vw";
  return (
            
        <Stack direction={direction} sx={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          justifyContent: "space-around",
        }}>
          
          <Typography
            variant="h2"
            sx={{
              padding: ".5rem 1rem",
              borderRadius: "10px",
              fontWeight: "500",
              fontSize: "16px",
              backgroundColor: "white",
              textAlign: "center",
              opacity: "0.95",
              width: `${breakWidth}`,
            }}
          >
            Submitted
            <Typography sx={{
              marginTop: "1rem",
              backgroundColor: "rgba(38, 97, 246, 0.8)",
              border: '2px solid #fff',
              borderRadius: "30px",
              color: "#fff",
              fontSize: "1.2rem",
              paddingY: ".7rem",
            }}>
              {profileData.totalSubmissions}
            </Typography>
          </Typography>
          <Typography
            variant="h2"
            sx={{
              padding: "1rem 1rem",
              borderRadius: "10px",
              fontWeight: "500",
              fontSize: "16px",
              backgroundColor: "white",
              textAlign: "center",
              opacity: "0.95",
              width: `${breakWidth}`,
            }}
          >
            Winners
            <Typography sx={{
              marginTop: "1rem",
              backgroundColor: "rgba(38, 97, 246, 0.8)",
              border: '2px solid #fff',
              borderRadius: "30px",
              color: "#fff",
              fontSize: "1.2rem",
              paddingY: ".7rem",
            }}>
              {profileData.totalWon}
            </Typography>
          </Typography>
          <Typography
            variant="h2"
            sx={{
              padding: "1rem 1rem",
              borderRadius: "10px",
              fontWeight: "500",
              fontSize: "16px",
              backgroundColor: "white",
              textAlign: "center",
              opacity: "0.95",
              width: `${breakWidth}`,
            }}
          >
            Winnings
            <Typography sx={{
              marginTop: "1rem",
              backgroundColor: "rgba(38, 97, 246, 0.8)",
              border: '2px solid #fff',
              borderRadius: "30px",
              color: "#fff",
              fontSize: "1.2rem",
              paddingY: ".7rem",
            }}>
              ${profileData.totalWinnings}
            </Typography>
          </Typography>
        </Stack>
  );
}
