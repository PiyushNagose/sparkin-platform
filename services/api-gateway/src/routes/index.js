import { Router } from "express";
import { env } from "../config/env.js";
import { requireAuth, optionalAuth } from "../middleware/auth.js";
import { authRateLimit, standardRateLimit } from "../middleware/rate-limit.js";
import { createProxy } from "../proxy/create-proxy.js";

const identityProxy = createProxy(env.IDENTITY_SERVICE_URL);
const businessProxy = createProxy(env.BUSINESS_SERVICE_URL);
const fulfillmentProxy = createProxy(env.FULFILLMENT_SERVICE_URL);

export function createRouter() {
  const router = Router();

  // ── Health ──────────────────────────────────────────────────────────────────
  router.get("/health", (req, res) => {
    res.json({
      service: "api-gateway",
      status: "ok",
      requestId: req.requestId,
      timestamp: new Date().toISOString(),
      downstream: {
        identity: env.IDENTITY_SERVICE_URL,
        business: env.BUSINESS_SERVICE_URL,
        fulfillment: env.FULFILLMENT_SERVICE_URL,
      },
    });
  });

  // ── Static file uploads ──────────────────────────────────────────────────────
  // Vendor documents are stored in business-service; project documents in fulfillment-service.
  // Both services serve their own /uploads/* routes. The gateway proxies them here
  // so the frontend only needs one base URL regardless of which service owns the file.
  //
  // URL pattern:
  //   /uploads/vendor-documents/*   → business-service
  //   /uploads/project-documents/*  → fulfillment-service
  //   /uploads/*                    → identity-service (avatars)
  router.use("/uploads/vendor-documents", standardRateLimit, businessProxy);
  router.use("/uploads/project-documents", standardRateLimit, fulfillmentProxy);
  router.use("/uploads", standardRateLimit, identityProxy);

  // ── Identity Service ─────────────────────────────────────────────────────────
  // Public auth routes (login, register, refresh) — rate limited
  router.use("/api/v1/auth", authRateLimit, identityProxy);

  // Protected user profile routes
  router.use("/api/v1/users", standardRateLimit, requireAuth, identityProxy);

  // ── Business Service ─────────────────────────────────────────────────────────
  // Public vendor listing (no auth required)
  router.use("/api/v1/vendors/public", standardRateLimit, businessProxy);

  // Public calculator (no auth required)
  router.use("/api/v1/calculator", standardRateLimit, businessProxy);

  // Public platform settings read (no auth required)
  router.get("/api/v1/platform-settings", standardRateLimit, businessProxy);

  // Public offers shown on the home page (no auth required)
  router.get("/api/v1/offers/public", standardRateLimit, businessProxy);

  // All other business routes require auth
  router.use("/api/v1/leads", standardRateLimit, requireAuth, businessProxy);

  router.use("/api/v1/quotes", standardRateLimit, requireAuth, businessProxy);

  router.use("/api/v1/vendors", standardRateLimit, requireAuth, businessProxy);

  router.use("/api/v1/offers", standardRateLimit, requireAuth, businessProxy);

  router.use("/api/v1/tickets", standardRateLimit, requireAuth, businessProxy);

  router.use(
    "/api/v1/broadcasts",
    standardRateLimit,
    requireAuth,
    businessProxy,
  );

  router.use("/api/v1/chat", standardRateLimit, requireAuth, businessProxy);

  router.use(
    "/api/v1/platform-settings",
    standardRateLimit,
    requireAuth,
    businessProxy,
  );

  // ── Fulfillment Service ──────────────────────────────────────────────────────
  router.use(
    "/api/v1/projects",
    standardRateLimit,
    requireAuth,
    fulfillmentProxy,
  );

  router.use(
    "/api/v1/payments",
    standardRateLimit,
    requireAuth,
    fulfillmentProxy,
  );

  router.use(
    "/api/v1/service-requests",
    standardRateLimit,
    requireAuth,
    fulfillmentProxy,
  );

  router.use(
    "/api/v1/referrals",
    standardRateLimit,
    requireAuth,
    fulfillmentProxy,
  );

  // ── 404 catch-all ────────────────────────────────────────────────────────────
  router.use((req, res) => {
    res.status(404).json({
      message: `Route ${req.method} ${req.originalUrl} not found on this gateway.`,
    });
  });

  return router;
}
