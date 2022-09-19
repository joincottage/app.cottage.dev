import React from "react";
import { Icon, Box, Typography } from "@mui/material";
import LocalCafeOutlinedIcon from "@mui/icons-material/LocalCafeOutlined";
import ViewInArOutlinedIcon from "@mui/icons-material/ViewInArOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";

const iconstyle = { width: "12px", height: "12px" };

export default function Tag({ tagname }: { tagname: string }) {
  const coffe = <LocalCafeOutlinedIcon style={iconstyle} />;
  const cube = <ViewInArOutlinedIcon style={iconstyle} />;
  const pen = <ModeEditOutlineOutlinedIcon style={iconstyle} />;

  const iconlist = [coffe, cube, pen];
  const colorlist = [
    "action",
    "primary",
    "secondary",
    "error",
    "info",
    "success",
    "warning",
  ];

  // console.log(getTagWidth(tagname, 'Inter'));
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "5px 10px",
        gap: "8px",
        border: "1px solid #E5E7EB",
        borderRadius: "100px",
        flex: "0 0 auto",
      }}
    >
      {/* <Icon color={`${randomListItem(colorlist)}`} sx={{
        padding: 0, 
        margin: 0, 
        fontSize: '12px'}}>
        {randomListItem(iconlist)}
      </Icon> */}
      <Typography
        sx={{
          fontSize: "12px",
          fontWeight: "500",
        }}
        component="p"
      >
        {tagname}
      </Typography>
    </Box>
  );
}

// Function to return a random item from the list
function randomListItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Function to return a hex color code
// function randomColor() {
//   const colorCode = Math.floor(Math.random() * 255 * 255 * 255)
//   return `#${colorCode.toString(16)}`
// }

// Function to return the width of a text
function getTextWidth(text, font) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  context.font = font || getComputedStyle(document.body).font;

  return context.measureText(text).width;
}

// Function to return the width of a tag
function getTagWidth(
  text,
  font,
  iconWidth = 12,
  gap = 8,
  padding = 20,
  border = 2
) {
  return getTextWidth(text, font) + iconWidth + gap + padding + border;
}
