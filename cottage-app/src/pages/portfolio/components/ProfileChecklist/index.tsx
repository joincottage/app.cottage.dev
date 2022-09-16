// You need to import React into every file that contains a React component.
import React, { useState, useEffect, useContext } from "react";

// Import any component you need from the Material UI packacge below.
// List of available components can be viewed in the left sidebar of this page: https://mui.com/material-ui/react-autocomplete/
import { Box, Container, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Divider from '@mui/material/Divider';
import RadioButton from "./RadioButton";
import Header from "./Header";
import ProfileData from "../../types/ProfileData";
import { getDefaultProfileFields } from "../../../../constants";
import { AppDataContext } from "../../../../state/AppContext";

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
          profileData[fieldName] !== defaultProfileFields["Hourly Rate"];
        break;
      }
      case "aboutMe": {
        isFieldDifferentFromDefault =
          profileData[fieldName].trim() !==
          defaultProfileFields["Description"].trim();
        break;
      }
      case "skills": {
        isFieldDifferentFromDefault =
          profileData[fieldName] !== defaultProfileFields["Skills"];
        break;
      }
      case "projects": {
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
    if (!isProfileFieldEmpty("projects")) {
      num++;
    }
    // if (!isProfileFieldEmpty("education")) {
    //   num++;
    // }
    setNumProfileFieldsComplete(num);
  }, [profileData]);

  return numProfileFieldsComplete < TOTAL_NUM_PROFILE_FIELDS ? (
    <Box>
      <Typography variant="h6" sx={{ fontSize: "16px", textAlign: "center", }}>
        Make an impression!
      </Typography>
      <Typography
        variant="body1"
        sx={{ fontSize: "14px", color: "#6B7280", mb: 2, textAlign: "center", }}
      >
        Don't forget to complete your profile so your future employer can find you sooner.
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
            text="Add profile photo"
            completed={!isProfileFieldEmpty("avatarUrl")}
          />
          <RadioButton
            text="Add competition submission(s)"
            completed={!isProfileFieldEmpty("competitionSubmission")}
          />
          <RadioButton
            text="Add Introduction"
            completed={!isProfileFieldEmpty("aboutMe")}
          />
          <RadioButton
            text="Add skills"
            completed={!isProfileFieldEmpty("skills")}
          />
          <RadioButton
            text="Add portfolio project(s)"
            completed={!isProfileFieldEmpty("projects")}
          />
          {/* <RadioButton
              text="Add education"
              completed={!isProfileFieldEmpty("education")}
            /> */}
        </Box>
      </Paper>
    </Box>
  ) : null;
}
