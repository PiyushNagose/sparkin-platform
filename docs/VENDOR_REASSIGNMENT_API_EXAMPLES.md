# Vendor Reassignment API Examples

## Complete API Examples with cURL and JavaScript

---

## 1. Select All Vendor Assignment

### Description

Assign all verified vendors to a lead at once instead of selecting each individually.

### cURL

```bash
curl -X PATCH http://localhost:3001/leads/lead123/vendors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin_token" \
  -d '{
    "selectAll": true
  }'
```

### JavaScript (Fetch)

```javascript
const response = await fetch("http://localhost:3001/leads/lead123/vendors", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer admin_token",
  },
  body: JSON.stringify({
    selectAll: true,
  }),
});

const data = await response.json();
console.log("Assigned vendors:", data.lead.assignedVendorIds);
console.log("Bidding ends at:", data.lead.biddingEndsAt);
```

### JavaScript (Axios)

```javascript
import axios from "axios";

const response = await axios.patch(
  "http://localhost:3001/leads/lead123/vendors",
  { selectAll: true },
  {
    headers: {
      Authorization: "Bearer admin_token",
    },
  },
);

console.log("Assigned vendors:", response.data.lead.assignedVendorIds);
```

### Response (Success)

```json
{
  "lead": {
    "id": "lead123",
    "status": "vendors_assigned",
    "assignedVendorIds": [
      "vendor1",
      "vendor2",
      "vendor3",
      "vendor4",
      "vendor5"
    ],
    "biddingWindowHours": 48,
    "biddingEndsAt": "2026-05-28T17:41:00Z",
    "bidRange": {
      "minAmount": 150000,
      "maxAmount": 250000
    },
    "adminSystemSizeKw": 5,
    "estimatedCost": 200000
  }
}
```

### Response (Error - No Verified Vendors)

```json
{
  "error": "No verified vendors available to assign"
}
```

---

## 2. Manual Vendor Assignment (Existing - Still Works)

### Description

Assign specific vendors to a lead (backward compatible).

### cURL

```bash
curl -X PATCH http://localhost:3001/leads/lead123/vendors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin_token" \
  -d '{
    "vendorIds": ["vendor1", "vendor2", "vendor3"]
  }'
```

### JavaScript

```javascript
const response = await fetch("http://localhost:3001/leads/lead123/vendors", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer admin_token",
  },
  body: JSON.stringify({
    vendorIds: ["vendor1", "vendor2", "vendor3"],
  }),
});

const data = await response.json();
console.log("Assigned vendors:", data.lead.assignedVendorIds);
```

---

## 3. Send Site Visit Reminders

### Description

Send reminders to vendor to complete site visit. After 3 reminders, vendor is deallocated.

### First Reminder

#### cURL

```bash
curl -X POST http://localhost:3001/projects/project123/site-visit-reminders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin_token" \
  -d '{
    "message": "Please complete the site visit for this project"
  }'
```

#### JavaScript

```javascript
const response = await fetch(
  "http://localhost:3001/projects/project123/site-visit-reminders",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer admin_token",
    },
    body: JSON.stringify({
      message: "Please complete the site visit for this project",
    }),
  },
);

const data = await response.json();
console.log("Reminders sent:", data.project.siteVisitFollowUp.reminders.length);
console.log("Project status:", data.project.status);
```

#### Response (Reminder 1)

```json
{
  "project": {
    "id": "project123",
    "status": "site_audit_pending",
    "siteVisitFollowUp": {
      "reminders": [
        {
          "attempt": 1,
          "sentAt": "2026-05-26T10:00:00Z",
          "sentBy": "admin123",
          "message": "Please complete the site visit for this project"
        }
      ],
      "vendorRejectedAt": null,
      "rejectedBy": null,
      "rejectionReason": null,
      "reassignmentRequired": false
    }
  }
}
```

### Second Reminder

#### cURL

```bash
curl -X POST http://localhost:3001/projects/project123/site-visit-reminders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin_token" \
  -d '{
    "message": "Second reminder: Please complete the site visit"
  }'
```

#### Response (Reminder 2)

```json
{
  "project": {
    "id": "project123",
    "status": "site_audit_pending",
    "siteVisitFollowUp": {
      "reminders": [
        {
          "attempt": 1,
          "sentAt": "2026-05-26T10:00:00Z",
          "sentBy": "admin123",
          "message": "Please complete the site visit for this project"
        },
        {
          "attempt": 2,
          "sentAt": "2026-05-27T10:00:00Z",
          "sentBy": "admin123",
          "message": "Second reminder: Please complete the site visit"
        }
      ],
      "vendorRejectedAt": null,
      "rejectedBy": null,
      "rejectionReason": null,
      "reassignmentRequired": false
    }
  }
}
```

### Third Reminder (Auto-Deallocates Vendor)

#### cURL

```bash
curl -X POST http://localhost:3001/projects/project123/site-visit-reminders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin_token" \
  -d '{
    "message": "Final reminder: Vendor will be rejected if site visit is not completed"
  }'
```

