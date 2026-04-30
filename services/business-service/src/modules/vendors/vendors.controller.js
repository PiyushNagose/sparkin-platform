import { vendorsService } from "./vendors.service.js";

export const vendorsController = {
  async getMe(req, res) {
    const vendorProfile = await vendorsService.getMyProfile(req.auth);
    res.status(200).json({ vendorProfile });
  },

  async updateMe(req, res) {
    const vendorProfile = await vendorsService.updateMyProfile(req.auth, req.body);
    res.status(200).json({ vendorProfile });
  },

  async uploadDocument(req, res) {
    const vendorProfile = await vendorsService.uploadDocument(req.auth, req.body);
    res.status(201).json({ vendorProfile });
  },

  async deleteDocument(req, res) {
    const vendorProfile = await vendorsService.deleteDocument(req.auth, req.params.documentId);
    res.status(200).json({ vendorProfile });
  },

  async submitApplication(req, res) {
    const vendorProfile = await vendorsService.submitApplication(req.auth);
    res.status(200).json({ vendorProfile });
  },
};
