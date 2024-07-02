import { useContext } from "react";

import { UserContext } from "../components/contexts";

const useUser = () => useContext(UserContext);

export default useUser;
