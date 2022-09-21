import Airtable from "airtable";

// FIXME: Move behind API to hide Airtable API key
const base = new Airtable({ apiKey: "keyk0tDEC8slUu1HI" }).base(
  "appG97m5OTveLvpTc"
);

export default base;