#### Response (Reminder 3 - Vendor Deallocated)

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
          "message": "Please complete the site visit for this project"
        },
        {
          "attempt": 2,
          "sentAt": "2026-05-27T10:00:00Z",
          "sentBy": "admin123",
          "message": "Second reminder: Please complete the site visit"
        },
        {
          "attempt": 3,
          "sentAt": "2026-05-28T10:00:00Z",
          "sentBy": "admin123",
          "message": "Final reminder: Vendor will be rejected if site visit is not completed"
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

---

## 4. Reassign Project to New Vendor

### Description

After 3 reminders, reassign project to a new vendor. New project is created with same quotation.

### cURL

```bash
curl -X POST http://localhost:3001/projects/project123/reassign-vendor \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin_token" \
  -d '{
    "newVendorId": "vendor456",
    "reason": "Previous vendor failed to complete site visit after 3 reminders"
  }'
```

### JavaScript

```javascript
const response = await fetch(
  "http://localhost:3001/projects/project123/reassign-vendor",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer admin_token",
    },
    body: JSON.stringify({
      newVendorId: "vendor456",
      reason: "Previous vendor failed to complete site visit after 3 reminders",
    }),
  },
);

const data = await response.json();
console.log("New project ID:", data.project.id);
console.log("New vendor ID:", data.project.vendorId);
console.log("Reassignment reason:", data.project.reassignment.reason);
```

### Response (Success)

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
    "customer": {
      "fullName": "John Doe",
      "phoneNumber": "+91-9876543210",
      "email": "john@example.com"
    },
    "installationAddress": {
      "street": "123 Solar Street",
      "landmark": "Near Park",
      "city": "Bangalore",
      "state": "Karnataka",
      "pincode": "560001"
    },
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
    "timeline": {
      "installationWindow": "4_6_weeks",
      "siteAuditDueAt": null
    },
    "reassignment": {
      "reason": "Previous vendor failed to complete site visit after 3 reminders",
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
      },
      {
        "key": "installation",
        "title": "Installation",
        "status": "pending",
        "completedAt": null
      },
      {
        "key": "inspection",
        "title": "Inspection",
        "status": "pending",
        "completedAt": null
      },
      {
        "key": "activation",
        "title": "Activation",
        "status": "pending",
        "completedAt": null
      }
    ],
    "createdAt": "2026-05-28T11:00:00Z",
    "updatedAt": "2026-05-28T11:00:00Z"
  }
}
```

### Response (Error - Project Not Marked for Reassignment)

```json
{
  "error": "This project is not marked for reassignment"
}
```

### Response (Error - Project Already Reassigned)

```json
{
  "error": "This project has already been reassigned"
}
```

### Response (Error - Vendor Not Verified)

```json
{
  "error": "Selected vendor is not verified"
}
```

---

## 5. Direct Vendor Assignment from Lead

### Description

Alternative endpoint to directly assign a vendor to a lead with selected quote (no bidding).

### cURL

```bash
curl -X POST http://localhost:3001/leads/lead123/reassign-vendor \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin_token" \
  -d '{
    "newVendorId": "vendor456",
    "reason": "Admin decision to assign vendor directly"
  }'
```

### JavaScript

```javascript
const response = await fetch(
  "http://localhost:3001/leads/lead123/reassign-vendor",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer admin_token",
    },
    body: JSON.stringify({
      newVendorId: "vendor456",
      reason: "Admin decision to assign vendor directly",
    }),
  },
);

const data = await response.json();
console.log("Project created:", data.project.id);
console.log("Vendor assigned:", data.project.vendorId);
```

### Response (Success)

```json
{
  "project": {
    "id": "project456",
    "source": "direct_assignment",
    "vendorId": "vendor456",
    "status": "site_audit_pending",
    "reassignment": {
      "reason": "Admin decision to assign vendor directly",
      "reassignedAt": "2026-05-28T11:00:00Z",
      "reassignedBy": "admin123",
      "isDirectAssignment": true
    }
  }
}
```

---

## 6. Get Project Details

### Description

Retrieve project details including reassignment information.

### cURL

```bash
curl -X GET http://localhost:3001/projects/project123 \
  -H "Authorization: Bearer admin_token"
```

### JavaScript

```javascript
const response = await fetch("http://localhost:3001/projects/project123", {
  headers: {
    Authorization: "Bearer admin_token",
  },
});

const data = await response.json();
console.log("Project status:", data.project.status);
console.log("Reminders sent:", data.project.siteVisitFollowUp.reminders.length);
console.log("Reassignment info:", data.project.reassignment);
```

### Response

```json
{
  "project": {
    "id": "project123",
    "status": "site_audit_pending",
    "vendorId": "vendor123",
    "siteVisitFollowUp": {
      "reminders": [
        {
          "attempt": 1,
          "sentAt": "2026-05-26T10:00:00Z",
          "sentBy": "admin123",
          "message": "Reminder 1"
        }
      ],
      "vendorRejectedAt": null,
      "rejectedBy": null,
      "rejectionReason": null,
      "reassignmentRequired": false
    },
    "reassignment": {
      "reason": null,
      "reassignedAt": null,
      "reassignedBy": null,
      "previousVendorId": null,
      "isDirectAssignment": false
    }
  }
}
```

---

## 7. List All Projects

### Description

List all projects with pagination.

### cURL

```bash
curl -X GET "http://localhost:3001/projects?page=1&limit=10" \
  -H "Authorization: Bearer admin_token"
