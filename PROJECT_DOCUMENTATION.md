# Sparkin Platform Project Documentation

## 1. Project Overview

Sparkin Platform is a solar marketplace and operations platform. It connects customers, vendors, and admins through a frontend application backed by grouped Node.js services.

The platform supports:

- Public solar discovery pages, calculator, booking, vendor discovery, support, referral, and quote comparison flows.
- Customer portal for bookings, tenders, projects, services, savings, referrals, profile, and chat.
- Vendor portal for onboarding, lead review, quote submission, projects, payments, profile, and chat.
- Admin portal for lead management, vendor applications, vendor assignment, payments, reports, offers, broadcasts, settings, referrals, support tickets, and operations.
- Backend services for identity, business workflows, fulfillment workflows, realtime chat, payments, and API gateway routing.

## 2. Tech Stack

### Frontend

- React 19
- Vite 6
- JavaScript ES modules
- React Router 7
- MUI 7
- Axios
- Socket.io client
- Chart.js, React Chart.js, and Recharts

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- Zod validation
- Socket.io
- Razorpay integration in fulfillment service

### Infrastructure

- Docker and Docker Compose
- Nginx for production frontend serving
- MongoDB 7 local container
- API Gateway on port `4000`
- Frontend dev server on port `5173`

## 3. Repository Structure

```text
Sparkin-Platform/
  docs/                         Existing planning and implementation docs
  infra/                        Infrastructure placeholders and deployment notes
  packages/                     Future shared packages
  services/                     Backend services and API gateway
    api-gateway/
    identity-service/
    business-service/
    fulfillment-service/
    notification-service/
  src/                          Frontend application
    app/
    features/
    shared/
  Dockerfile                    Production frontend Docker image
  docker-compose.yml            Local backend and MongoDB stack
  package.json                  Frontend scripts and dependencies
  vite.config.js                Vite setup and bundle chunking
```

## 4. High-Level Architecture

The frontend talks to the API Gateway by default:

```text
React Frontend
  |
  | HTTP: VITE_API_BASE_URL=http://localhost:4000/api/v1
  | Socket: VITE_SOCKET_URL or gateway origin
  v
API Gateway :4000
  |
  |-- identity-service :4001       Auth, users, sessions
  |-- business-service :4002       Leads, quotes, vendors, offers, tickets, chat
  |-- fulfillment-service :4003    Projects, payments, referrals, service requests
  |-- MongoDB :27017               Separate service databases
```

The gateway centralizes request routing, rate limiting, request IDs, auth checks, and upload proxying. Business and fulfillment services also verify JWTs for protected routes.

## 5. Frontend Architecture

Frontend code lives in `src/`.

```text
src/
  app/
    layouts/          Public, auth, and portal shells
    providers/        Theme, auth, socket, and app providers
    theme/            MUI theme and design tokens
    constants/        Route constants
    router.jsx        Main browser router
  features/
    public/           Website, calculator, booking, vendors, content pages
    auth/             Login, signup, session management
    customer/         Customer dashboard and workflows
    vendor/           Vendor portal workflows
    admin/            Admin operations portal
    chat/             Chat window and socket hook
  shared/
    assets/           Static images and placeholders
    components/       Cross-feature components
    config/           Navigation config
    hooks/            Shared hooks
    lib/              HTTP clients, cache, polling, subsidy logic
    styles/           Global CSS
    ui/               Reusable UI primitives
    websocket/        Global socket provider
```

### Frontend Boot Flow

1. `src/main.jsx` mounts the React application.
2. `src/app/App.jsx` renders the router inside app providers.
3. `src/app/router.jsx` defines public, auth, admin, customer, and vendor route trees.
4. `AuthProvider` restores an existing session from local storage.
5. If the access token is expired, the provider refreshes it using `/auth/refresh`.
6. Protected routes use `RequireAuth` and allowed role checks.
7. The global socket provider connects after authentication and listens for refresh events.

### Layouts

- `PublicLayout` wraps public website pages.
- `AuthLayout` wraps login and signup pages.
- `PortalLayout` wraps admin, customer, and vendor portal pages.

## 6. Frontend Routes

### Public Routes

