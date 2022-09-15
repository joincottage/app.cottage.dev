const getLoggedInUserRecordID = () =>
  (window as any)?.logged_in_user?.airtable_record_id || "recl4QqKSpFuPg2Iu";

export default getLoggedInUserRecordID;
