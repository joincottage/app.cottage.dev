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

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        `${API_BASE_URL}/submissions?recordId=${recordId}&loggedInUserRecordID=${loggedInUserRecordID}&jwtToken=${jwtToken}`
      );

      setData(response.data);
    }

    fetchData();
  }, []);

  return { data };
}
