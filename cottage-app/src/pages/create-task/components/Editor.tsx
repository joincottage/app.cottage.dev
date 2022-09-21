import React, { useEffect } from "react";
import StackblitzSDK from "@stackblitz/sdk";
import { Box } from "@mui/material";

interface OwnProps {
  task: any[] | null;
}

export default function Editor({ task }: OwnProps) {
  const contents =
    task && task[0]["Contents"] ? JSON.parse(task[0]["Contents"]) : {};
  useEffect(() => {
    async function initializeEditorWithContent() {
      const vm = ((window as any).stackblitzVM =
        await StackblitzSDK.embedProject(
          "editor",
          {
            files: contents,
            title: task ? task[0]["Name"] : "",
            description: "",
            template: "create-react-app",
            dependencies:
              task && task[0]["Dependencies"]
                ? JSON.parse(task[0]["Dependencies"])
                : {},
          },
          {
            openFile:
              task && task[0]["Open File Name"]
                ? task[0]["Open File Name"]
                : undefined,
            height: window.innerHeight,
            forceEmbedLayout: false,
          }
        ));
    }

    async function initializeDefaultEditor() {
      const vm = ((window as any).stackblitzVM =
        await StackblitzSDK.embedProject(
          "editor",
          {
            title: "React Typescript Component",
            description:
              "A react-typescript starter project for your component",
            template: "create-react-app",
            files: {
              "src/index.js": `import * as React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
              "public/index.html": `<div id="root"></div>`,
              "src/App.jsx": `import * as React from 'react';

export default function App() {
  return (
    <div>
      <h1>Hello StackBlitz!</h1>
      <p>Start editing to see some magic happen :)</p>
    </div>
  );
}`,
              "package.json": `{
  "name": "react-ts",
  "version": "0.0.0",
  "private": true,
  "dependencies": {
    "@types/react": "^18.0.8",
    "@types/react-dom": "^18.0.2",
    "react": "^18.1.0",
    "react-dom": "^18.1.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  },
  "devDependencies": {
    "react-scripts": "latest"
  }
}`,
            },
          },
          {
            openFile: "src/App.jsx",
            height: window.innerHeight,
            forceEmbedLayout: false,
          }
        ));
    }

    if (task && task[0]["Contents"]) {
      initializeEditorWithContent();
    } else {
      initializeDefaultEditor();
    }
  }, [task]);

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
