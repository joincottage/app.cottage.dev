import React, { useEffect } from "react";
import StackblitzSDK from "@stackblitz/sdk";
import { Box } from "@mui/material";

interface OwnProps {
  submission: any[];
}

export default function Editor({ submission }: OwnProps) {
  useEffect(() => {
    async function initializeEditor() {
      const vm = ((window as any).stackblitzVM =
        await StackblitzSDK.embedProject(
          "editor",
          {
            files: JSON.parse(submission[0]["Contents"]),
            title: submission[0]["Name"],
            description: "",
            template: "create-react-app",
          },
          {
            openFile: Object.keys(JSON.parse(submission[0]["Contents"]))[0],
            height: window.innerHeight - 70,
          }
        ));
    }

    if (submission) {
      initializeEditor();
    }
  }, [submission]);

  return (
    <Box
      sx={{
        position: "relative",
        background: "rgb(21,24,30)",
      }}
    >
      <div id="editor"></div>
    </Box>
  );
}
