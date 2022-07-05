import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  "appk7ctplKKCsOhWQ"
);

export default base;
