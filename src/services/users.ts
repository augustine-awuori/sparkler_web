import { LoginInfo } from "../pages/LoginPage";
import { RegistrationInfo } from "../pages/RegisterPage";
import client, {
  emptyResponse,
  processResponse,
  ResponseError,
} from "./client";

const endpoint = "/users";

const register = (userInfo: RegistrationInfo) =>
  client.post(endpoint, userInfo);

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

const quickAuth = (info: { email: string; avatar: string; name: string }) =>
  client.post(`${endpoint}/quick`, info);

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAllUsers, register, login, getUserByUsername, quickAuth };
