import { useContext } from "react";

import { ShowSparkleModalContext } from "../contexts";

const useShowSparkleModal = () => useContext(ShowSparkleModalContext);

export default useShowSparkleModal;
