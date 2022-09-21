const getLoggedInUserRecordID = () =>
  (window as any)?.logged_in_user?.airtable_record_id || "rec4lNKjVyoi66F2s";

export default getLoggedInUserRecordID;
