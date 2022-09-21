import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../constants";
import { getJWTToken } from "@cottage-software-inc/client-library/lib/lib/helpers";

interface OwnProps {
  recordId: string;
  loggedInUserRecordID: string;
}

export default function useSubmission({
  recordId,
  loggedInUserRecordID,
}: OwnProps) {
  const jwtToken = getJWTToken();
  if (!jwtToken) {
    throw new Error("jwtToken not found in cookies. Is the user logged in?");
  }

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      let response = await axios.get(
        `${API_BASE_URL}/submissions?recordId=${recordId}&loggedInUserRecordID=${loggedInUserRecordID}&jwtToken=${jwtToken}`
      );

      // Default behavior is to assume that the recordId url param corresponds to the "Tasks"
      // table, but it will correspond to the "Submissions" table if the /task-details
      // view is opened by clicking on a tile in the /competitions-im-working-on page
      // which displays a list of submissions by the user that are editable.
      if (response.data.length === 0) {
        // Get submission assuming recordId is a submission record ID
        response = await axios.get(
          `${API_BASE_URL}/submissions?submissionId=${recordId}&jwtToken=${jwtToken}`
        );

        // If we don't have any data in the response at this point, we assume that the user
        // hasn't started this competition yet and we should render a fresh competition template.
        if (!response.data[0]) {
          console.log(
            `No submission found for recordId: ${recordId}. Assuming user has not started competition.`
          );
        }
      }

      setData(response.data);
      setLoading(false);
    }

    fetchData();
  }, []);

  return { data, loading };
}
