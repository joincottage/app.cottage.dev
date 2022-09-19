import { useEffect, useState } from "react";
import axios from "axios";
import getJWTToken from "../utils/getJWTToken";
import {
  API_URL,
  DEFAULT_PROFILE_FIELDS,
  getDefaultProfileFields,
} from "../constants";
import ProfileData from "../pages/portfolio/types/ProfileData";
import { formatProjectAPIResponse } from "../utils/formatters";
import getLoggedInUserName from "../utils/getLoggedInUserName";
import getLoggedInUserRecordID from "../utils/getLoggedInUserRecordID";

interface OwnProps {
  userRecordId: string;
}

const MIN_LOAD_TIME_MILLIS = 2000;

export default function useProfile({ userRecordId }: OwnProps) {
  const [data, setData] = useState<ProfileData | null>(null);

  useEffect(() => {
    async function fetchData() {
      const requestStartMillis = Date.now();

      let response;
      try {
        response = await axios.get(
          `${API_URL}/api/airtable/profile?loggedInUserRecordId=${userRecordId}`
        );
      } catch (err) {
        // Create a profile if one does not exist
        if (err.response.status === 404) {
          response = await axios.post(`${API_URL}/api/airtable/profile`, {
            fields: getDefaultProfileFields(),
          });
        } else {
          throw err;
        }
      }
      
      const profileData = response.data.map((d: any) => ({
        name: d["Developer Name"],
        avatarUrl: d["Profile Picture"] ? d["Profile Picture"][0].url : "",
        username: d["Username"],
        location: d["Location"],
        competitionSubmission: d["Submissions (from Users)"],
        skills: d["Skills"],
        aboutMe: d["Description"],
        projects: d["Projects"] || [],
        education: d["Education"] || [],
        recordId: d["Record ID"],
      }));

      profileData[0].projects = profileData[0].projects.map((p: any) =>
        formatProjectAPIResponse(p)
      );

      const elapsedTimeMillis = Date.now() - requestStartMillis;
      if (elapsedTimeMillis > MIN_LOAD_TIME_MILLIS) {
        setData(profileData[0]);
      } else {
        setTimeout(() => {
          setData(profileData[0]);
        }, MIN_LOAD_TIME_MILLIS - elapsedTimeMillis);
      }
    }

    fetchData();
  }, []);

  return {
    data,
    loading: !data,
    error: null,
  };
}
