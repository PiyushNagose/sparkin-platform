import { referralsService } from "./referrals.service.js";

export const referralsController = {
  async dashboard(req, res) {
    const dashboard = await referralsService.getReferralDashboard(req.auth);
    res.status(200).json(dashboard);
  },

  async create(req, res) {
    const result = await referralsService.createReferral(req.auth, req.body);
    res.status(201).json(result);
  },

  async listAll(req, res) {
    const referrals = await referralsService.listAllReferrals(req.auth);
    res.status(200).json({ referrals });
  },

  async updateRewardStatus(req, res) {
    const referral = await referralsService.updateRewardStatus(req.auth, req.params.referralId, req.body.rewardStatus);
    res.status(200).json({ referral });
  },
};
