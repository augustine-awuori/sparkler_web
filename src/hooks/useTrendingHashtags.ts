import { useEffect, useState } from "react";
import { useStreamContext } from "react-activity-feed";

import { Activity } from "../utils/types";
import { parseHashtags } from "../utils/string";

type Hashtags = {
  [key: string]: number;
};

const useTrendingHashtags = () => {
  const { client } = useStreamContext();
  const [hashtags, setHashtags] = useState<Hashtags>({});
  const [sparklesWithHashtags, setSparklesWithHashtags] = useState<Activity[]>(
    []
  );

  useEffect(() => {
    initHashtags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function initHashtags() {
    const hashtags = await getAllHashtags();

    setHashtags(parseHashtagsFromSparkles(hashtags));
  }

  async function getAllHashtags() {
    const response = await client?.feed("hashtags", "general").get();

    const results = (response?.results || []) as unknown as Activity[];
    setSparklesWithHashtags(results);

    return results;
  }

  function parseHashtagsFromSparkles(sparklesWithHashtags: Activity[]) {
    let hashtags: Hashtags = {};

    sparklesWithHashtags.forEach((sparkle) => {
      const text = sparkle.object.data.text;

      parseHashtags(text).forEach(async (hashtag) => {
        let count = 0;

        sparklesWithHashtags.forEach((sparkle) => {
          if (sparkle.object.data.text.includes(`#${hashtag}`)) count++;
        });

        return (hashtags[hashtag] = count);
      });
    });

    return hashtags;
  }

  return { sparklesWithHashtags, hashtags };
};

export default useTrendingHashtags;
