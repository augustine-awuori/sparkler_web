import { useContext } from "react";

import { ProfileContext } from "../components/contexts";
import { ActivityActor } from "../utils/types";

const useProfile = () => {
  const context = useContext(ProfileContext);

  const data = { ...(context.user as unknown as ActivityActor)?.data };

  return { ...context, user: { ...context.user, data } };
};

export default useProfile;