- `/` home
- `/about`, `/about-us`
- `/how-it-works`
- `/why-choose-us`
- `/calculator`
- `/calculator/processing`
- `/calculator/results`
- `/calculator/unavailable`
- `/partners`
- `/vendors`
- `/vendors/partners`
- `/vendors/:vendorId`
- `/vendors/tata-power-solar`
- `/resources`
- `/loan-financing`
- `/contact`, `/contact-us`
- `/faq`, `/faqs`
- `/terms`
- `/privacy`
- `/refer-earn`
- `/ref/:referralCode`
- `/articles`
- `/blog`
- `/service-support`

### Protected Public/Customer Flow Routes

- `/booking`
- `/booking/property`
- `/booking/roof`
- `/booking/upload`
- `/booking/payment`
- `/booking/submitted`
- `/tenders/live`
- `/quotes/compare`
- `/quotes/:quoteId/details`
- `/quotes/:quoteId/confirm`
- `/quotes/:quoteId/payment`
- `/project/installation`
- `/service-support/request`
- `/service-support/request/submitted`
- `/service-support/track`

### Auth Routes

- `/auth/login`
- `/auth/signup`
- `/auth/admin-login`
- `/vendor/login`
- `/vendor/signup`
- `/admin/login`

### Customer Routes

- `/customer`
- `/customer/bookings`
- `/customer/bookings/:leadId`
- `/customer/tenders`
- `/customer/tenders/:leadId`
- `/customer/projects`
- `/customer/services`
- `/customer/savings`
- `/customer/referrals`
- `/customer/referrals/share`
- `/customer/referrals/earnings`
- `/customer/profile`
- `/customer/chat`

### Vendor Routes

- `/vendor`
- `/vendor/onboarding`
- `/vendor/pending-approval`
- `/vendor/leads`
- `/vendor/leads/:leadId`
- `/vendor/leads/:leadId/quote`
- `/vendor/quotes`
- `/vendor/quotes/new`
- `/vendor/projects`
- `/vendor/projects/:projectId`
- `/vendor/payments`
- `/vendor/payments/transactions`
- `/vendor/payments/transactions/:invoiceId`
- `/vendor/profile`
- `/vendor/settings`
- `/vendor/chat`
- `/vendor/help`

Vendor pages are protected by `RequireAuth` and `VendorApprovalGate`. Vendors can access onboarding and pending approval pages before full portal access.

### Admin Routes

- `/admin`
- `/admin/leads`
- `/admin/leads/:leadId`
- `/admin/payments`
- `/admin/payments/:paymentId`
- `/admin/vendor-assignment`
- `/admin/vendors`
- `/admin/vendors/:vendorId`
- `/admin/bidding`
- `/admin/customers-projects`
- `/admin/customers-projects/:projectId`
- `/admin/services`
- `/admin/reports`
- `/admin/settings`
- `/admin/notifications`
- `/admin/help-desk`
- `/admin/help-desk/:ticketId`
- `/admin/broadcast`
- `/admin/offers`
- `/admin/offers/create`
- `/admin/vendor-applications`
- `/admin/vendor-applications/:vendorId`
- `/admin/referral-management`

## 7. Backend Architecture

Backend services live in `services/`.

### API Gateway

Location: `services/api-gateway`

Responsibilities:

- Single frontend entry point.
- Proxies service APIs.
- Applies request IDs, logging, CORS, Helmet, auth middleware, and rate limiting.
- Protects authenticated routes before proxying.
- Proxies uploaded files from downstream services.
- Provides `/health`.

Default port: `4000`

### Identity Service

Location: `services/identity-service`

Responsibilities:

- User registration.
- Login and logout.
- Access and refresh token issuing.
- Current user lookup.
- Profile, avatar, and password updates.
- Admin seeding through `npm run seed:admin`.

Default port: `4001`

Mongo database in Docker: `sparkin_identity`

### Business Service

Location: `services/business-service`

Responsibilities:

- Leads.
- Quotes.
- Vendors and vendor applications.
- Offers.
- Tickets/help desk.
- Broadcasts.
- Calculator.
- Platform settings.
- Realtime chat.

Default port: `4002`

Mongo database in Docker: `sparkin_business`

### Fulfillment Service

Location: `services/fulfillment-service`

Responsibilities:

