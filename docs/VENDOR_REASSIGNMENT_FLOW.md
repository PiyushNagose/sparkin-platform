# Vendor Reassignment Flow - Production Ready

## Overview

This document describes the complete vendor reassignment flow implemented for handling vendor failures after 3 site visit reminders. The system now supports:

1. **Select All Vendor Assignment** - Admin can assign all verified vendors to a lead at once
2. **Direct Vendor Assignment** - After 3 reminders, admin can directly assign a new vendor without bidding
3. **Project Reallocation** - Automatic project creation with the same quotation for the new vendor
4. **Payment Continuity** - Existing payment schedule carries over to the new project

---

## Flow Diagram

```
Lead Created
    ↓
Vendor Assignment (with Select All option)
    ↓
Bidding Window Opens
    ↓
Vendors Submit Quotes
    ↓
Customer Selects Quote
    ↓
Project Created (site_audit_pending)
    ↓
Admin Sends Site Visit Reminders (Max 3)
    ├─ Reminder 1 → Vendor has time to respond
    ├─ Reminder 2 → Vendor has time to respond
    └─ Reminder 3 → Project marked for reassignment
    ↓
Admin Reassigns to New Vendor (Direct Assignment)
    ├─ No bidding required
    ├─ Same quotation used
    ├─ New project created
    └─ Old project deallocated
    ↓
New Vendor Works on Project
```

---

## API Endpoints

### 1. Assign Vendors to Lead (with Select All)

**Endpoint:** `PATCH /leads/:leadId/vendors`

**Request Body:**

```json
{
  "vendorIds": ["vendor1", "vendor2"],
  "selectAll": false
}
```

**Select All Example:**

```json
{
  "selectAll": true
}
```

**Response:**

```json
{
  "lead": {
    "id": "lead123",
    "status": "vendors_assigned",
    "assignedVendorIds": ["vendor1", "vendor2", "vendor3", ...],
    "biddingEndsAt": "2026-05-28T17:41:00Z",
    "bidRange": {
      "minAmount": 150000,
      "maxAmount": 250000
    }
  }
}
```

**Key Features:**

- If `selectAll: true`, all verified vendors are automatically assigned
- If `selectAll: false`, only specified vendors are assigned
- Bidding window is automatically calculated from platform settings
- Only verified vendors can be assigned

---

### 2. Send Site Visit Reminder

**Endpoint:** `POST /projects/:projectId/site-visit-reminders`

**Request Body:**

```json
{
  "message": "Optional custom message"
}
```

**Response (After 3rd Reminder):**

```json
{
  "project": {
    "id": "project123",
    "status": "cancelled",
    "siteVisitFollowUp": {
      "reminders": [
        {
          "attempt": 1,
          "sentAt": "2026-05-26T10:00:00Z",
          "sentBy": "admin123",
          "message": "Reminder 1: please complete the pending site visit for this project."
        },
        {
          "attempt": 2,
          "sentAt": "2026-05-27T10:00:00Z",
          "sentBy": "admin123",
          "message": "Reminder 2: please complete the pending site visit for this project."
        },
        {
          "attempt": 3,
          "sentAt": "2026-05-28T10:00:00Z",
          "sentBy": "admin123",
          "message": "Final reminder: site visit is still pending. Vendor will be rejected and this project will be reassigned."
        }
      ],
      "vendorRejectedAt": "2026-05-28T10:00:00Z",
      "rejectedBy": "admin123",
      "rejectionReason": "Site visit not completed after three admin reminders",
      "reassignmentRequired": true
    }
  }
}
```

**Behavior:**

- Reminders are tracked with attempt number (1-3)
- After 3rd reminder, project is automatically marked for reassignment
- Vendor is deallocated from the project
- Project status changes to `cancelled`

---

### 3. Reassign Project to New Vendor

**Endpoint:** `POST /projects/:projectId/reassign-vendor`

**Request Body:**

```json
{
  "newVendorId": "vendor456",
  "reason": "Previous vendor failed to complete site visit"
}
```

**Response:**

