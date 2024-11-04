import { useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { User as GoogleUser } from "firebase/auth";
import { useStreamContext } from "react-activity-feed";

import { authTokenKey, processResponse } from "../services/client";
import { googleAuth } from "../storage/config";
import { User } from "../users";
import { UserContext } from "../contexts";
import auth from "../services/auth";
import usersService from "../services/users";

const useUser = () => {
  const [googleUser] = useAuthState(googleAuth);
  const context = useContext(UserContext);
  const { client } = useStreamContext();

  const updateUsername = async (userId: string, username: string) => {
    if (
      !client?.currentUser ||
      (client.currentUser.data as unknown as { username: "" })?.username ||
      userId !== client.userId
    )
      return;

    await client?.currentUser?.update({
      ...client.currentUser,
      username,
    });
  };

  return { ...context, googleUser, updateUsername };
};

export default useUser;

export async function initUser({
  googleUser,
  setUser,
  user,
}: {
  user: User | undefined;
  setUser: (user: User) => void;
  googleUser: GoogleUser | null | undefined;
}) {
  if (user) return;
  const cachedUser = auth.getCurrentUser();
  if (cachedUser) return setUser(cachedUser);

  if (!googleUser) return;
  const { email, displayName, photoURL } = googleUser;
  if (!email || !displayName || !photoURL) return;

  const res = await usersService.quickAuth({
    email,
    name: displayName,
    profileImage: photoURL,
  });

  const { data, ok } = processResponse(res);
  if (ok) {
    auth.loginWithJwt(res.headers[authTokenKey]);
    setUser(data as User);
    window.location.reload();
  } else toast.error("Login failed");
}
