// You need to import React into every file that contains a React component.
import React, { useState, useEffect, useContext } from "react";

// Import any component you need from the Material UI packacge below.
// List of available components can be viewed in the left sidebar of this page: https://mui.com/material-ui/react-autocomplete/
import { Box, Container, Tooltip, Button, Typography, Stack } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Divider from '@mui/material/Divider';
import RadioButton from "./RadioButton";
import Header from "./Header";
import ProfileData from "../../types/ProfileData";
import { getDefaultProfileFields } from "../../../../constants";
import { AppDataContext } from "../../../../state/AppContext";
import queryParams from "../../../../scripts/misc/queryParams";
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import getLoggedInUserRecordID from "../../../../utils/getLoggedInUserRecordID";

const Paper = ({
  children,
  sx,
}: {
  children?: JSX.Element | JSX.Element[];
  sx?: any;
}) => (
  <Box
    sx={{
      width: "100%",
      borderRadius: "12px",
      boxShadow:
        "0px 2px 10px rgba(0, 0, 0, 0.05), 0px 1px 1px rgba(0, 0, 0, 0.1)",
      minHeight: "335px",
      ...sx,
    }}
  >
    {children}
  </Box>
);

interface OwnProps {
  profileData: ProfileData;
}

const TOTAL_NUM_PROFILE_FIELDS = 5;

// OwnProps is a standard name for the type of data that can be passed to a React component
// In this case, our React component takes only one piece of data named "profileData" that
// is of type ProfileData. This just means that the profileData object is expected to contain
// all of the fields that we have listed in the ProfileData interface.
export default function ProfileChecklist() {
  const {
    state: { profileData },
  } = useContext(AppDataContext);
  const isMobileWidth = useMediaQuery("(max-width:600px)");
  // Use this function to detect if a field in the user's profile is empty
  const isProfileFieldEmpty = (fieldName: string) => {
    const isFieldBlank = !(
      profileData[fieldName] && profileData[fieldName].length
    );

    const defaultProfileFields = getDefaultProfileFields();
    let isFieldDifferentFromDefault;
    switch (fieldName) {
      case "avatarUrl": {
        isFieldDifferentFromDefault =
          profileData[fieldName] !==
          defaultProfileFields["Profile Picture"][0].url;
        break;
      }
      case "competitionSubmission": {
        isFieldDifferentFromDefault =
          profileData[fieldName] !== defaultProfileFields["Submissions (from Users)"];
        break;
      }
      case "aboutMe": {
        isFieldDifferentFromDefault =
          profileData[fieldName] !==
          defaultProfileFields["About Me"]
        break;
      }
      case "skills": {
        isFieldDifferentFromDefault =
          profileData[fieldName] !== defaultProfileFields["Skills"];
        break;
      }
      case "username": {
        isFieldDifferentFromDefault = !isFieldBlank;
        break;
      }
    }

    return isFieldBlank || !isFieldDifferentFromDefault;
  };

  // The number of profile fields completed are already calculated for you below.
  const [numProfileFieldsComplete, setNumProfileFieldsComplete] = useState(0);
  useEffect(() => {
    let num = 0;
    if (!isProfileFieldEmpty("avatarUrl")) {
      num++;
    }
    if (!isProfileFieldEmpty("competitionSubmission")) {
      num++;
    }
    if (!isProfileFieldEmpty("aboutMe")) {
      num++;
    }
    if (!isProfileFieldEmpty("skills")) {
      num++;
    }
    if (!isProfileFieldEmpty("username")) {
      num++;
    }
    // if (!isProfileFieldEmpty("education")) {
    //   num++;
    // }
    setNumProfileFieldsComplete(num);
  }, [profileData]);
  const isPublicProfile = !!queryParams.publicProfileID;
  const [showTooltip, setShowTooltip] = useState(false);
  const TOOLTIP_DISPLAY_TIME_PERIOD_MILLIS = 10000;
  const handleShareProfileClick = () => {
    setShowTooltip(true);

    navigator.clipboard.writeText(
      `https://app.cottage.dev/developer-profiles?publicProfileID=${getLoggedInUserRecordID()}`
    );

    setTimeout(() => setShowTooltip(false), TOOLTIP_DISPLAY_TIME_PERIOD_MILLIS);
  };

  const handleShareProfileClickLinkedIn = () => {
    window.open(`https://www.LinkedIn.com/shareArticle?mini=true&url=https://app.cottage.dev/developer-profiles?publicProfileID=${getLoggedInUserRecordID()}`, '_blank').focus();
  };

  return (
    <Box>
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
                      spacing={1}
                      justifyContent="space-around"
                    >
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<LinkedInIcon />}
                      onClick={handleShareProfileClickLinkedIn}
                    >
                      Share
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<InsertLinkIcon />}
                      onClick={handleShareProfileClick}
                    >
                        Share
                    </Button>
                    </Stack>
                  </Tooltip>
                )}
      {numProfileFieldsComplete < TOTAL_NUM_PROFILE_FIELDS && (
      <>
      <Typography variant="h6" sx={{ fontSize: "16px", textAlign: "center", mt: "1rem", }}>
        Make an impression!
      </Typography>
      <Typography
        variant="body1"
        sx={{ fontSize: "14px", color: "#6B7280", mb: 2, textAlign: "center", }}
      >
        Don't forget to complete your portfolio so your future employer can find you sooner.
      </Typography>
      <Paper>
        <Box sx={{ p: 2 }}>
          <Header
            numProfileFieldsComplete={numProfileFieldsComplete}
            totalFields={TOTAL_NUM_PROFILE_FIELDS}
          />
          <Divider
            color="black"
            sx={{
              margin: "16px 0",
              opacity: "0.1",
            }}
          />
          <RadioButton
            text="Portfolio Photo"
            completed={!isProfileFieldEmpty("avatarUrl")}
          />
          <RadioButton
            text="Competition Submission(s)"
            completed={!isProfileFieldEmpty("competitionSubmission")}
          />
          <RadioButton
            text="About Me"
            completed={!isProfileFieldEmpty("aboutMe")}
          />
          <RadioButton
            text="Skills"
            completed={!isProfileFieldEmpty("skills")}
          />
          <RadioButton
            text="Github Username"
            completed={!isProfileFieldEmpty("username")}
          />
          {/* <RadioButton
              text="Add education"
              completed={!isProfileFieldEmpty("education")}
            /> */}
        </Box>
      </Paper>
      </>
      )}
    </Box>)
}
