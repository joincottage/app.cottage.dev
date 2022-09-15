import React, { useState, useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";

import Tag from "./Tag";

export default function SkillList({ skills }) {
  const lastIndex = lastTagIndex(skills);
  const [showAllSkills, setShowAllSkills] = useState(
    skills.length - lastIndex < 1
  );
  const skillsEle = useRef();

  return (
    <div
      ref={skillsEle}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        flexWrap: "wrap",
      }}
    >
      {skills.slice(0, lastIndex).map((skill) => {
        return <Tag tagname={skill} key={skill} />;
      })}
      {showAllSkills ? (
        skills.slice(lastIndex).map((skill) => {
          return <Tag tagname={skill} key={skill} />;
        })
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "5px 10px",
            gap: "8px",
            border: "1px solid #E5E7EB",
            borderRadius: "100px",
            flex: "0 0 auto",
            cursor: "pointer",
          }}
          onClick={() => {
            setShowAllSkills(true);
          }}
        >
          <Typography
            sx={{
              fontFamily: "Inter",
              fontSize: "12px",
              fontWeight: "500",
            }}
            component="p"
          >
            + {skills.length - lastIndex}
          </Typography>
        </Box>
      )}
    </div>
  );
}

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

// Find the index of last tag
function lastTagIndex(list, font = "Inter", width = 490, offset = 5, gap = 10) {
  let tagWidth = 0;
  let index = 0;
  while (tagWidth < width) {
    tagWidth += getTagWidth(list[index], font) + offset + gap;
    index++;
  }
  return index - 1;
}

// Get window size
// function getWindowDimensions() {
//   const width = window.innerWidth
//   const height = window.innerHeight
//   return {
//       width,
//       height
//   };
// }
