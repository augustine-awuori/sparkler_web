import { useContext } from "react";

import { ProfileContext } from "../components/contexts";

const useProfile = () => useContext(ProfileContext);

export default useProfile;
