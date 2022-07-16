import React, { useEffect } from "react";
import StackblitzSDK from "@stackblitz/sdk";
import { Box } from "@mui/material";

interface OwnProps {
  submission: any[];
}

export default function Editor({ submission }: OwnProps) {
  const contents = JSON.parse(submission[0]["Contents"]);
  const dependencies = JSON.parse(submission[0]["Dependencies (from Tasks)"]);
  const openFile = Object.keys(JSON.parse(submission[0]["Contents"]))[1];

  useEffect(() => {
    async function initializeEditorWithContent() {
      const vm = ((window as any).stackblitzVM =
        await StackblitzSDK.embedProject(
          "editor",
          {
            files: contents,
            title: submission[0]["Name"],
            description: "",
            template: "create-react-app",
            dependencies,
          },
          {
            openFile,
            height: window.innerHeight,
          }
        ));
    }

    initializeEditorWithContent();
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        background: "rgb(21,24,30)",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div id="editor"></div>
      </div>
    </Box>
  );
}
