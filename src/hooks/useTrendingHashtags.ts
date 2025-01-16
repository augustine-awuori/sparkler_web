import { useEffect, useState } from "react";
import { useStreamContext } from "react-activity-feed";

import { Activity } from "../utils/types";
import { getHashtags } from "../utils/string";
import { PROJECT_VERB } from "./useProjects";

type HashtagsToCountMap = {
  [key: string]: number;
};

const useTrendingHashtags = () => {
  const { client } = useStreamContext();
  const [hashtags, setHashtags] = useState<HashtagsToCountMap>({});
  const [verifiedHashtags, setVerifiedHashtags] = useState<HashtagsToCountMap>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [sparklesWithHashtags, setSparklesWithHashtags] = useState<Activity[]>(
    []
  );

  useEffect(() => {
    async function initHashtags() {
      const hashtags = await getAllHashtags();

      setHashtags(parseHashtagsFromSparkles(hashtags));
    }

    async function initVerifiedHashtags() {
      setVerifiedHashtags(
        parseHashtagsFromSparkles(await getVerifiedHashtags())
      );
    }

    setIsLoading(true);
    initHashtags();
    initVerifiedHashtags();
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getVerifiedHashtags() {
    const response = await client?.feed("hashtags", "verified").get();

    return (response?.results || []) as unknown as Activity[];
  }

  async function getAllHashtags() {
    const response = await client?.feed("hashtags", "general").get();

    const results = (response?.results || []) as unknown as Activity[];
    setSparklesWithHashtags(results);

    return results;
  }

  function parseHashtagsFromSparkles(
    sparklesWithHashtags: Activity[]
  ): HashtagsToCountMap {
    let hashtags: HashtagsToCountMap = {};

    sparklesWithHashtags.forEach((sparkle) => {
      const isAProject = sparkle.verb === PROJECT_VERB;
      const sparkleHashtags: string[] = isAProject
        ? ["project"]
        : getHashtags(sparkle.object.data.text);

      sparkleHashtags.forEach((hashtag) => {
        hashtags[hashtag] = hashtag in hashtags ? hashtags[hashtag] + 1 : 1;
      });
    });

    return hashtags;
  }

  return { verifiedHashtags, sparklesWithHashtags, hashtags, isLoading };
};

export default useTrendingHashtags;
