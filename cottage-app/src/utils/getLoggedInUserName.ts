const getLoggedInUserName = () =>
  window.logged_in_user
    ? window.logged_in_user.Name || window.softr_user_full_name || ""
    : "Gavin";

export default getLoggedInUserName;
