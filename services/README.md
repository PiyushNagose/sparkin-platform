# Services

Backend services are now grouped by domain instead of creating one microservice per entity.

## Active Service Layout

- `api-gateway`
- `identity-service`
- `business-service`
- `fulfillment-service`
- `notification-service`

## Ownership

### `identity-service`

- authentication
- authorization
- sessions / tokens
- user profiles
- account preferences

### `business-service`

- vendor onboarding and business profile
- lead intake and assignment
- quote / bidding lifecycle
- marketplace business rules

### `fulfillment-service`

- accepted quotes to project conversion
- milestones and installation progress
- invoices, payouts, and transaction tracking

### `notification-service`

- email delivery
- SMS delivery
- in-app notifications
- templated status messaging

### `api-gateway`

- unified frontend entry point
- route aggregation
- auth enforcement at the edge
- service-to-service contract boundary for client apps
