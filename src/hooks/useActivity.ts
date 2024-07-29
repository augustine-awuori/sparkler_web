import { useContext } from "react";

import { ActivityContext } from "../contexts";

const useActivity = () => useContext(ActivityContext);

export default useActivity;
