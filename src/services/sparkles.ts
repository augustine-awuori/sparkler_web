import apiClient, { getFailedResponse, processResponse } from "./client";

const endpoint = "/sparkles";

const getSparkles = async (sparklesId: string[]) => {
  try {
    return processResponse(
      await apiClient.post(`${endpoint}/get-sparkles-of-ids`, { sparklesId })
    );
  } catch (error) {
    return getFailedResponse(error);
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getSparkles,
};
