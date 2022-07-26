import getCookie from "./getCookie";

const getJWTToken = () =>
  getCookie("jwtToken") || process.env.REACT_APP_TEST_JWT_TOKEN;

export default getJWTToken;
