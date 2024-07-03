import { nanoid } from "nanoid";
import { useStreamContext } from "react-activity-feed";
import { toast } from "react-toastify";

export default function useSparkle() {
  const { client } = useStreamContext();

  const user = client?.feed("user", client.userId);

  const createSparkle = async (text: string) => {
    if (!client || !user) return toast.error("Sparkle could not be created");

    const collection = await client.collections.add("tweet", nanoid(), {
      text,
    });

    await user.addActivity({
      actor: `user:${client.userId}`,
      verb: "tweet",
      object: `SO:tweet:${collection.id}`,
    });
  };

  return { createSparkle };
}
