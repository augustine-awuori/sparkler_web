import { getFailedResponse, processResponse } from "./client";
import { ProjectData } from "../hooks/useProjects";
import client from "./client";

const endpoint = "/projects";

const saveProject = async (project: ProjectData) => {
  try {
    return processResponse(await client.post(endpoint, project));
  } catch (error) {
    return getFailedResponse(error);
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { saveProject };