- Projects after quote acceptance.
- Project onboarding and milestones.
- Project documents.
- Payments and invoices.
- Razorpay order/verification/COD actions.
- Referrals and referral rewards.
- Service requests.

Default port: `4003`

Mongo database in Docker: `sparkin_fulfillment`

### Notification Service

Location: `services/notification-service`

The notification service folder exists for delivery channels such as email, SMS, and in-app notifications. The implemented notification-like features currently include admin broadcasts and socket-driven refresh/chat events in the business and gateway layers.

## 8. API Gateway Routing

Base gateway URL:

```text
http://localhost:4000
```

Frontend API base URL:

```text
http://localhost:4000/api/v1
```

Gateway routing:

- `/health` returns gateway status and downstream service URLs.
- `/uploads/vendor-documents/*` proxies business-service uploads.
- `/uploads/project-documents/*` proxies fulfillment-service uploads.
- `/uploads/*` proxies identity-service uploads.
- `/api/v1/auth/*` proxies identity-service auth routes.
- `/api/v1/users/*` proxies identity-service user routes.
- `/api/v1/vendors/public/*` proxies public vendor routes without auth.
- `/api/v1/calculator/*` proxies calculator routes without auth.
- `GET /api/v1/platform-settings` is public.
- `GET /api/v1/offers/public` is public.
- `/api/v1/leads/*` requires auth and proxies business-service.
- `/api/v1/quotes/*` requires auth and proxies business-service.
- `/api/v1/vendors/*` requires auth and proxies business-service.
- `/api/v1/offers/*` requires auth and proxies business-service.
- `/api/v1/tickets/*` requires auth and proxies business-service.
- `/api/v1/broadcasts/*` requires auth and proxies business-service.
- `/api/v1/chat/*` requires auth and proxies business-service.
- `/api/v1/projects/*` requires auth and proxies fulfillment-service.
- `/api/v1/payments/*` requires auth and proxies fulfillment-service.
- `/api/v1/service-requests/*` requires auth and proxies fulfillment-service.
- `/api/v1/referrals/*` requires auth and proxies fulfillment-service.

## 9. Main Backend APIs

All paths below are listed relative to `/api/v1` when used through the gateway.

