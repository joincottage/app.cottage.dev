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
      <Box sx={{ display: value === index ? "block" : "none" }}>
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
  actions: JSX.Element[];
}

export default function BasicTabs({ tabItems, actions }: OwnProps) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        sx={{ borderBottom: 1, borderColor: "divider" }}
        direction="row"
        justifyContent="space-between"
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          {tabItems.map((t, i) => (
            <Tab label={t.label} {...a11yProps(i)} />
          ))}
        </Tabs>
        <Box sx={{ p: 1 }}>
          <Stack direction="row" spacing={2}>
            {actions}
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
