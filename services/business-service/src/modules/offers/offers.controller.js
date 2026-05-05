import { offersService } from "./offers.service.js";

export const offersController = {
  async create(req, res) {
    const offer = await offersService.createOffer(req.auth, req.body);
    res.status(201).json({ offer });
  },

  async list(req, res) {
    const result = await offersService.listOffers(req.auth, req.query);
    res.status(200).json(result);
  },

  async getById(req, res) {
    const offer = await offersService.getOffer(req.auth, req.params.offerId);
    res.status(200).json({ offer });
  },

  async update(req, res) {
    const offer = await offersService.updateOffer(
      req.auth,
      req.params.offerId,
      req.body,
    );
    res.status(200).json({ offer });
  },

  async toggleStatus(req, res) {
    const offer = await offersService.toggleStatus(
      req.auth,
      req.params.offerId,
      req.body.status,
    );
    res.status(200).json({ offer });
  },

  async remove(req, res) {
    await offersService.deleteOffer(req.auth, req.params.offerId);
    res.status(204).end();
  },

  async generateCode(req, res) {
    const result = await offersService.generateCode(req.auth);
    res.status(200).json(result);
  },

  async getStats(req, res) {
    const stats = await offersService.getStats(req.auth);
    res.status(200).json(stats);
  },
};
