import { ServiceRequestModel } from "./service-request.model.js";

function normalizeRequest(request) {
  const value = request?.toObject ? request.toObject() : request;

  if (!value) return value;

  return {
    ...value,
    id: value.id || value._id?.toString(),
  };
}

function normalizeRequests(requests) {
  return requests.map((request) => normalizeRequest(request));
}

export const serviceRequestsRepository = {
  async create(request) {
    const created = await ServiceRequestModel.create(request);
    return normalizeRequest(created);
  },

  async findById(requestId) {
    const request = await ServiceRequestModel.findById(requestId).lean({ virtuals: true });
    return normalizeRequest(request);
  },

  async findForCustomer(customerId) {
    const requests = await ServiceRequestModel.find({ customerId }).sort({ createdAt: -1 }).lean({ virtuals: true });
    return normalizeRequests(requests);
  },

  async findForProjectIds(projectIds) {
    if (!projectIds.length) {
      return [];
    }

    const requests = await ServiceRequestModel.find({ projectId: { $in: projectIds } }).sort({ createdAt: -1 }).lean({ virtuals: true });
    return normalizeRequests(requests);
  },

  async findAll() {
    const requests = await ServiceRequestModel.find({}).sort({ createdAt: -1 }).lean({ virtuals: true });
    return normalizeRequests(requests);
  },

  async updateRequest(requestId, updates) {
    const request = await ServiceRequestModel.findByIdAndUpdate(
      requestId,
      { $set: updates },
      { new: true },
    ).lean({ virtuals: true });

    return normalizeRequest(request);
  },
};
