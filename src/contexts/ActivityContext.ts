import { createContext } from "react";
import { Activity, DefaultGenerics } from "getstream";

export interface Value {
  activity: Activity<DefaultGenerics> | undefined;
  setActivity: (activity: Activity<DefaultGenerics>) => void;
}

export const ActivityContext = createContext<Value>({
  activity: undefined,
  setActivity: () => {},
});

ActivityContext.displayName = "Activity Context";

export default ActivityContext;
