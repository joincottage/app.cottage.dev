import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ProgressiveImage from "react-progressive-graceful-image";
import Button from '@mui/material/Button';
import ProfileData from "./types/ProfileData";
import Tag from "./Tag";
import SkillList from "./SkillList";
import { Fade, useMediaQuery } from "@mui/material";
import queryParams from "../../../../utils/queryParams";
import stockPhoto from "./stockPhoto.png";
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LinkedIn from "@mui/icons-material/LinkedIn";
import InsertLink from "@mui/icons-material/InsertLink";
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import getLoggedInUserRecordID from "../../../../utils/getLoggedInUserRecordID";
import Tooltip from '@mui/material/Tooltip';
import Box from "@mui/material";

const Img = styled("img")({
  margin: "auto",
  display: "block",
  maxWidth: "100%",
  maxHeight: "100%",
});

const options = [
  <EditIcon sx={{fill: "#fff",}}/>,
  <LinkedIn sx={{fill: "#fff",}}/>,
  <InsertLink sx={{fill: "#fff",}}/>,
  
];

const ITEM_HEIGHT = 448;

interface OwnProps {
  openModal: () => void;
  setSelectedIndex: () => void;
  selectedIndex: any;
  hideEditProfileButton: boolean;
}

export default function ProfileHeader({
  name, // e.g. "Gavin Neil"
  avatarUrl, // e.g. "https://storage.googleapis.com/cottage-assets/mock-avatar-image.png"
  username, // e.g. "@gavin"
  location, // e.g. "Ottawa, ON, Canada"
  competitionSubmission, // e.g. "$85/hr"
  skills, // e.g. ["Product Management", "Copywriting", "Advisory", "Mentorship"]
  aboutMe,
  setSelectedIndex,
  selectedIndex,
  openModal,
  hideEditProfileButton
}: ProfileData) {
  const isPublicProfile = !!queryParams.publicProfileID;

  const isMobileWidth = useMediaQuery("(max-width:900px)");
  let paddingDesign;
  let marginDesign;
  isMobileWidth ? paddingDesign = ".8px 0px" : paddingDesign = " 6px 6px"
  isMobileWidth ? marginDesign = "0px 0px 12px 0px" : marginDesign = "0px 0px"

  const onEdit = () => {
    openModal()
  }
  const [showTooltip, setShowTooltip] = React.useState(false);
  const TOOLTIP_DISPLAY_TIME_PERIOD_MILLIS = 10000;
  const handleShareProfileClick = () => {

    navigator.clipboard.writeText(
      `https://app.cottage.dev/developer-profiles?publicProfileID=${getLoggedInUserRecordID()}`
    );
    
    setSelectedIndex(undefined);
  };

  const handleShareProfileClickLinkedIn = () => {
    window.open(`https://www.LinkedIn.com/shareArticle?mini=true&url=https://app.cottage.dev/developer-profiles?publicProfileID=${getLoggedInUserRecordID()}`, '_blank').focus();
    setSelectedIndex(undefined);
  };
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number,
  ) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

const handleClose = (e) => {
    setAnchorEl(null);
  };

  switch (selectedIndex) {
    case 0:
      onEdit();
      break;
    case 1:
      handleShareProfileClickLinkedIn();
      break;
    case 2:
      handleShareProfileClick();
      break;
    
  }
  return (
    <Grid
      container
      spacing={2}
      sx={{
        flexWrap: "nowrap",
      }}
    >
      {/* Avatar */}
      <Grid item>
        <ProgressiveImage src={avatarUrl} placeholder="">
          {(src) => (
            <div
              style={{
                width: 128,
                height: 128,
              }}
            >
              <Fade in={!src} timeout={{ enter: 500 }}>
                <Avatar
                  alt="profile image"
                  src={src}
                  sx={{
                    width: 128,
                    height: 128,
                    display: !src ? "" : "none",
                  }}
                />
              </Fade>
              <Fade in={!!src} timeout={{ enter: 500 }}>
                <Avatar
                  alt="profile image"
                  src={src}
                  sx={{
                    width: 128,
                    height: 128,
                  }}
                />
              </Fade>
            </div>
          )}
        </ProgressiveImage>
      </Grid>

      {/* Text Content */}
      <Grid
        item
        xs={12}
        sm
        container
        sx={{
          padding: 0,
        }}
      >
        {/* Name and hourly rate */}
        <Grid
          item
          xs={12}
          container
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            component="h2"
            variant="h6"
            sx={{
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            {name}
          </Typography>
          
          {!hideEditProfileButton && (
          <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MenuIcon />
        </IconButton>
        
      )}
      <Menu
          id="long-menu"
          MenuListProps={{
            'aria-labelledby': 'long-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '7ch',
              backgroundColor: "rgb(38, 97, 246)",
            },
          }}
        >
          {options.map((option, index) => (
            <MenuItem 
            key={option}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}>
              {option}
            </MenuItem>
          ))}
        </Menu>
        </Grid>

        {/* Location */}
        <Grid
          item
          xs={12}
          container
          sx={{
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <Typography
            component="h2"
            variant="subtitle1"
            sx={{
              fontSize: "14px",
              color: "#6B7280",
              lineHeight: "14px",
              flex: "auto",
            }}
          >
            @{username}
            <span
              style={{
                display: "inline-block",
                width: "3px",
                height: "3px",
                background: "#9CA3AF",
                border: "1px solid #9CA3AF",
                borderRadius: "50%",
                margin: "auto 8px",
                marginBottom: "2.3px",
              }}
            ></span>
            <LocationOnOutlinedIcon
              sx={{
                fontSize: "13px",
                transform: "translateY(1px)",
              }}
            />
            {location}
          </Typography>
        </Grid>

        {/* Skill Tags */}
        <Grid item xs={12} sx={{}}>
          {/* {skills.split(',').map(skill => {
            return <Tag tagname={skill}/>
          })} */}
          {skills ? <SkillList skills={skills.split(",")} /> : null}
        </Grid>
      </Grid>
    </Grid>
  );
}
