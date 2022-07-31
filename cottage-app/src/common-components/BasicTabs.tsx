import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Stack } from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box
        sx={{
          display: value === index ? "block" : "none",
          position: "relative",
          height: "calc(100vh - 54px)",
          overflow: "hidden",
        }}
      >
        <Typography>{children}</Typography>
      </Box>
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface OwnProps {
  tabItems: {
    label: string;
    content: JSX.Element;
  }[];
  leftActions: JSX.Element[];
  rightActions: JSX.Element[];
}

export default function BasicTabs({
  tabItems,
  leftActions,
  rightActions,
}: OwnProps) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "background.default" }}>
      <Stack
        sx={{ borderBottom: 1, borderColor: "divider" }}
        direction="row"
        justifyContent="space-between"
      >
        {/* <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {tabItems.map((t, i) => (
            <Tab
              label={t.label}
              {...a11yProps(i)}
              color="info"
              sx={{ color: "info.main" }}
            />
          ))}
        </Tabs> */}
        <Box sx={{ p: 1 }}>
          <Stack direction="row-reverse" spacing={2}>
            {leftActions}
          </Stack>
        </Box>
        <Box sx={{ p: 1 }}>
          <Stack direction="row" spacing={2}>
            {rightActions}
          </Stack>
        </Box>
      </Stack>
      {tabItems.map((t, i) => (
        <TabPanel value={value} index={i}>
          {t.content}
        </TabPanel>
      ))}
    </Box>
  );
}
