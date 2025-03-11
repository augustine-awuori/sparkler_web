import auth from "../services/auth";

export const logout = () => {
  auth.logout();
  window.location.reload();
};

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  return { logout };
};
