import { createContext } from "react";

import { User } from "../users";

export type Users = { [username: string]: string };

interface Value {
  allUsers: User[];
  users: Users;
  setUsers: (users: Users) => void;
}

export const UsersContext = createContext<Value>({
  allUsers: [],
  users: {},
  setUsers: () => {},
});

UsersContext.displayName = "Users Context";

export default UsersContext;
