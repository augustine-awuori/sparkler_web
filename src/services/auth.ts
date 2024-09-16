import { jwtDecode } from "jwt-decode";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

import { googleAuth } from "../storage/config";
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

const logout = async () => {
  localStorage.removeItem(tokenKey);
  await googleSignOut();
};

const decode = (jwt: string) => jwtDecode(jwt);

const loginWithGoogle = () =>
  signInWithPopup(googleAuth, new GoogleAuthProvider());

async function googleSignOut() {
  await signOut(googleAuth);
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  decode,
  getCurrentUser,
  getJwt,
  loginWithGoogle,
  loginWithJwt,
  logout,
};
