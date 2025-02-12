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

  const intro = `🚀 **${name}** is an exciting project currently at the **${stage}** stage.`;

  const descriptionInfo = description
    ? `Here's what it's about: *"${description}."*`
    : "The details are still under wraps, but it's shaping up to be something special!";

  const partnershipInfo = partnership
    ? mention
      ? `The project is already in collaboration with **${mention}**, and the founder is actively seeking more partners to bring it to life. If you're interested, reach out!`
      : "This project is open for collaboration! The founder is looking for potential partners who share the vision and are ready to contribute. Feel free to connect if you're interested in joining forces!"
    : 'Right now, the founder is **not** looking for co-founders, but they’re excited to see where this journey leads.';

  const techInfo = tech
    ? `On the technical side, it's built using **${tech}**, ensuring a solid foundation.`
    : "The tech stack hasn't been fully revealed yet, but expect something innovative!";

  const urlInfo = url
    ? `Want to see it in action? Check it out here: ${url}`
    : "The project isn't deployed yet, but stay tuned for updates!";

  return `${intro}

${descriptionInfo}

${partnershipInfo}

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
