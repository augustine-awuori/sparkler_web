import { useStreamContext } from "react-activity-feed";

import { ActivityActor } from "../utils/types";

export interface NotificationActivity {
  id: string;
  actor: ActivityActor;
  object: { id: string; data: { text: string } };
}

export default function useNotification() {
  const { client } = useStreamContext();

  const createNotification = async (
    userId: string,
    verb: string,
    data = {},
    reference = {}
  ) => {
    const userNotificationFeed = client?.feed("notification", userId);

    await userNotificationFeed?.addActivity({
      actor: `SU:${client?.userId}`,
      object: reference,
      verb,
      ...data,
    });
  };

  return { createNotification };
}
