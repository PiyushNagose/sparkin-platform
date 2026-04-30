# Sparkin Platform

Scalable project workspace for the Sparkin Solar platform.

## Current Focus

- Frontend-first delivery
- Exact screen reconstruction from approved references
- JavaScript + React + Vite + MUI foundation
- Backend being reorganized into a grouped service architecture

## Project Map

```text
docs/              # product context, architecture, flows
infra/             # deployment and environment placeholders
packages/          # future shared packages
services/          # future backend microservices
src/               # current frontend application
```

## Backend Service Direction

The backend is now planned around a smaller set of robust domain services instead of one microservice per entity:

- `identity-service` - auth + user
- `business-service` - lead + quote + vendor
- `fulfillment-service` - project + payment
- `notification-service` - standalone delivery service
- `api-gateway` - unified edge routing

## Frontend Run Commands

```bash
npm install
npm run dev
```