```

### JavaScript

```javascript
const response = await fetch("http://localhost:3001/projects?page=1&limit=10", {
  headers: {
    Authorization: "Bearer admin_token",
  },
});

const data = await response.json();
console.log("Total projects:", data.pagination.total);
console.log("Projects:", data.projects);
```

### Response

```json
{
  "projects": [
    {
      "id": "project123",
      "status": "site_audit_pending",
      "vendorId": "vendor123",
      "customerId": "customer123",
      "reassignment": {
        "reason": null,
        "reassignedAt": null,
        "reassignedBy": null,
        "previousVendorId": null,
        "isDirectAssignment": false
      }
    },
    {
      "id": "project456",
      "status": "site_audit_pending",
      "vendorId": "vendor456",
      "customerId": "customer123",
      "reassignment": {
        "reason": "Previous vendor failed to complete site visit",
        "reassignedAt": "2026-05-28T11:00:00Z",
        "reassignedBy": "admin123",
        "previousVendorId": "vendor123",
        "isDirectAssignment": true
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "pages": 1
  }
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "error": "Only approved partners can be assigned to leads"
}
```

### 403 Forbidden

```json
{
  "error": "Only admins can assign vendors to leads"
}
```

### 404 Not Found

```json
{
  "error": "Project not found"
}
```

### 409 Conflict

```json
{
  "error": "This project is not marked for reassignment"
}
```

---

## Complete Workflow Example

### Step 1: Create Lead

```bash
curl -X POST http://localhost:3001/leads \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer customer_token" \
  -d '{
    "contact": {
      "fullName": "John Doe",
      "phoneNumber": "+91-9876543210",
      "email": "john@example.com"
    },
    "installationAddress": {
      "street": "123 Solar Street",
      "landmark": "Near Park",
      "city": "Bangalore",
      "state": "Karnataka",
      "pincode": "560001"
    },
    "property": {
      "type": "independent_house",
      "roofType": "flat",
      "ownership": "owned"
    },
    "roof": {
      "sizeRange": "500_1000",
      "shadow": "partial",
      "condition": "average"
    }
  }'
```

### Step 2: Assign All Vendors

```bash
curl -X PATCH http://localhost:3001/leads/lead123/vendors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin_token" \
  -d '{"selectAll": true}'
```

### Step 3: Vendors Submit Quotes

```bash
# Vendor 1 submits quote
curl -X POST http://localhost:3001/quotes/leads/lead123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer vendor1_token" \
  -d '{
    "pricing": {"totalPrice": 200000},
    "system": {"sizeKw": 5, "panelType": "monocrystalline", "inverterType": "Hybrid 5kW"},
    "timeline": {"installationWindow": "4_6_weeks"}
  }'
```

### Step 4: Customer Selects Quote

```bash
curl -X POST http://localhost:3001/quotes/quote123/accept \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer customer_token" \
  -d '{}'
```

### Step 5: Send Reminders

```bash
# Reminder 1
curl -X POST http://localhost:3001/projects/project123/site-visit-reminders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin_token" \
  -d '{"message": "Reminder 1"}'

# Reminder 2
curl -X POST http://localhost:3001/projects/project123/site-visit-reminders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin_token" \
  -d '{"message": "Reminder 2"}'

# Reminder 3 (Auto-deallocates vendor)
curl -X POST http://localhost:3001/projects/project123/site-visit-reminders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin_token" \
  -d '{"message": "Final reminder"}'
```

### Step 6: Reassign to New Vendor

```bash
curl -X POST http://localhost:3001/projects/project123/reassign-vendor \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer admin_token" \
  -d '{
    "newVendorId": "vendor456",
    "reason": "Previous vendor failed to complete site visit"
  }'
```

---

## Testing with Postman

### Import Collection

```json
{
  "info": {
    "name": "Vendor Reassignment API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Select All Vendors",
      "request": {
        "method": "PATCH",
        "url": "{{base_url}}/leads/{{lead_id}}/vendors",
        "body": {
          "mode": "raw",
          "raw": "{\"selectAll\": true}"
        }
      }
    },
    {
      "name": "Send Reminder",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/projects/{{project_id}}/site-visit-reminders",
        "body": {
          "mode": "raw",
          "raw": "{\"message\": \"Reminder message\"}"
        }
      }
    },
    {
      "name": "Reassign Vendor",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/projects/{{project_id}}/reassign-vendor",
        "body": {
          "mode": "raw",
          "raw": "{\"newVendorId\": \"vendor456\", \"reason\": \"Vendor failed\"}"
        }
      }
    }
  ]
}
```

---

## Notes

- All endpoints require authentication token in `Authorization` header
- Admin token required for assignment and reassignment operations
- Timestamps are in ISO 8601 format (UTC)
- All monetary values are in INR (Indian Rupees)
- Phone numbers should include country code (+91 for India)