### Auth and Users

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/me`
- `POST /auth/logout`
- `GET /users/me`
- `PATCH /users/me`
- `PATCH /users/me/avatar`
- `PATCH /users/me/password`

### Leads

- `GET /leads`
- `POST /leads`
- `POST /leads/analyze-roof`
- `GET /leads/:leadId`
- `PATCH /leads/:leadId/status`
- `PATCH /leads/:leadId/details`
- `PATCH /leads/:leadId/commitment-paid`
- `PATCH /leads/:leadId/vendors`

### Quotes

- `GET /quotes`
- `GET /quotes/:quoteId`
- `POST /quotes/leads/:leadId`
- `POST /quotes/:quoteId/accept`

### Vendors

- `GET /vendors/public/featured`
- `GET /vendors/public/:vendorId`
- `GET /vendors`
- `GET /vendors/me`
- `PATCH /vendors/me`
- `POST /vendors/me/documents`
- `DELETE /vendors/me/documents/:documentId`
- `POST /vendors/me/submit`
- `PATCH /vendors/:vendorId/status`
- `GET /vendors/:vendorId`

### Calculator and Settings

- `GET /calculator/serviceability`
- `POST /calculator/estimate`
- `GET /platform-settings`
- `PATCH /platform-settings`

### Offers

- `GET /offers/public`
- `GET /offers/stats`
- `GET /offers/generate-code`
- `GET /offers`
- `GET /offers/:offerId`
- `POST /offers`
- `PATCH /offers/:offerId`
- `PATCH /offers/:offerId/status`
- `DELETE /offers/:offerId`

### Broadcasts

- `GET /broadcasts`
- `GET /broadcasts/:broadcastId`
- `POST /broadcasts`
- `POST /broadcasts/draft`
- `PATCH /broadcasts/:broadcastId/cancel`
- `DELETE /broadcasts/:broadcastId`

### Tickets

- `GET /tickets`
- `GET /tickets/:ticketId`
- `POST /tickets`
- `PATCH /tickets/:ticketId`
- `POST /tickets/:ticketId/messages`
- `DELETE /tickets/:ticketId`

### Chat

- `GET /chat/rooms`
- `GET /chat/rooms/:roomId/messages`
- `POST /chat/rooms`
- `PATCH /chat/rooms/:roomId/read`
- `GET /chat/admin-contact`
- `POST /chat/register-admin`

### Projects

- `GET /projects`
- `POST /projects/manual`
- `POST /projects/from-accepted-quote`
- `GET /projects/:projectId`
- `PATCH /projects/:projectId/milestone`
- `POST /projects/:projectId/site-visit-reminders`
- `POST /projects/:projectId/reject-vendor`
- `PATCH /projects/:projectId/onboarding`
- `POST /projects/:projectId/documents`
- `POST /projects/:projectId/reassign-vendor`

### Payments and Razorpay

- `POST /payments`
- `GET /payments`
- `GET /payments/:paymentId`
- `PATCH /payments/:paymentId/status`
- `POST /payments/razorpay/order/:paymentId`
- `POST /payments/razorpay/verify`
- `POST /payments/razorpay/cod/:paymentId`

### Referrals

- `GET /referrals`
- `POST /referrals`
- `POST /referrals/track-signup`
- `POST /referrals/track-booking`
- `GET /referrals/admin/all`
- `GET /referrals/admin/settings`
- `PATCH /referrals/admin/settings`
- `PATCH /referrals/admin/:referralId/reward-status`

### Service Requests

- `GET /service-requests`
- `POST /service-requests`
- `GET /service-requests/:requestId`
- `PATCH /service-requests/:requestId/status`

## 10. Authentication and Authorization Flow

### Registration/Login

1. User registers or logs in from auth pages.
2. Frontend calls `/auth/register` or `/auth/login`.
3. Identity service validates the payload.
4. Identity service returns the user and token set.
5. Frontend stores the session through `authStorage`.
6. `AuthProvider` sets the active user.
7. User is redirected based on role:
   - `admin` -> `/admin`
   - `vendor` -> `/vendor`
   - all other users -> `/customer`

### Session Restore

1. On app load, `AuthProvider` checks local stored tokens.
2. If the access token exists and is valid, it calls `/auth/me`.
3. If the access token is expired, it calls `/auth/refresh`.
4. If refresh succeeds, the session is updated and the user remains logged in.
5. If refresh fails with `401` or `403`, local session data is cleared.

### HTTP Interceptors

All shared HTTP clients attach the JWT access token as:

```text
Authorization: Bearer <accessToken>
```

If an API request fails with `401`, the interceptor attempts one refresh request, stores the new tokens, and retries the original request.

### Route Guards

- Admin portal requires role `admin`.
- Customer portal requires role `customer` or `admin`.
- Vendor portal requires role `vendor` or `admin`.
- Vendor portal also passes through approval/profile gates for onboarding and application status.

## 11. End-to-End Product Flows

### Customer Solar Quote Flow

1. Customer visits the public website.
2. Customer uses `/calculator` to estimate solar requirements.
3. Customer logs in or signs up.
4. Customer starts booking through `/booking`.
5. Booking captures property, roof, upload, and payment information.
6. Frontend creates a lead through `/leads`.
7. Admin reviews or assigns vendors through admin lead/vendor assignment screens.
8. Vendors receive leads in the vendor portal.
9. Vendors submit quotes through `/quotes/leads/:leadId`.
10. Customer compares quotes through `/quotes/compare`.
11. Customer accepts a quote through `/quotes/:quoteId/accept`.
12. Fulfillment creates a project through `/projects/from-accepted-quote`.
13. Customer tracks project progress in `/customer/projects`.

### Vendor Onboarding Flow

1. Vendor signs up at `/vendor/signup`.
2. Vendor logs in and enters `/vendor/onboarding`.
3. Vendor completes profile/business details.
4. Vendor uploads documents through `/vendors/me/documents`.
5. Vendor submits application through `/vendors/me/submit`.
6. Admin reviews vendor applications.
7. Admin approves/rejects through `/vendors/:vendorId/status`.
8. Approved vendors can access dashboard, leads, quotes, projects, payments, and chat.

### Admin Operations Flow

1. Admin logs in at `/admin/login`.
2. Admin lands on dashboard.
3. Admin can review leads, assign vendors, approve vendor applications, manage payments, send broadcasts, handle support tickets, configure platform settings, and review reports.
4. Admin actions hit business-service or fulfillment-service through the API Gateway.

### Project Fulfillment Flow

1. A customer accepts a quote.
2. A fulfillment project is created.
3. Project milestones are tracked through `/projects/:projectId/milestone`.
4. Site visit reminders, onboarding, documents, vendor rejection, and vendor reassignment are handled through project endpoints.
5. Customers, vendors, and admins view role-relevant project status in their portals.

### Payment Flow

1. Fulfillment creates a payment invoice with `/payments`.
2. Customer or admin views payment details.
3. Razorpay order is created with `/payments/razorpay/order/:paymentId`.
4. Payment signature is verified with `/payments/razorpay/verify`.
5. COD booking advance can be confirmed with `/payments/razorpay/cod/:paymentId`.
6. Payment status can be updated through `/payments/:paymentId/status`.

### Service Support Flow

1. User opens `/service-support`.
2. Authenticated user creates a service request.
3. Request is stored through `/service-requests`.
4. Admin or support views and updates status.
5. User tracks service request through `/service-support/track`.

### Referral Flow

1. Customer opens referral pages.
2. Referral dashboard and codes are managed through `/referrals`.
3. Signup and booking tracking use `/referrals/track-signup` and `/referrals/track-booking`.
4. Admin manages referral settings and reward statuses.

### Chat Flow

1. Authenticated users connect to Socket.io with the JWT token.
2. REST endpoints create/list chat rooms and fetch message history.
3. Socket events handle room joining, new messages, room updates, and typing indicators.
4. Chat is centered in business-service and connects directly to `VITE_BUSINESS_SOCKET_URL` by default.

## 12. Realtime Behavior

The project uses Socket.io in two ways:

- Global refresh socket: invalidates cached frontend data when the backend emits `refresh:page`.
- Chat socket: handles room-level messaging, typing indicators, unread counts, and room updates.

Important socket events:

- `refresh:page`
- `join:room`
- `leave:room`
- `send:message`
- `new:message`
- `new:room`
- `room:updated`
- `typing:start`
- `typing:stop`

## 13. Environment Variables

Root `.env.example`:

```text
VITE_API_GATEWAY_URL=http://localhost:4000
VITE_API_BASE_URL=http://localhost:4000/api/v1
VITE_BUSINESS_API_BASE_URL=http://localhost:4000/api/v1
VITE_FULFILLMENT_API_BASE_URL=http://localhost:4000/api/v1
VITE_BUSINESS_SOCKET_URL=http://localhost:4002
```

Important backend environment values:

- `NODE_ENV`
- `PORT`
- `SERVICE_NAME`
- `CLIENT_URL`
- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_TTL`
- `JWT_REFRESH_TTL`
- `IDENTITY_SERVICE_URL`
- `BUSINESS_SERVICE_URL`
- `FULFILLMENT_SERVICE_URL`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

