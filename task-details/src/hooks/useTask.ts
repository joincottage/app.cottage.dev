import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../constants";
import getJWTToken from "../util/getJWTToken";

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
        `${API_BASE_URL}/tasks?recordId=${recordId}&jwtToken=${jwtToken}`
      );

      // Default behavior is to assume that the recordId url param corresponds to the "Tasks"
      // table, but it will correspond to the "Submissions" table if the /task-details
      // view is opened by clicking on a tile in the /competitions-im-working-on page
      // which displays a list of submissions by the user that are editable.
      if (response.data.length === 0) {
        // Get submission
        response = await axios.get(
          `${API_BASE_URL}/submissions?submissionId=${recordId}&jwtToken=${jwtToken}`
        );

        if (!response.data[0]) {
          throw new Error(`Submission not found for record ID: ${recordId}`);
        }

        // Use record ID of the task from the submission to fetch the task
        response = await axios.get(
          `${API_BASE_URL}/tasks?recordId=${response.data[0]["Record ID (from Tasks)"]}&jwtToken=${jwtToken}`
        );
      }

      setData(response.data);
      setLoading(false);
    }

    fetchData();
  }, []);

  return { data, loading };
}
