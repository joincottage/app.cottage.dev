import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
} from "@mui/material";


export default function TotalWinnings() {
  
  return (
    <Paper sx={{
        borderRadius: "10px",
        backgroundColor: "rgb(38, 97, 246)",
        color: "black",
               }}>
        <Box sx={{ display: "flex", gap: "12px", alignItems: "center", 
              padding: "1.8rem 1.8rem", justifyContent: "space-around", }}>
          <Typography
            variant="h2"
            sx={{
              padding: "1.2rem 1rem",
              borderRadius: "10px",
              fontWeight: "500",
              fontSize: "18px",
              backgroundColor: "white",
              textAlign: "center",
            }}
          >
            Total Competition Submissions: 12
          </Typography>
          <Typography
            variant="h2"
            sx={{
              padding: "1.2rem 1rem",
              borderRadius: "10px",
              fontWeight: "500",
              fontSize: "18px",
              backgroundColor: "white",
              textAlign: "center",
            }}
          >
            Total Competitions Won: 8
          </Typography>
          <Typography
            variant="h2"
            sx={{
              padding: "1.2rem 1rem",
              borderRadius: "10px",
              fontWeight: "500",
              fontSize: "18px",
              backgroundColor: "white",
              textAlign: "center",
            }}
          >
            Total Winnings: $900
          </Typography>
      </Box>
    </Paper>
  );
}
