import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../pages/task-overview/src/constants";
import getJWTToken from "../pages/task-overview/src/util/getJWTToken";

interface OwnProps {
  recordId: string;
}

export default function useSubmission({ recordId }: OwnProps) {
  const jwtToken = getJWTToken();
  if (!jwtToken) {
    throw new Error("jwtToken not found in cookies. Is the user logged in?");
  }

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        `${API_BASE_URL}/tasks?recordId=${recordId}&jwtToken=${jwtToken}`
      );

      setData(response.data);
      setLoading(false);
    }

    fetchData();
  }, []);

  return { data, loading };
}
