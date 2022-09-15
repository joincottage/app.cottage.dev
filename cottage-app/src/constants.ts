import ProfileData from "./pages/profile/types/ProfileData";
import getLoggedInUserName from "./utils/getLoggedInUserName";
import getLoggedInUserRecordID from "./utils/getLoggedInUserRecordID";

export const GOOGLE_MAPS_API_KEY = "AIzaSyAebVcmFluyByzg2C865rud5as7p49whr8";

export const API_URL =
process.env.REACT_APP_TEST_ENV === "dev"
    ? "https://3000-joincottage-appcottaged-q6l72zdlmga.ws-us65.gitpod.io"
    : "https://cottage-api.vercel.app";
  
export const getDefaultProfileFields = (): ProfileData => ({
      "Freelancer Name": getLoggedInUserName(),
      "Profile Picture": [
        {
          url: "https://dl.airtable.com/.attachments/fa45105ce4c3b1eb5ded34106bb700b9/77ba5617/Portrait_Placeholder.png",
        },
      ],
      Location: "Your Location",
      Description: "Tell us about yourself",
      Skills: "Web 3",
      "Hourly Rate": "X",
      "Current company": "",
      Username: "your-username",
      Users: [getLoggedInUserRecordID()],
    });
    
