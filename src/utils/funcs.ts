import { toast } from "react-toastify";

import { FeedUser } from "../contexts/ProfileUserContext";
import { User } from "../users";

export function getEATZone() {
  const time = new Date();

  return new Date(time.getTime() + 3 * 60 * 60 * 1000).toISOString();
}

export function getProfileUserDataFromUserInfo(user: User): FeedUser {
  return {
    created_at: "",
    id: user._id,
    updated_at: "",
    duration: "",
    data: { ...user },
  };
}

export function copyToClipBorad(text: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => toast.success("Link copied to clip board"))
    .catch(() => toast.error("Link not copied! Something failed"));
}

export interface ProjectData {
  description?: string;
  mention?: string;
  name: string;
  partnership: boolean;
  stage: string;
  tech?: string;
  url?: string;
}

export function describeProject(project: ProjectData): string {
  const { name, description, mention, partnership, stage, tech, url } = project;

  const partnerInfo = partnership
    ? mention
      ? `This project is a partnership with ${mention}.`
      : "This project is a partnership."
    : "This project does not involve a partnership.";

  const techInfo = tech
    ? `It uses ${tech}.`
    : "The technology stack has not been specified.";

  const urlInfo = url
    ? `You can view it here: ${url}.`
    : "The project is not yet deployed.";

  const descriptionInfo = description
    ? `Description: ${description}.`
    : "No description has been provided.";

  return `Project Name: ${name}.
${descriptionInfo}
Stage: ${stage}.
${partnerInfo}
${techInfo}
${urlInfo}`;
}
