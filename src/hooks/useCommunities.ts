import { useContext } from "react";

import { Activity } from "../utils/types";
import api from "../services/communities";
import CommunityContext, { Community } from "../contexts/CommunitiesContext";
import useUser from "./useUser";

export default function useCommunities() {
  const context = useContext(CommunityContext);
  const { user } = useUser();

  const getCommunityById = (communityId: string) =>
    context.communities.find((c) => c._id === communityId);

  const getUserCommunities = (): Community[] => {
    if (!user) return [];

    return context.communities
      .filter((community) => {
        const result = community.members.find((member) => member === user._id);
        return result ? community : undefined;
      })
      .filter((c) => c);
  };

  const getCommunitySparkles = async (
    communityId: string
  ): Promise<Activity[]> => {
    const { data, ok } = await api.getCommunitySparkles(communityId);
    return ok ? (data as unknown as Activity[]) : [];
  };

  const joinCommunity = (communityId: string) => api.joinCommunity(communityId);

  const update = (community: Community) =>
    context.setCommunities(
      context.communities.map((c) => (c._id === community._id ? community : c))
    );

  const addMember = (communityId: string) => {
    if (user)
      context.setCommunities(
        context.communities.map((c) =>
          c._id === communityId
            ? { ...c, members: [user._id, ...c.members] }
            : c
        )
      );
  };

  const hasMember = (memberId: string, communityId: string): boolean => {
    const community = context.communities.find((c) => c._id === communityId);
    if (!community) return false;

    return !!community.members.find((m) => m === memberId);
  };

  const createCommunity = async (newCommunity: { name: string; bio: string }) =>
    api.createCommunity(newCommunity);

  const addCommunity = (community: Community) =>
    context.setCommunities([community, ...context.communities]);

  return {
    ...context,
    addCommunity,
    addMember,
    createCommunity,
    getCommunityById,
    hasMember,
    joinCommunity,
    getUserCommunities,
    getCommunitySparkles,
    updateLocally: update,
  };
}
