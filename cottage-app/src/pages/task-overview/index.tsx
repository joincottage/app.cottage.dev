import React, { useEffect, useState } from "react";
import useTask from "../../hooks/useTaskBase";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// @ts-ignore
import { Helmet } from "react-helmet";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Stack,
} from "@mui/material";
import "react-medium-image-zoom/dist/styles.css";

const params: Record<string, any> = new Proxy(
  new URLSearchParams(window.location.search),
  {
    get: (searchParams, prop) => searchParams.get(prop as string),
  }
);

// tslint:disable-next-line: cyclomatic-complexity
const TaskOverview = () => {
  const { data: task, loading: taskLoading } = useTask({
    recordId: params.recordId,
  });

  const [checked, setChecked] = useState([]);

  const [acceptanceCriteria, setAcceptanceCriteria] = useState([]);
  useEffect(() => {
    if (task) {
      setAcceptanceCriteria(task[0]["Acceptance Criteria"].split(";"));
    }
  }, [task]);

  return taskLoading ? null : (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Helmet>
        <style>{`
          iframe { border: none; }
          .container { max-width: none !important; }
          #custom-code1, #custom-code2, #custom-code3 {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
          }
          .col-12 { padding: 0 !important; }
          `}</style>
      </Helmet>
      <Container
        maxWidth={false}
        style={{
          padding: 0,
          position: "absolute",
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "background.paper",
            p: 4,
            display: "flex",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "text.primary", textAlign: "center" }}
                  >
                    How To Get Started
                  </Typography>
                  <Stack sx={{ mt: 2 }} alignItems="center">
                    <iframe
                      src={task[0]["Getting Started Video Embed"]}
                      width="500"
                      height="350"
                      allowFullScreen
                    />
                  </Stack>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" sx={{ color: "text.primary" }}>
                  Figma Design Preview
                </Typography>
                <Stack sx={{ mt: 2 }}>
                  <iframe
                    src={task[0]["Figma Embed"]}
                    width="350"
                    height="350"
                    allowFullScreen
                  />
                </Stack>
                <Button
                  variant="contained"
                  sx={{ color: "text.primary", mt: 3, width: "350px" }}
                  onClick={() =>
                    window.open(task[0]["Figma Direct Link"], "_blank")
                  }
                >
                  Open Interactive Figma Design
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6" sx={{ color: "text.primary" }}>
                  Description
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "text.primary", mt: 2 }}
                >
                  {task[0].Description}
                </Typography>
                <Divider sx={{ mt: 2, mb: 2 }} />
                <Typography variant="h6" sx={{ color: "text.primary" }}>
                  Acceptance Criteria
                </Typography>
                <FormControl
                  component="fieldset"
                  variant="standard"
                  sx={{ mt: 1 }}
                >
                  <FormGroup>
                    {acceptanceCriteria.map(
                      (a) =>
                        a && (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={checked.includes(a)}
                                onChange={() =>
                                  checked.includes(a)
                                    ? setChecked(checked.filter((c) => c !== a))
                                    : setChecked([...checked, a])
                                }
                                name={a}
                              />
                            }
                            label={a}
                            sx={{ color: "text.primary" }}
                          />
                        )
                    )}
                  </FormGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default TaskOverview;
