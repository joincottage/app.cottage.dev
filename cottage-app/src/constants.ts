export const GOOGLE_MAPS_API_KEY = "AIzaSyAebVcmFluyByzg2C865rud5as7p49whr8";
export const API_BASE_URL =
  process.env.REACT_APP_TEST_ENV === "dev" ?
  "https://3001-joincottage-appcottaged-t1fgxxkdgs2.ws-us65.gitpod.io/api/airtable" :
  "https://cottage-api.vercel.app/api/airtable";
