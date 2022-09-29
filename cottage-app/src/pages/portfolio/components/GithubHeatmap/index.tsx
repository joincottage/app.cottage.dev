import { Box, Typography, Container } from "@mui/material";
import React from "react";
import GitHubCalendar from 'github-calendar';
import ProfileData from "../../types/ProfileData";

export const GithubHeatmap = ({
   name, // e.g. "Gavin Neil"
   avatarUrl, // e.g. "https://storage.googleapis.com/cottage-assets/mock-avatar-image.png"
   username, // e.g. "@gavin"
   location, // e.g. "Ottawa, ON, Canada"
   competitionSubmission, // e.g. "$85/hr"
   skills, // e.g. ["Product Management", "Copywriting", "Advisory", "Mentorship"]
   aboutMe,
   openModal,
   hideEditProfileButton
 }: ProfileData) => {
    new GitHubCalendar('.calendar', `${username}`, { responsive: true, tooltips: true, })
    
    
    return (
       <Container sx={{ margin: "1.3rem 0rem 1.8rem 0rem",}}>
          <div className="calendar" style={{ padding: ".4rem .5rem 0rem .5rem" }}></div>
       </Container>
               
    );
}
