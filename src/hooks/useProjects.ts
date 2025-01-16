import projectsApi from "../services/projects";

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

export const PROJECT_VERB = "project";

const useProjects = () => {
  const saveProject = async (project: ProjectData) =>
    await projectsApi.saveProject(project);

  return { saveProject };
};

export default useProjects;
