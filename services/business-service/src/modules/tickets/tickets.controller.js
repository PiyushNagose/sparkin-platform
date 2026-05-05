import { ticketsService } from "./tickets.service.js";

export const ticketsController = {
  async create(req, res) {
    const ticket = await ticketsService.createTicket(req.auth, req.body);
    res.status(201).json({ ticket });
  },

  async list(req, res) {
    const result = await ticketsService.listTickets(req.auth, req.query);
    res.status(200).json(result);
  },

  async getById(req, res) {
    const ticket = await ticketsService.getTicket(
      req.auth,
      req.params.ticketId,
    );
    res.status(200).json({ ticket });
  },

  async update(req, res) {
    const ticket = await ticketsService.updateTicket(
      req.auth,
      req.params.ticketId,
      req.body,
    );
    res.status(200).json({ ticket });
  },

  async addMessage(req, res) {
    const ticket = await ticketsService.addMessage(
      req.auth,
      req.params.ticketId,
      req.body,
    );
    res.status(200).json({ ticket });
  },

  async remove(req, res) {
    await ticketsService.deleteTicket(req.auth, req.params.ticketId);
    res.status(204).end();
  },
};
