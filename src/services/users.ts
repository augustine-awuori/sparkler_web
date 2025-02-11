import { LoginInfo } from "../pages/LoginPage";
import { RegistrationInfo } from "../pages/RegisterPage";
import client, {
  emptyResponse,
  getFailedResponse,
  processResponse,
  ResponseError,
} from "./client";

const endpoint = "/users";

const register = (userInfo: RegistrationInfo) =>
  client.post(endpoint, userInfo);

const updateFollowers = async (leaderId: string) => {
  try {
    return processResponse(
      await client.patch(`${endpoint}/followers`, { leaderId })
    );
  } catch (error) {
    return getFailedResponse(error);
  }
};

const login = async (userInfo: LoginInfo) => {
  try {
    return processResponse(await client.post("/auth", userInfo));
  } catch (error) {
    return {
      ...emptyResponse,
      problem: (error as ResponseError).response.data?.error || "Unknown error",
    };
  }
};

const updateUserInfo = (userInfo: object) => client.patch(endpoint, userInfo);

const getUserByUsername = async (username: string) => {
  try {
    return processResponse(await client.get(`${endpoint}/${username}`));
  } catch (error) {
    return {
      ...emptyResponse,
      problem: (error as ResponseError).response.data?.error || "Unknown error",
    };
  }
};

const getAllUsers = async () => {
  try {
    return processResponse(await client.get(endpoint));
  } catch (error) {
    return {
      ...emptyResponse,
      problem: (error as ResponseError).response.data?.error || "Unknown error",
    };
  }
};

const quickAuth = (info: {
  email: string;
  profileImage: string;
  name: string;
}) => client.post(`${endpoint}/quick`, info);

const getUser = async (userId: string) => {
  try {
    return processResponse(await client.get(`${endpoint}/${userId}`));
  } catch (error) {
    return getFailedResponse(error);
  }
};

const deleteUserAccont = async () => {
  try {
    return processResponse(await client.delete(endpoint));
  } catch (error) {
    return getFailedResponse(error);
  }
};

const getUserFollowers = async (userId: string) => {
  try {
    return processResponse(await client.get(`${endpoint}/${userId}/followers`));
  } catch (error) {
    return getFailedResponse(error);
  }
};

const getUserFollowing = async (userId: string) => {
  try {
    return processResponse(await client.get(`${endpoint}/${userId}/following`));
  } catch (error) {
    return getFailedResponse(error);
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  deleteUserAccont,
  getAllUsers,
  getUser,
  getUserFollowers,
  getUserFollowing,
  getUserByUsername,
  login,
  quickAuth,
  register,
  updateFollowers,
  updateUserInfo,
};
