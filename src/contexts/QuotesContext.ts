import { createContext } from "react";

import { Quote } from "../utils/types";

interface Value {
  quotes: Quote[];
  setQuotes: (quotes: Quote[]) => void;
}

const QuotesContext = createContext<Value>({
  quotes: [],
  setQuotes: () => {},
});

QuotesContext.displayName = "Quotes Context";

export default QuotesContext;
