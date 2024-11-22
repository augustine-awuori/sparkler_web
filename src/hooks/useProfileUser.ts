import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { ActivityActor } from "../utils/types";
import { getProfileUserDataFromUserInfo } from "../utils/funcs";
import { User } from "../users";
import ProfileUserContext, { FeedUser } from "../contexts/ProfileUserContext";

const useProfileUser = () => {
  const context = useContext(ProfileUserContext);
  const navigate = useNavigate();

  const data = { ...(context.profileUser as unknown as ActivityActor)?.data };

  const isFeedUser = (user: FeedUser | User): user is FeedUser =>
    (user as FeedUser).data !== undefined;

  const viewUserProfile = (user: FeedUser | User) => {
    const userInfo: FeedUser = isFeedUser(user)
      ? user
      : getProfileUserDataFromUserInfo(user);

    context.setProfileUser(userInfo);
    navigate(`/${userInfo.data.username}`);
  };

  return {
    ...context,
    user: { ...context.profileUser, data },
    viewUserProfile,
  };
};

export default useProfileUser;