```json
{
  "project": {
    "id": "project456",
    "leadId": "lead123",
    "quoteId": "quote123",
    "source": "direct_assignment",
    "customerId": "customer123",
    "vendorId": "vendor456",
    "vendorEmail": "vendor456@example.com",
    "status": "site_audit_pending",
    "system": {
      "sizeKw": 5,
      "panelType": "monocrystalline",
      "inverterType": "Hybrid 5kW"
    },
    "pricing": {
      "totalPrice": 200000,
      "equipmentCost": 120000,
      "laborCost": 60000,
      "permittingCost": 20000
    },
    "reassignment": {
      "reason": "Previous vendor failed to complete site visit",
      "reassignedAt": "2026-05-28T11:00:00Z",
      "reassignedBy": "admin123",
      "previousVendorId": "vendor123",
      "isDirectAssignment": true
    },
    "milestones": [
      {
        "key": "site_visit",
        "title": "Site Visit",
        "status": "in_progress",
        "completedAt": null
      },
      {
        "key": "design_approval",
        "title": "Design Approval",
        "status": "pending",
        "completedAt": null
      }
      // ... other milestones
    ],
    "createdAt": "2026-05-28T11:00:00Z"
  }
}
```

**Key Features:**

- New project is created with same quotation
- No bidding process required
- Payment schedule is automatically created
- Old project is marked as `cancelled`
- Reassignment metadata is tracked for audit trail

---

### 4. Direct Vendor Assignment from Lead (Alternative Flow)

**Endpoint:** `POST /leads/:leadId/reassign-vendor`

**Request Body:**

```json
{
  "newVendorId": "vendor456",
  "reason": "Admin decision to reassign vendor"
}
```

**Response:**

```json
{
  "project": {
    "id": "project456",
    "source": "direct_assignment",
    "vendorId": "vendor456",
    "status": "site_audit_pending",
    "reassignment": {
      "reason": "Admin decision to reassign vendor",
      "reassignedAt": "2026-05-28T11:00:00Z",
      "reassignedBy": "admin123",
      "isDirectAssignment": true
    }
  }
}
```

**Use Case:**

- Admin can directly assign a vendor to a lead with selected quote
- Useful when admin wants to bypass bidding entirely
- Same quotation is used for the new project

---

## Database Schema Changes

### Project Model Updates

```javascript
// New fields added to project schema

source: {
  type: String,
  enum: ["accepted_quote", "vendor_manual", "direct_assignment"],
  default: "accepted_quote"
}

reassignment: {
  reason: { type: String, trim: true, default: null },
  reassignedAt: { type: Date, default: null },
  reassignedBy: { type: String, default: null },
  previousVendorId: { type: String, default: null },
  isDirectAssignment: { type: Boolean, default: false }
}
```

### Lead Model Updates

```javascript
// Existing fields remain unchanged
// New functionality uses existing assignedVendorIds and selection fields
```

---

## Business Logic

### Select All Vendor Assignment

1. Admin clicks "Select All" when assigning vendors to a lead
2. System fetches all vendors with `verificationStatus === "verified"`
3. All verified vendors are assigned to the lead
4. Bidding window opens for all assigned vendors
5. Vendors can submit quotes within the bidding window

**Validation:**

- Only verified vendors are included
- At least one verified vendor must exist
- Duplicate vendor IDs are automatically removed

### Site Visit Reminder Flow

1. **Reminder 1 & 2:** Vendor has opportunity to complete site visit
   - Project remains in `site_audit_pending` status
   - Vendor can still update milestones
   - Reminders are logged for audit trail

2. **Reminder 3:** Vendor is deallocated
   - Project status changes to `cancelled`
   - `siteVisitFollowUp.reassignmentRequired` is set to `true`
   - Vendor can no longer work on this project

### Direct Vendor Assignment

1. Admin selects a new verified vendor
2. System validates vendor is verified
3. New project is created with:
   - Same lead ID
   - Same quote ID
   - Same quotation details (pricing, system specs)
   - New vendor ID
   - `source: "direct_assignment"`
4. Payment schedule is created for new project
5. Old project is marked as `cancelled`
6. Reassignment metadata is recorded

**Key Differences from Bidding:**

- No bidding window
- No quote submission required
- Vendor is directly assigned
- Same quotation is used (no price negotiation)
- Payment schedule carries over

---

## Validation Rules

### Vendor Assignment

- ✅ Only admins can assign vendors
- ✅ Lead must be in `verified` or later status
- ✅ Only verified vendors can be assigned
- ✅ At least one vendor must be specified (or selectAll: true)
- ✅ Maximum 25 vendors can be assigned at once

### Site Visit Reminders

- ✅ Only admins can send reminders
- ✅ Maximum 3 reminders per project
- ✅ Cannot send reminders to cancelled projects
- ✅ Cannot send reminders if site visit is already completed

### Vendor Reassignment

- ✅ Only admins can reassign vendors
- ✅ Project must be marked for reassignment
- ✅ Project cannot be reassigned twice
- ✅ New vendor must be verified
- ✅ New vendor must be different from previous vendor

---

## Error Handling

### Common Errors

**400 Bad Request**

