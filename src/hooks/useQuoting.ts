import { Activity } from "getstream";
import { useStreamContext } from "react-activity-feed";
import useNotification from "./useNotification";
import useUser from "./useUser";
import { nanoid } from "nanoid";
import { ActivityActor } from "../utils/types";
import { getEATZone } from "../utils/funcs";

const verb = "quote";

const useQuote = () => {
  const { client } = useStreamContext();
  const { createNotification } = useNotification();
  const { user } = useUser();

  const userFeed = client?.feed("user", user?._id);

  const createQuote = async (quote: string, activity: Activity) => {
    if (!client) return;

    const collection = await client.collections.add("quote", nanoid(), {
      text: quote,
    });

    const time = getEATZone();

    // Add the new activity to the feed
    const newActivity = await userFeed?.addActivity({
      actor: `SU:${user?._id}`,
      verb,
      object: `SO:quote:${collection.id}`,
      foreign_id: client.userId + time,
      quoted_activity: activity,
      time,
    });

    // Create a notification for the original activity's actor
    const actor = activity.actor as unknown as ActivityActor;
    if (actor.id !== user?._id) {
      createNotification(
        actor.id,
        verb,
        { text: quote },
        `SO:tweet:${activity.id}` // Reference to the original activity
      );
    }

    return newActivity;
  };

  return { createQuote };
};

export default useQuote;
