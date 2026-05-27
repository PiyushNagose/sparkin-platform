import { fulfillmentClient } from "@/shared/lib/http/fulfillmentClient";
import {
  cachedGet,
  invalidateRequestCache,
} from "@/shared/lib/http/requestCache";

function requireId(id, label) {
  if (!id || id === "undefined") {
    throw new Error(`${label} is required`);
  }

  return id;
}

export const projectsApi = {
  async listProjects(options = {}) {
    const { data } = await cachedGet(fulfillmentClient, "/projects", options);
    return data.projects;
  },

  async createManualProjectAdmin(payload) {
    const { data } = await fulfillmentClient.post("/projects/manual", payload);
    invalidateRequestCache("/projects");
    return data.project;
  },

  async getProject(projectId, options = {}) {
    const { data } = await cachedGet(
      fulfillmentClient,
      `/projects/${requireId(projectId, "Project id")}`,
      options,
    );
    return data.project;
  },

  async updateProjectMilestone(projectId, payload) {
    const { data } = await fulfillmentClient.patch(
      `/projects/${requireId(projectId, "Project id")}/milestone`,
      payload,
    );
    invalidateRequestCache("/projects");
    return data.project;
  },

  async sendSiteVisitReminder(projectId, payload = {}) {
    const { data } = await fulfillmentClient.post(
      `/projects/${requireId(projectId, "Project id")}/site-visit-reminders`,
      payload,
    );
    invalidateRequestCache("/projects");
    return data.project;
  },

  async rejectVendorForSiteVisit(projectId, payload = {}) {
    const { data } = await fulfillmentClient.post(
      `/projects/${requireId(projectId, "Project id")}/reject-vendor`,
      payload,
    );
    invalidateRequestCache("/projects");
    return data.project;
  },

  async submitOnboarding(projectId, payload) {
    const { data } = await fulfillmentClient.patch(
      `/projects/${requireId(projectId, "Project id")}/onboarding`,
      payload,
    );
    invalidateRequestCache("/projects");
    return data.project;
  },

  async uploadDocument(projectId, payload) {
    const { data } = await fulfillmentClient.post(
      `/projects/${requireId(projectId, "Project id")}/documents`,
      payload,
    );
    invalidateRequestCache("/projects");
    return data.project;
  },

  async reassignVendor(projectId, payload) {
    const { data } = await fulfillmentClient.post(
      `/projects/${requireId(projectId, "Project id")}/reassign-vendor`,
      payload,
    );
    invalidateRequestCache(
      (key) => key.includes("/projects") || key.includes("/leads"),
    );
    return data.project;
  },
};
