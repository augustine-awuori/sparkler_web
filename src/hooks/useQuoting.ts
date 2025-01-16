import { Activity } from "getstream";
import { useFeedContext, useStreamContext } from "react-activity-feed";

import { ActivityActor } from "../utils/types";
import { getEATZone } from "../utils/funcs";
import { nanoid } from "nanoid";
import useNotification from "./useNotification";
import useUser from "./useUser";

const verb = "quote";

const useQuote = () => {
  const { client } = useStreamContext();
  const { createNotification } = useNotification();
  const { user } = useUser();
  const feed = useFeedContext();

  const userFeed = client?.feed("user", user?._id);

  const createQuote = async (quote: string, activity: Activity) => {
    if (!client) return;

    await feed.onAddReaction(verb, activity, { text: quote });

    const collection = await client.collections.add(verb, nanoid(), {
      text: quote,
    });

    const time = getEATZone();
    //TODO: parse for mentions and hashtags
    const newActivity = await userFeed?.addActivity({
      actor: `SU:${user?._id}`,
      verb,
      object: `SO:quote:${collection.id}`,
      foreign_id: client.userId + time,
      quoted_activity: activity,
      time,
    });

    const actor = activity.actor as unknown as ActivityActor;
    if (actor.id !== user?._id) {
      createNotification(
        actor.id,
        verb,
        { text: quote },
        `SO:tweet:${activity.id}`
      );
    }

    return newActivity;
  };

  return { createQuote };
};

export default useQuote;
