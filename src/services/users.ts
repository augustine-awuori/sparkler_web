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

// eslint-disable-next-line import/no-anonymous-default-export
export default { register, login };