Important rule: `JWT_ACCESS_SECRET` must match across identity, gateway, business, and fulfillment services.

## 14. Local Development Setup

### Frontend Only

```bash
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

### Backend Stack with Docker

```bash
copy .env.example .env
docker compose up -d
docker compose exec identity-service npm run seed:admin
```

Backend URLs:

- API Gateway: `http://localhost:4000`
- Identity Service: `http://localhost:4001`
- Business Service: `http://localhost:4002`
- Fulfillment Service: `http://localhost:4003`
- MongoDB: `mongodb://localhost:27017`

### Useful Docker Commands

```bash
docker compose up -d
docker compose up -d mongo
docker compose logs -f
docker compose down
docker compose down -v
```

### Running Services Manually

API Gateway:

```bash
cd services/api-gateway
npm install
npm run dev
```

Identity Service:

```bash
cd services/identity-service
npm install
copy .env.example .env
npm run dev
```

Business Service:

```bash
cd services/business-service
npm install
copy .env.example .env
npm run dev
```

Fulfillment Service:

```bash
cd services/fulfillment-service
npm install
copy .env.example .env
npm run dev
```

## 15. Build and Deployment

### Frontend Build

```bash
npm run build
```

Build output:

```text
dist/
```

### Preview Production Build

```bash
npm run preview
```

