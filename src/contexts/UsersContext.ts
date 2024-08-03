import { createContext } from "react";

export type Users = { [username: string]: string };

interface Value {
  users: Users;
  setUsers: (users: Users) => void;
}

export const UsersContext = createContext<Value>({
  users: {},
  setUsers: () => {},
});

UsersContext.displayName = "Users Context";

export default UsersContext;
