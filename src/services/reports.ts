import { getFailedResponse, processResponse } from "./client";
import { ReportInfo } from "../pages/ReportsPage";
import client from "./client";

const endpoint = "/reports";

interface NewReport extends ReportInfo {
  images: string[];
  longitude?: number;
  latitude?: number;
}

const saveReport = async (project: NewReport) => {
  try {
    return processResponse(await client.post(endpoint, project));
  } catch (error) {
    return getFailedResponse(error);
  }
};

const getReports = async () => {
  try {
    return processResponse(await client.get(endpoint));
  } catch (error) {
    return getFailedResponse(error);
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { getReports, saveReport };
