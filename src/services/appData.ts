import client, { getFailedResponse, processResponse } from "./client";

const endpoint = "/data";

const getAppData = async () => {
  try {
    return processResponse(await client.get(endpoint));
  } catch (error) {
    return getFailedResponse(error);
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAppData };
