import { useContext } from "react";

import { ActivityActor } from "../utils/types";
import { ProfileUserContext } from "../contexts";

const useProfileUser = () => {
  const context = useContext(ProfileUserContext);

  const data = { ...(context.profileUser as unknown as ActivityActor)?.data };

  return { ...context, user: { ...context.profileUser, data } };
};

export default useProfileUser;