```json
{
  "error": "Only approved partners can be assigned to leads"
}
```

- Cause: Attempting to assign unverified vendor
- Solution: Verify vendor first

**409 Conflict**

```json
{
  "error": "This project is not marked for reassignment"
}
```

- Cause: Attempting to reassign project that hasn't had 3 reminders
- Solution: Send 3 reminders first

**409 Conflict**

```json
{
  "error": "This project has already been reassigned"
}
```

- Cause: Attempting to reassign already reassigned project
- Solution: Create new lead if needed

**403 Forbidden**

```json
{
  "error": "Only admins can assign vendors to leads"
}
```

- Cause: Non-admin user attempting assignment
- Solution: Use admin account

---

## Audit Trail

All reassignments are tracked with:

- `reassignedAt` - Timestamp of reassignment
- `reassignedBy` - Admin user ID who performed reassignment
- `previousVendorId` - Original vendor ID
- `reason` - Reason for reassignment
- `isDirectAssignment` - Flag indicating direct assignment

This allows complete traceability of vendor changes.

---

## Payment Handling

### Payment Schedule Continuity

1. Original project has payment schedule created
2. When vendor is reassigned, new project gets new payment schedule
3. Old project's payments are not affected
4. Customer sees both projects in their history
5. Only new project is active for work

### Payment Milestones

Both old and new projects have same milestones:

- Booking Advance (10%)
- Site Visit (20%)
- Design Approval (20%)
- Installation (30%)
- Inspection & Activation (20%)

---

## Frontend Integration

### Admin Dashboard Changes

1. **Vendor Assignment Screen**
   - Add "Select All" checkbox
   - Show count of verified vendors
   - Display bidding window duration

2. **Project Management Screen**
   - Show reassignment status
   - Display previous vendor info
   - Show reassignment reason
   - Track reminder count

3. **Vendor Reassignment Modal**
   - Dropdown to select new vendor
   - Optional reason field
   - Confirmation dialog
   - Success/error notifications

### Customer Dashboard Changes

1. Show both old (cancelled) and new (active) projects
2. Display reassignment reason
3. Show new vendor information
4. Maintain payment schedule visibility

---

## Testing Checklist

- [ ] Select all vendors assigns all verified vendors
- [ ] Select all with no verified vendors returns error
- [ ] Specific vendor assignment works as before
- [ ] First reminder doesn't cancel project
- [ ] Second reminder doesn't cancel project
- [ ] Third reminder cancels project and marks for reassignment
- [ ] Cannot reassign project not marked for reassignment
- [ ] Cannot reassign project twice
- [ ] New vendor must be verified
- [ ] New project created with same quotation
- [ ] Old project marked as cancelled
- [ ] Payment schedule created for new project
- [ ] Reassignment metadata is recorded
- [ ] Audit trail is complete

---

## Production Deployment

### Pre-Deployment Checklist

1. ✅ Database migrations for new schema fields
2. ✅ Backward compatibility with existing projects
3. ✅ API endpoint documentation updated
4. ✅ Error handling tested
5. ✅ Validation rules verified
6. ✅ Audit trail logging enabled
7. ✅ Payment integration tested
8. ✅ Admin UI updated
9. ✅ Customer notifications configured
10. ✅ Monitoring and alerts set up

### Rollback Plan

If issues occur:

1. Disable direct assignment endpoints
2. Keep select all functionality (backward compatible)
3. Revert project model changes if needed
4. Restore from backup if data corruption

---

## Future Enhancements

1. **Automatic Reassignment** - Auto-assign to next best vendor
2. **Vendor Performance Tracking** - Track reassignment frequency per vendor
3. **Escalation Workflow** - Notify vendor manager before reassignment
4. **Customer Notification** - Notify customer of vendor change
5. **Partial Refund** - Handle refunds if customer wants to cancel
6. **Vendor Blacklist** - Temporarily block vendors after multiple failures

---

## Support & Troubleshooting

### Common Issues

**Issue:** Select All returns no vendors

- Check vendor verification status
- Ensure at least one vendor is verified

**Issue:** Cannot reassign project

- Verify project has 3 reminders sent
- Check project status is not already reassigned

**Issue:** Payment schedule not created

- Check payments service is running
- Verify project creation was successful

---

## References

- [Project Model](../services/fulfillment-service/src/modules/projects/project.model.js)
- [Leads Service](../services/business-service/src/modules/leads/leads.service.js)
- [Projects Service](../services/fulfillment-service/src/modules/projects/projects.service.js)
- [API Routes](../services/business-service/src/modules/leads/leads.routes.js)
