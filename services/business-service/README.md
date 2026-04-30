# Business Service

Owns marketplace and commercial pre-fulfillment workflows.

## Current Implementation

- Express service shell
- MongoDB connection through Mongoose
- JWT auth verification using the same access secret as identity-service
- Leads API for customer booking requests
- Vendor/customer lead listing
- Lead detail API
- Quote submission and listing API

## Modules

- `vendors`
- `leads`
- `quotes`

## Responsibilities

- vendor onboarding and business identity
- lead creation and assignment
- quote submission and reverse-bidding lifecycle
- comparison-ready quote aggregation for customers

## Run

```bash
cd services/business-service
npm install
copy .env.example .env
npm run dev
```

Important: `JWT_ACCESS_SECRET` must match the identity service access secret, otherwise protected business APIs will reject logged-in users.

Default server:

- `http://localhost:4002`

## Main Routes

- `GET /health`
- `GET /api/v1/leads`
- `POST /api/v1/leads`
- `GET /api/v1/leads/:leadId`
- `GET /api/v1/quotes`
- `POST /api/v1/quotes/leads/:leadId`
