import { useEffect, useState } from "react";
import { connect, StreamClient } from "getstream";

const client: StreamClient = connect(
  "YOUR_API_KEY",
  "YOUR_API_SECRET",
  "APP_ID"
);

interface User {
  id: string;
  name: string;
  profileImage: string;
}

const useUsersToFollow = (userId: string) => {
  const [usersToFollow, setUsersToFollow] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUsersToFollow = async () => {
      try {
        setLoading(true);

        // Fetch the list of followed users
        const followedResponse = await client
          .feed("timeline", userId)
          .following();
        const followedUserIds = followedResponse.results.map(
          (follow: any) => follow.target_id
        );

        // Fetch the list of potential users to follow
        const response = await client
          .feed("user_feed", userId)
          .get({ limit: 10 });
        const potentialUsers: User[] = response.results.map(
          (activity: any) => ({
            id: activity.actor.id,
            name: activity.actor.data.name,
            profileImage: activity.actor.data.profileImage,
          })
        );

        // Filter out users who are already followed
        const usersToFollow = potentialUsers.filter(
          (user) => !followedUserIds.includes(`user:${user.id}`)
        );

        setUsersToFollow(usersToFollow);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersToFollow();
  }, [userId]);

  return { usersToFollow, loading, error };
};

export default useUsersToFollow;
