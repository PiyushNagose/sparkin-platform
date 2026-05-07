import { serviceRequestsService } from "./service-requests.service.js";

export const serviceRequestsController = {
  async create(req, res) {
    const request = await serviceRequestsService.createRequest(
      req.auth,
      req.body,
    );
    res.status(201).json({ request });
  },

  async list(req, res) {
    const requests = await serviceRequestsService.listRequests(req.auth);
    const page = parseInt(req.query.page, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 0;

    if (page > 0 && limit > 0) {
      const total = requests.length;
      const start = (page - 1) * limit;
      const paginated = requests.slice(start, start + limit);
      return res.status(200).json({
        requests: paginated,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    }

    res.status(200).json({ requests });
  },

  async getById(req, res) {
    const request = await serviceRequestsService.getRequest(
      req.auth,
      req.params.requestId,
    );
    res.status(200).json({ request });
  },

  async updateStatus(req, res) {
    const request = await serviceRequestsService.updateStatus(
      req.auth,
      req.params.requestId,
      req.body,
    );
    res.status(200).json({ request });
  },
};
