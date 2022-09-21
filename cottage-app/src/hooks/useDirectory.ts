import { useEffect, useState } from "react";
import axios from "axios";
import getJWTToken from "../utils/getJWTToken";
import { API_URL } from "../constants";

const MIN_LOAD_TIME_MILLIS = 2000;

export default function useWorkflow() {
  const jwtToken = getJWTToken();
  if (!jwtToken) {
    throw new Error("jwtToken not found in cookies. Is the user logged in?");
  }

  const [directory, setDirectory] = useState<any[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      const requestStartMillis = Date.now();
      const response = await axios.get(
        `${API_URL}/api/airtable/directory?jwtToken=${jwtToken}`
      );

      const elapsedTimeMillis = Date.now() - requestStartMillis;
      if (elapsedTimeMillis > MIN_LOAD_TIME_MILLIS) {
        setDirectory(response.data);
      } else {
        setTimeout(() => {
          setDirectory(response.data);
        }, MIN_LOAD_TIME_MILLIS - elapsedTimeMillis);
      }
    }

    fetchData();
  }, []);

  return {
    directory,
    loading: !directory,
    error: null,
  };
}
