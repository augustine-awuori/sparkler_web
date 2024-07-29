import { nanoid } from "nanoid";
import { useStreamContext } from "react-activity-feed";
import { toast } from "react-toastify";
import { Activity } from "../utils/types";
import useUser from "./useUser";

export default function useSparkle() {
  const { client } = useStreamContext();
  const { user } = useUser();

  const userFeed = client?.feed("user", client.userId);

  const createSparkle = async (text: string) => {
    if (!client || !userFeed)
      return toast.error("Sparkle could not be created");

    const collection = await client.collections.add("tweet", nanoid(), {
      text,
    });

    const time = new Date().toISOString();

    await userFeed.addActivity({
      actor: `SU:${client.userId}`,
      verb: "tweet",
      object: `SO:tweet:${collection.id}`,
      foreign_id: client.userId + time,
      time,
    });
  };

  const deleteSparkle = (sparkleId: string) => {
    userFeed?.removeActivity(sparkleId);
  };

  const checkIfHasResparkled = (activity: Activity) => {
    let hasResparkled = false;

    if (activity?.own_reactions?.resparkle && user) {
      const myReaction = activity.own_reactions.resparkle.find(
        (act) => act.user.id === user._id
      );
      hasResparkled = Boolean(myReaction);
    }

    return hasResparkled;
  };

  return { createSparkle, deleteSparkle, checkIfHasResparkled };
}
