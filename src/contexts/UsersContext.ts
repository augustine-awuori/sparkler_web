import { createContext } from "react";

import { User } from "../users";

export type Users = { [username: string]: string };

export type IdUserMap = { [id: string]: User };

export type UsernameIdMap = { [username: string]: string };

interface Value {
  allUsers: User[];
  idUserMap: IdUserMap;
  isLoading: boolean;
  setIdUserMap: (map: IdUserMap) => void;
  setLoading: (isLoading: boolean) => void;
  setUsernameIdMap: (users: UsernameIdMap) => void;
  setUsers: (users: Users) => void;
  usernameIdMap: UsernameIdMap;
  users: Users;
}

export const UsersContext = createContext<Value>({
  allUsers: [],
  idUserMap: {},
  isLoading: false,
  setIdUserMap: () => {},
  setLoading: () => {},
  setUsernameIdMap: () => {},
  setUsers: () => {},
  usernameIdMap: {},
  users: {},
});

UsersContext.displayName = "Users Context";

export default UsersContext;
