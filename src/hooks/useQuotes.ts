import { useContext } from "react";

import { QuotesContext } from "../contexts";

const useQuotes = () => useContext(QuotesContext);

export default useQuotes;
