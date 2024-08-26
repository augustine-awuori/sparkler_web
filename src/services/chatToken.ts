import auth from "./auth";
import client, {
  processResponse,
  getFailedResponse,
  authTokenKey,
} from "./client";

const endpoint = "/chatToken";

const getChatToken = async () => {
  try {
    const res = await client.post(endpoint);
    const jwt = res.headers[authTokenKey];

    const response = processResponse(res);
    if (response.ok && jwt) {
      auth.logout();
      auth.loginWithJwt(jwt);
    }

    return response;
  } catch (error) {
    return getFailedResponse(error);
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { getChatToken };
