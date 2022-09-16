const getLoggedInUserRecordID = () =>
  (window as any)?.logged_in_user?.airtable_record_id || "recZYVAYbm01tOpaZ";

export default getLoggedInUserRecordID;
