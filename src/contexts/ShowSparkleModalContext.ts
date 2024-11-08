import { createContext } from "react";

interface ContextValue {
  showSparkleModal: boolean;
  setShowSparkleModal: (show: boolean) => void;
}

export const ShowSparkleModalContext = createContext<ContextValue>({
  showSparkleModal: false,
  setShowSparkleModal: () => {},
});

ShowSparkleModalContext.displayName = "Show Sparkle Modal Context";

export default ShowSparkleModalContext;
