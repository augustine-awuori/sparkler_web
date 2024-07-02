import { nanoid } from "nanoid";
import { useStreamContext } from "react-activity-feed";

export default function useSparkle() {
  const { client } = useStreamContext();

  const user = client?.feed("user", client.userId);

  const createSparkle = async (text: string) => {
    if (!client || !user) return;

    const actor = `user:${client.userId}`;

    const collection = await client.collections.add("tweet", nanoid(), {
      text,
    });

    await user.addActivity({
      actor,
      verb: "tweet",
      object: `SO:tweet:${collection.id}`,
    });
  };

  return { createSparkle };
}
