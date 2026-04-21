# SPARKIN SOLAR PLATFORM — COMPLETE PROJECT CONTEXT

---

## 1. PROJECT OVERVIEW

Sparkin Solar is a **full-stack solar marketplace and workflow platform** that connects **customers** with **solar vendors** and manages the entire lifecycle:

**Lead → Quote → Selection → Project → Payment → Service → Referral**

The platform is composed of **three main interfaces**:

1. Public Website (Marketing + Lead Generation)
2. Customer Portal (User Dashboard)
3. Vendor Portal (Vendor Dashboard)

This is a **SaaS + Marketplace + Operations system**.

---

## 2. USER ROLES

### 1. CUSTOMER (USER)

* Wants solar installation
* Requests quotes
* Compares vendors
* Tracks project
* Uses services
* Monitors savings

### 2. VENDOR

* Solar installer/company
* Receives leads
* Submits proposals
* Executes projects
* Gets paid

### 3. ADMIN (implicit but required)

* Manages vendors
* Monitors system
* Controls flow

---

## 3. PLATFORM STRUCTURE

### A. PUBLIC WEBSITE

Purpose:

* Marketing
* Lead generation
* Trust building

Pages:

* Home
* About
* How It Works
* Calculator
* Vendors Listing
* Vendor Details
* Loan / Financing
* Contact
* FAQ
* Terms & Conditions
* Privacy Policy
* Login
* Signup

---

### B. CUSTOMER PORTAL

Main Sections:

* Dashboard
* My Bookings
* My Tenders
* My Projects
* Services
* Savings
* Refer & Earn
* Profile

---

### C. VENDOR PORTAL

Main Sections:

* Dashboard
* Leads
* Lead Details
* Submit Proposal
* Quotes
* Projects
* Project Details
* Payments
* Transactions
* Profile / Business
* Settings

---

## 4. CORE SYSTEM FLOW (MOST IMPORTANT)

This is the backbone of the entire platform:

Lead → Quote → Selection → Project → Payment → Service

---

### CUSTOMER FLOW

1. User signs up / logs in
2. User fills solar requirement form
3. Uploads documents/images
4. System generates estimate
5. Vendors receive lead
6. Vendors submit quotes
7. User compares quotes
8. User selects vendor
9. Project is created
10. User tracks installation
11. After completion:

* Uses services
* Tracks savings
* Refers others

---

### VENDOR FLOW

1. Vendor logs in
2. Views leads
3. Opens lead details
4. Submits proposal
5. Tracks quote status
6. Accepted quote → becomes project
7. Updates milestones
8. Completes project
9. Receives payment
10. Manages profile and documents

---

## 5. CORE MODULES

### 1. AUTH SYSTEM

* Login / Signup
* Role-based access:

  * USER
  * VENDOR
  * ADMIN

---

### 2. LEAD MANAGEMENT

* User creates lead
* Assigned to vendors
* Vendors view leads

---

### 3. QUOTE SYSTEM

* Vendor submits quote
* User compares quotes
* Accept / Reject

---

### 4. PROJECT SYSTEM

Milestones:

* Site Visit
* Installation
* Inspection
* Activation

---

### 5. PAYMENT SYSTEM

* Transactions
* Invoice data
* Vendor earnings
* Withdrawals

---

### 6. SERVICE SYSTEM

* Raise ticket
* Track status
* Vendor assigned

---

### 7. REFERRAL SYSTEM

* Referral code
* Reward tracking
* Earnings

---

### 8. ANALYTICS SYSTEM

* Savings calculation
* Charts
* Environmental impact

---

### 9. FILE UPLOAD SYSTEM

* Images (roof, documents)
* PDFs (quotes, invoices)

---

## 6. FRONTEND REQUIREMENTS

Stack:

* React (Vite)
* MUI
* Axios
* Chart.js

Must include:

* Role-based routing
* Layout system (Admin/Vendor/User)
* Reusable components
* Forms with validation
* Tables with filters
* Charts
* Responsive design

---

## 7. BACKEND REQUIREMENTS

Architecture:

* Microservices + API Gateway

Services:

* Auth Service (existing)
* User Service
* Vendor Service
* Lead Service
* Quote Service
* Project Service
* Payment Service
* Notification Service

---

## 8. DATABASE ENTITIES

Collections:

* Users
* Vendors
* Leads
* Quotes
* Projects
* Transactions
* Services
* Referrals

---

## 9. UI/UX RULES (CRITICAL)

Design must follow strict consistency:

### Layout

* Sidebar + Topbar fixed
* Card-based design
* Consistent spacing

### Components (core primitives)

1. Card
2. Table
3. Form
4. Stepper
5. Badge

---

### Colors

* Blue → Primary
* Green → Success / Money
* Yellow → Highlight
* Red → Error
* Grey → Neutral

---

### Spacing

* 8px grid system
* Card padding: 24–32px

---

### Typography

* Strong hierarchy
* Consistent across all screens

---

## 10. RESPONSIVENESS

Must support:

* Desktop (primary)
* Tablet
* Mobile

---

## 11. IMPORTANT DEVELOPMENT RULES

* DO NOT change existing business logic
* DO NOT break API structure
* Maintain consistent UI across all pages
* Reuse components wherever possible
* Follow existing project structure

---

## 12. CURRENT DEVELOPMENT CONTEXT

* Admin panel already exists
* Vendor panel being developed
* UI consistency is a priority
* Real backend APIs are used (no dummy data)
* Microservice architecture already implemented

---

## 13. HOW TO WORK ON THIS PROJECT (FOR CODEX)

Before coding:

* Read this entire file

When implementing:

* Work module by module
* Do not modify unrelated files
* Keep UI consistent with existing pages
* Follow same spacing, font, and structure

If backend change is required:

* First update service
* Then API gateway
* Then frontend API file
* Then UI component

---

## 14. PROJECT TYPE SUMMARY

This system is:

* Marketplace (Customer ↔ Vendor)
* Workflow Engine (Lead → Project lifecycle)
* Analytics Platform (Savings & performance)
* Financial System (Payments & transactions)
* CRM + ERP Hybrid

---

## 15. FINAL NOTE

This is NOT just a UI project.

This is a **state-driven system** where:

* Every entity has a status
* Every action changes state
* Every role has controlled access

If flow or state logic is incorrect, the system will break.

---

END OF DOCUMENT
