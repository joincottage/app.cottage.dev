const getLoggedInUserRecordID = () =>
  (window as any)?.logged_in_user?.airtable_record_id || "rec3a0NP5VDB0i7Tq";

export default getLoggedInUserRecordID;
