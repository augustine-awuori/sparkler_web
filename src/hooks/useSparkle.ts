import { nanoid } from "nanoid";
import { useStreamContext } from "react-activity-feed";
import { toast } from "react-toastify";

export default function useSparkle() {
  const { client } = useStreamContext();

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

  return { createSparkle };
}
