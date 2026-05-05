import { broadcastsService } from "./broadcasts.service.js";

export const broadcastsController = {
  async create(req, res) {
    const broadcast = await broadcastsService.createBroadcast(
      req.auth,
      req.body,
    );
    res.status(201).json({ broadcast });
  },

  async saveDraft(req, res) {
    const broadcast = await broadcastsService.saveDraft(req.auth, req.body);
    res.status(201).json({ broadcast });
  },

  async list(req, res) {
    const result = await broadcastsService.listBroadcasts(req.auth, req.query);
    res.status(200).json(result);
  },

  async getById(req, res) {
    const broadcast = await broadcastsService.getBroadcast(
      req.auth,
      req.params.broadcastId,
    );
    res.status(200).json({ broadcast });
  },

  async cancel(req, res) {
    const broadcast = await broadcastsService.cancelBroadcast(
      req.auth,
      req.params.broadcastId,
    );
    res.status(200).json({ broadcast });
  },

  async remove(req, res) {
    await broadcastsService.deleteBroadcast(req.auth, req.params.broadcastId);
    res.status(204).end();
  },
};
