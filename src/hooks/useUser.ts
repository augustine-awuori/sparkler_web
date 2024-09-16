import { useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { UserContext } from "../contexts";
import { googleAuth } from "../storage/config";

const useUser = () => {
  const [googleUser] = useAuthState(googleAuth);
  const context = useContext(UserContext);

  return { ...context, googleUser };
};

export default useUser;
