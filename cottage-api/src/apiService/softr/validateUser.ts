import axios from "axios";

// https://docs.softr.io/my-account/api-settings#validate-an-authentication-token
export default async function validateUser(jwt: string) {
  const response = await axios.post(
    "https://sequense.softr.app/v1/api/users/validate-token",
    { jwt },
    { headers: { "Content-Type": "application/json" } }
  );

  return response.data;
}