### Frontend Docker Image

The root `Dockerfile` builds the Vite app and serves the `dist/` output through Nginx.

Production behavior:

- Static files served from `/usr/share/nginx/html`.
- React Router fallback configured with `try_files`.
- Static assets get long-lived immutable cache headers.
- Container listens on port `80`.

## 16. Data Ownership

### Identity Service Data

- Users.
- Refresh tokens.
- Authentication identity.
- Profile fields owned by user identity.

### Business Service Data

- Vendor profiles.
- Leads.
- Quotes.
- Offers.
- Tickets.
- Broadcasts.
- Chat rooms and messages.
- Platform settings.

### Fulfillment Service Data

- Projects.
- Payments.
- Referral records and settings.
- Service requests.
- Razorpay payment state.

## 17. Shared Frontend HTTP Layer

Frontend clients:

- `httpClient`: default API client.
- `businessClient`: business API client.
- `fulfillmentClient`: fulfillment API client.

All clients:

- Use the gateway by default.
- Attach JWT tokens.
- Retry eligible requests after token refresh.
- Use `requestCache` where repeated reads need short-lived caching.

## 18. Validation and Error Handling

Backend services use:

- Zod schemas for route input validation.
- Shared `validate` middleware.
- Shared `asyncHandler` middleware.
- Shared `AppError` classes.
- Shared error and not-found handlers.
- Request context/request ID middleware.

Frontend uses:

- Route-level error page.
- App crash boundary.
- Auth bootstrap fallback behavior.
- Toast notifications in user flows where implemented.

## 19. Security Notes

- JWT access tokens protect private APIs.
- Refresh tokens allow session continuation.
- Gateway applies auth middleware before proxying protected paths.
- Services also verify auth for protected modules.
- Helmet is used on backend services.
- CORS is configured using `CLIENT_URL`.
- Auth routes have stricter rate limiting at gateway level.
- Secrets in `.env.example` are development placeholders and must be replaced before production.

## 20. Current Documentation Files

Additional existing docs:

- `docs/PROJECT_STRUCTURE.md`
- `docs/PROJECT_CONTEXT.md`
- `docs/FRONTEND_ARCHITECTURE.md`
- `docs/IMPLEMENTATION_GUIDE.md`
- `docs/API_CONTRACT_NOTES.md`
- `docs/END_TO_END_VERIFICATION.md`
- `docs/PRODUCTION_READINESS_REPORT.md`
- `docs/QUICK_START_GUIDE.md`
- `docs/VENDOR_REASSIGNMENT_FLOW.md`
- `docs/VENDOR_REASSIGNMENT_API_EXAMPLES.md`
- `docs/VENDOR_REASSIGNMENT_SUMMARY.md`
- `docs/SCREEN_BUILD_ORDER.md`

This root document is intended as the primary end-to-end project reference. The `docs/` folder contains deeper notes for specific implementation areas.

## 21. Important Development Conventions

- Keep public, customer, vendor, admin, and auth feature code separated.
- Put reusable UI primitives in `src/shared/ui`.
- Put shared API adapters in `src/shared/lib`.
- Keep feature-specific components inside their feature folder unless reused.
- Use gateway URLs by default instead of direct service URLs.
- Keep protected routes aligned with backend role authorization.
- Keep service module boundaries clear: identity for accounts, business for marketplace workflows, fulfillment for execution and payments.
- Match `JWT_ACCESS_SECRET` across services during local development.

## 22. End-to-End Mental Model

Sparkin works as a role-based marketplace:

1. Public users discover solar services, calculate requirements, and enter booking/support flows.
2. Customers authenticate and create leads, bookings, service requests, referrals, and payments.
3. Admins review demand, manage vendors, assign leads, monitor projects, handle offers, tickets, broadcasts, reports, and settings.
4. Vendors onboard, get approved, receive leads, submit quotes, execute projects, and track payments.
5. Fulfillment turns accepted quotes into projects and payment records.
6. Realtime sockets keep chat and selected data refresh behavior responsive.

The API Gateway is the edge. Identity owns who the user is. Business owns marketplace activity before fulfillment. Fulfillment owns execution after selection. The React frontend presents those capabilities through public pages and role-specific portals.
