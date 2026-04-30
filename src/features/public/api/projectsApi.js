import { fulfillmentClient } from "@/shared/lib/http/fulfillmentClient";

function requireId(id, label) {
  if (!id || id === "undefined") {
    throw new Error(`${label} is required`);
  }

  return id;
}

export const projectsApi = {
  async listProjects() {
    const { data } = await fulfillmentClient.get("/projects");
    return data.projects;
  },

  async getProject(projectId) {
    const { data } = await fulfillmentClient.get(`/projects/${requireId(projectId, "Project id")}`);
    return data.project;
  },

  async updateProjectMilestone(projectId, payload) {
    const { data } = await fulfillmentClient.patch(
      `/projects/${requireId(projectId, "Project id")}/milestone`,
      payload,
    );
    return data.project;
  },

  async submitOnboarding(projectId, payload) {
    const { data } = await fulfillmentClient.patch(
      `/projects/${requireId(projectId, "Project id")}/onboarding`,
      payload,
    );
    return data.project;
  },
};
