import { Container, Box, Typography, Button } from "@mui/material";
import React from "react";

export default function GithubLoginPage() {
  const handleConnectClick = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=0aa18b6353dd17f77858&redirect_uri=${encodeURI(
      "https://3000-joincottage-createtask-7e9p8b948vx.ws-us45.gitpod.io/?activeStep=2"
    )}`;
  };

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            borderRadius: "8px",
            background: "#FCFDFD",
            border: "0.5px solid #000000",
            padding: "75px 57px",
          }}
        >
          <img
            src="https://cottage-api.vercel.app/github-logo.svg"
            width="78px"
            height="76px"
          />
          <Typography
            variant="h4"
            sx={{ fontWeight: "700", marginTop: "15px" }}
          >
            Connect to Github
          </Typography>
          <Button
            variant="contained"
            sx={{ marginTop: "51px" }}
            onClick={handleConnectClick}
          >
            Connect
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
