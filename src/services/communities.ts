import { getFailedResponse, processResponse } from "./client";
import client from "./client";

const endpoint = "/communities";

const createCommunity = async (newCommunity: {
  name: string;
  bio?: string;
}) => {
  try {
    return processResponse(await client.post(endpoint, newCommunity));
  } catch (error) {
    return getFailedResponse(error);
  }
};

const getCommunities = async () => {
  try {
    return processResponse(await client.get(endpoint));
  } catch (error) {
    return getFailedResponse(error);
  }
};

const getCommunity = async (communityId: string) => {
  try {
    return processResponse(await client.get(`${endpoint}/${communityId}`));
  } catch (error) {
    return getFailedResponse(error);
  }
};

const getCommunitySparkles = async (communityId: string) => {
  try {
    return processResponse(
      await client.get(`${endpoint}/sparkles/${communityId}`)
    );
  } catch (error) {
    return getFailedResponse(error);
  }
};

const joinCommunity = async (communityId: string) => {
  try {
    return processResponse(
      await client.patch(`${endpoint}/${communityId}/join`)
    );
  } catch (error) {
    return getFailedResponse(error);
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  createCommunity,
  joinCommunity,
  getCommunities,
  getCommunity,
  getCommunitySparkles,
};
