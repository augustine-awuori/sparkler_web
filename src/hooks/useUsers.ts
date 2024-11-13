import { useContext } from "react";

import { UsersContext } from "../contexts";

const useUsers = () => {
  const context = useContext(UsersContext);

  const getUserIds = (usernames: string[]): string[] => {
    const userIds: string[] = [];

    usernames.forEach((username) => {
      const userId = context.users[username];
      if (userId) userIds.push(userId);
    });

    return userIds;
  };

  return { ...context, getUserIds };
};

export default useUsers;
