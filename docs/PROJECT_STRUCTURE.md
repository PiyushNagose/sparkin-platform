# Project Structure

This repository is intentionally prepared for the full Sparkin platform, even though implementation started with the frontend.

## Top-Level Folders

```text
docs/
infra/
packages/
services/
src/
```

## Intent

- `src/` holds the current frontend app.
- `services/` holds the grouped backend domain services and API gateway.
- `packages/` is for future shared code.
- `infra/` is for deployment, docker, gateway, and environment assets.
- `docs/` stores planning, architecture, flow notes, and product references.

## Current Backend Shape

The backend is being organized into a smaller number of scalable domain services:

```text
services/
  api-gateway/
  identity-service/       # auth + user
  business-service/       # lead + quote + vendor
  fulfillment-service/    # project + payment
  notification-service/   # email / sms / in-app
```

This keeps the system service-oriented without creating unnecessary operational complexity for every single entity.
