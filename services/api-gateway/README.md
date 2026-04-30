# API Gateway

Unified frontend entry point for Sparkin services.

## Responsibilities

- expose stable public API routes
- route requests to grouped backend services
- enforce auth middleware at the edge
- centralize cross-cutting concerns like rate limiting, request tracing, and API versioning

## Target downstream services

- `identity-service`
- `business-service`
- `fulfillment-service`
- `notification-service`
