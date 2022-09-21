import { useEffect, useState } from "react";
import axios from "axios";
import getJWTToken from "../utils/getJWTToken";
import { API_URL } from "../constants";

export default function useResources() {
  const jwtToken = getJWTToken();
  if (!jwtToken) {
    throw new Error("jwtToken not found in cookies. Is the user logged in?");
  }

  const [resources, setResources] = useState<any[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        `${API_URL}/api/airtable/resources?jwtToken=${jwtToken}`
      );

      setResources(response.data);
    }

    fetchData();
  }, []);

  return {
    resources,
    loading: !resources,
    error: null,
  };
}
