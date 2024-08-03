import { useContext } from "react";

import { UsersContext } from "../contexts";

const useUsers = () => useContext(UsersContext);

export default useUsers;
