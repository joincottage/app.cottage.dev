import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.ENV === 'dev'?
  "appf3p4te7SoyVHB1" :
  "appk7ctplKKCsOhWQ" 

);

export default base;