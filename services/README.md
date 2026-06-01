# Services

Backend services are now grouped by domain instead of creating one microservice per entity.

## Active Service Layout

- `api-gateway`
- `identity-service`
- `business-service`
- `fulfillment-service`
- `notification-service`

## Local Dev

Run all four active backend services together from the `services` folder:

```bash
npm run dev
```

The runner frees any existing listeners on ports `4000`, `4001`, `4002`, and
`4003` before starting. When you stop the runner with `Ctrl+C`, it shuts down
the child backend processes it started so those ports are released cleanly.
The orchestrator runs each service with its stable `start` script so one command
works reliably on Windows.

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
