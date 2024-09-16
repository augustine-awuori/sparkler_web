import { jwtDecode } from "jwt-decode";

import { User } from "../users";

const tokenKey = "token";

const getJwt = () => localStorage.getItem(tokenKey);

const loginWithJwt = (jwt: string) => localStorage.setItem(tokenKey, jwt);

const getCurrentUser = () => {
  try {
    const jwt = getJwt();
    if (jwt) {
      const user: User | null = jwtDecode(jwt);
      return user;
    }
  } catch (error) {
    return null;
  }
};

const logout = () => localStorage.removeItem(tokenKey);

const decode = (jwt: string) => jwtDecode(jwt);

// eslint-disable-next-line import/no-anonymous-default-export
export default { decode, getCurrentUser, getJwt, loginWithJwt, logout };
