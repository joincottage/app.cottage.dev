import React, { useContext, useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import useProfile from "../../hooks/useProfile";
import getLoggedInUserRecordID from "../../utils/getLoggedInUserRecordID";
import ProfileIntro from "./components/ProfileIntro";
import CompetitionSubmissions from "./components/CompetitionSubmissions";
import ProfileChecklist from "./components/ProfileChecklist";
import Fade from "@mui/material/Fade";
import TypeWriter from 'react-typewriter';
import IosShareIcon from "@mui/icons-material/IosShare";
import queryParams from "../../utils/queryParams";
import useMediaQuery from "@mui/material/useMediaQuery";
import setProfileData from "../../state/actions/setProfileData";
import { AppDataContext } from "../../state/AppContext";
import { profile } from "console";
import cottageLogo from "./Cottage-logo.png";
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PortfolioProjects from "./components/PortfolioProjects";
import backgroundImage from "./png-background.png";

const ANIM_DELAY = 500;

const Portfolio = () => {
  const isMobileWidth = useMediaQuery("(max-width:600px)");

  const userRecordId = 'rec4lNKjVyoi66F2s';
  const isPublicProfile = !!queryParams.publicProfileID;

  const { data: initialProfileData, loading } = useProfile({
    userRecordId,
  });

  const [showTooltip, setShowTooltip] = useState(false);

  const {
    state: { profileData },
    dispatch,
  } = useContext(AppDataContext);
  useEffect(() => {
    if (initialProfileData) {
      dispatch(setProfileData(initialProfileData));
    }
  }, [initialProfileData]);

  // Do  not show personal profile page to non-logged-in users
  if (
    !isPublicProfile &&
    !window.logged_in_user &&
    process.env.REACT_APP_TEST_ENV !== "dev"
  ) {
    return null;
  }

  if (loading || !profileData) {
    return (
      <Container sx={{ mt: 3, pb: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Fade
              in={true}
              style={{ transitionDelay: `200ms` }}
              timeout={{ enter: 500 }}
            >
              <div>
                <Stack
                  direction="row"
                  sx={{ mt: 45 }}
                  justifyContent="center"
                  alignSelf={"center"}
                >
                  <Typography variant="h5" sx={{ mb: 3}}>
                  <TypeWriter typing={1}>{"Your career starts here..."}</TypeWriter>

                  </Typography>
                </Stack>
              </div>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    );
  }

  const TOOLTIP_DISPLAY_TIME_PERIOD_MILLIS = 10000;
  const handleShareProfileClick = () => {
    setShowTooltip(true);

    navigator.clipboard.writeText(
      `https://app.cottage.dev/developer-profiles?publicProfileID=${getLoggedInUserRecordID()}`
    );

    setTimeout(() => setShowTooltip(false), TOOLTIP_DISPLAY_TIME_PERIOD_MILLIS);
  };

  return (
    <Container sx={{ mt: 3, pb: 2,}}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
        <Fade
            in={true}
            style={{ transitionDelay: `${ANIM_DELAY + 400}ms` }}
            timeout={{ enter: 500 }}
          >
            <div>
              <Stack
                direction="row"
                sx={{ mt: 1 }}
                justifyContent="space-between"
              >
                <Box sx={{
                  m: 0,
                  p: 0,
                }}>
                <Stack
                direction="row"
                sx={{ m: 0, p: 0}}>
                <img src={cottageLogo} />
                <Typography sx={{
                  mt: 7.5,
                  ml: 1,
                  fontSize: 28}}>
                  Portfolios
                </Typography>
                </Stack>
                </Box>
                {!isPublicProfile && (
                  <Tooltip
                    title={
                      <Box sx={{ display: "relative" }}>
                        <Typography
                          variant="body1"
                          sx={{ textAlign: "center" }}
                        >
                          Public profile URL copied to clipboard!
                        </Typography>
                      </Box>
                    }
                    placement="bottom-end"
                    arrow
                    open={showTooltip}
                  >
                    <Stack
                      direction="column"
                      sx={{ mt: 1 }}
                      justifyContent="space-around"
                    >
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<LinkedInIcon />}
                      onClick={handleShareProfileClick}
                    >
                      Share Profile
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<InsertLinkIcon />}
                      onClick={handleShareProfileClick}
                      sx={{
                      }}
                    >
                      Share Profile
                    </Button>
                    </Stack>
                  </Tooltip>
                )}
              </Stack>
            </div>
          </Fade>
        </Grid>
        <Grid item xs={isPublicProfile || isMobileWidth ? 12 : 10}>
          <Fade
            in={true}
            style={{ transitionDelay: `${ANIM_DELAY + 400}ms` }}
            timeout={{ enter: 500 }}
          >
            <div>
              <Box>
                {!loading && (
                  <ProfileIntro
                    profileData={profileData}
                    hideEditProfileButton={isPublicProfile}
                  />
                )}
              </Box>
            </div>
          </Fade>
          <Fade
            in={true}
            style={{ transitionDelay: `${ANIM_DELAY + 600}ms` }}
            timeout={{ enter: 500 }}
          >
            <div>
              <Box sx={{ mt: 6 }}>
                {!loading && (
                  <CompetitionSubmissions
                    profileData={profileData}
                    hideNewProjectButton={isPublicProfile}
                  />
                )}
              </Box>
            </div>
          </Fade><Fade
            in={true}
            style={{ transitionDelay: `${ANIM_DELAY + 600}ms` }}
            timeout={{ enter: 500 }}
          >
            <div>
              <Box sx={{ mt: 6 }}>
                {!loading && (
                  <PortfolioProjects
                    profileData={profileData}
                    hideNewProjectButton={isPublicProfile}
                  />
                )}
              </Box>
            </div>
          </Fade>
        </Grid>
        {!isPublicProfile && !isMobileWidth && (
          <Grid item xs={2}>
            <Fade
              in={true}
              style={{ transitionDelay: `${ANIM_DELAY + 800}ms` }}
              timeout={{ enter: 500 }}
            >
              <div>
                {!loading && <ProfileChecklist profileData={profileData} />}
              </div>
            </Fade>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Portfolio;
