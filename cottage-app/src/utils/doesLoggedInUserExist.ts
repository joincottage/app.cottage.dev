const doesLoggedInUserExist = () =>
  process.env.REACT_APP_TEST_ENV === "dev" ? true : !!window.logged_in_user;

export default doesLoggedInUserExist;
