# Identity Service

Identity owns authentication and account identity for Sparkin.

## Scope

- signup
- login
- refresh token
- current user session
- profile read / update
- role-aware account identity

## Current Implementation

This service is scaffolded as a production-style Node.js API with:

- Express app shell
- env validation
- request id and error middleware
- modular `auth` and `users` boundaries
- JWT access and refresh token handling
- password hashing
- temporary in-memory repository for early frontend integration

The storage layer is intentionally isolated so we can replace it with a real database adapter later without changing the route contract.

## Run

```bash
cd services/identity-service
npm install
npm run dev
```

Default server:

- `http://localhost:4001`

## API Prefix

- `/api/v1`

## Main Routes

- `GET /health`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/logout`
- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me`
