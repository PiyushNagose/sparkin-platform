# Sparkin Frontend Architecture

## Intent

This frontend is being built **screen-first** from approved reference designs, but the codebase is organized for long-term scale.

The UI has four primary zones:

1. Public website
2. Auth
3. Customer portal
4. Vendor portal

## Stack

- React + Vite
- JavaScript
- MUI
- Axios
- Chart.js
- React Router

## Folder Structure

```text
src/
  app/
    layouts/        # public, auth, and portal app shells
    providers/      # theme and future global providers
    theme/          # tokens and MUI theme setup
    constants/      # route maps and app-level constants
    App.jsx
    router.jsx
  features/
    auth/
      components/
      pages/
    public/
      components/
      data/
      pages/
    customer/
      components/
      data/
      pages/
    vendor/
      components/
      data/
      pages/
  shared/
    assets/         # shared images and static assets
    config/         # navigation, constants, role maps
    hooks/          # cross-feature hooks only
    lib/            # api client and adapters
    styles/         # global CSS only
    ui/             # reusable primitives and placeholders
    utils/          # formatting and generic helpers
```

## Module Boundaries

### `features/public`

Owns:

- Home
- About
- How It Works
- Calculator
- Vendor listing / partner pages
- Contact
- FAQ
- Terms
- Privacy
- Booking / quote request flow
- Public support screens

### `features/auth`

Owns:

- Login
- Signup
- Future password recovery

### `features/customer`

Owns:

- Dashboard
- Bookings
- Tenders
- Projects
- Services
- Savings
- Referrals
- Profile

### `features/vendor`

Owns:

- Onboarding
- Dashboard
- Leads
- Quotes
- Projects
- Payments / transactions / invoice views
- Profile / business details

## Why This Structure

- It follows the actual product roles and flows from the approved screens.
- It keeps routing and UI responsibilities clear.
- It avoids mixing customer and vendor logic in the same folders.
- It gives us a stable shared layer for reusable cards, forms, badges, tables, steppers, and timelines.

## Conventions

- New reusable UI primitives go in `src/shared/ui`.
- Route-specific layouts stay in `src/app/layouts`.
- Feature-specific components should stay inside their feature folder unless they are reused across zones.
- Keep marketing/public code separate from portal code.
- Prefer exact reconstruction of approved screens first, then abstract repeated patterns after two or more real usages.

## Next Build Order

Recommended implementation order:

1. Theme tokens and shared shell polish
2. Public navbar and footer
3. Home page
4. Calculator + booking flow
5. Vendor listing pages
6. Customer portal
7. Vendor portal
8. Legal and support pages
