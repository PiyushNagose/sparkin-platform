# Sparkin Platform - Quick Start Guide

## 🚀 Running the Project Locally

### Prerequisites

- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas account
- Git

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd Sparkin-Platform

# Install root dependencies
npm install

# Install service dependencies
cd services/identity-service && npm install && cd ../..
cd services/business-service && npm install && cd ../..
cd services/fulfillment-service && npm install && cd ../..
```

### 2. Configure Environment Variables

#### identity-service/.env

```env
PORT=4001
NODE_ENV=development
SERVICE_NAME=identity-service
MONGODB_URI=mongodb://localhost:27017/sparkin-identity
JWT_ACCESS_SECRET=your-access-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

#### business-service/.env

```env
PORT=4002
NODE_ENV=development
SERVICE_NAME=business-service
MONGODB_URI=mongodb://localhost:27017/sparkin-business
JWT_ACCESS_SECRET=your-access-secret-here
CLIENT_URL=http://localhost:5173
FULFILLMENT_SERVICE_URL=http://localhost:4003/api/v1
```

#### fulfillment-service/.env

```env
PORT=4003
NODE_ENV=development
SERVICE_NAME=fulfillment-service
MONGODB_URI=mongodb://localhost:27017/sparkin-fulfillment
JWT_ACCESS_SECRET=your-access-secret-here
CLIENT_URL=http://localhost:5173
```

#### Root .env (Frontend)

```env
VITE_API_BASE_URL=http://localhost:4001/api/v1
VITE_BUSINESS_API_BASE_URL=http://localhost:4002/api/v1
VITE_FULFILLMENT_API_BASE_URL=http://localhost:4003/api/v1
```

### 3. Start Services

**Terminal 1 - Identity Service:**

```bash
cd services/identity-service
npm run dev
```

**Terminal 2 - Business Service:**

```bash
cd services/business-service
npm run dev
```

**Terminal 3 - Fulfillment Service:**

```bash
cd services/fulfillment-service
npm run dev
```

**Terminal 4 - Frontend:**

```bash
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Identity Service**: http://localhost:4001
- **Business Service**: http://localhost:4002
- **Fulfillment Service**: http://localhost:4003

---

## 🧪 Testing the End-to-End Flow

### Step 1: Create Admin User

```bash
cd services/identity-service
node scripts/seed-admin.js
```

This creates:

- Email: admin@sparkin.com
- Password: Admin@123
- Role: admin

### Step 2: Login as Admin

1. Go to http://localhost:5173/login
2. Enter admin credentials
3. You'll be redirected to admin dashboard

### Step 3: Create a Lead

1. Navigate to "Leads" in admin sidebar
2. Click "Create New Lead"
3. Fill in customer details:
   - Name: Test Customer
   - Phone: 9876543210
   - Email: customer@test.com
   - Address: 123 Test Street, Hyderabad, Telangana, 500001
   - System Size: 5 kW
4. Click "Create Lead"

### Step 4: Create Vendor (Optional)

1. Register as vendor at http://localhost:5173/signup
2. Select "Vendor" role
3. Fill company details
4. Login as admin and approve vendor from "Vendor Applications"

### Step 5: Assign Vendors to Lead

1. Open the lead you created
2. Click "Assign Vendor" button
3. Select vendors from the list
4. Click "Assign Vendors & Start Bidding"
5. Lead status changes to "Verified"

### Step 6: Submit Quote (as Vendor)

1. Login as vendor
2. Go to "Leads" in vendor dashboard
3. Open assigned lead
4. Click "Submit Proposal"
5. Fill quote details (system specs, pricing, timeline)
6. Submit quote

### Step 7: Accept Quote (as Admin)

1. Login as admin
2. Go to "Bidding Monitoring"
3. Find the lead with quotes
4. Click "Accept Quote" button
5. System automatically creates:
   - Project with milestones
   - Payment schedule (3 invoices)

### Step 8: Manage Project

1. Go to "Projects" in admin dashboard
2. Open the created project
3. Update milestone status
4. Upload documents
5. Track progress

### Step 9: Manage Payments

1. Go to "Payments" in admin dashboard
2. View payment schedule
3. Mark payments as "Paid"
4. Create manual invoices if needed

---

## 📁 Project Structure

```
Sparkin-Platform/
├── docs/                          # Documentation
├── infra/                         # Infrastructure (Docker, K8s)
├── packages/                      # Shared packages (future)
├── services/                      # Backend microservices
│   ├── identity-service/          # Auth & Users
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/          # Login, signup, refresh
│   │   │   │   └── users/         # User profile
│   │   │   ├── common/            # Middleware, errors, utils
│   │   │   ├── config/            # Env, database
│   │   │   ├── routes/            # API routes
│   │   │   ├── app.js             # Express app
│   │   │   └── server.js          # Server entry
│   │   └── package.json
│   │
│   ├── business-service/          # Core business logic
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── leads/         # Lead management
│   │   │   │   ├── quotes/        # Quote management
│   │   │   │   ├── vendors/       # Vendor management
│   │   │   │   ├── offers/        # Discount offers
│   │   │   │   ├── tickets/       # Support tickets
│   │   │   │   ├── broadcasts/    # Notifications
│   │   │   │   ├── calculator/    # Solar calculator
│   │   │   │   └── chat/          # Real-time chat
│   │   │   ├── common/
│   │   │   │   ├── http/          # HTTP clients
│   │   │   │   ├── middleware/    # Auth, validation
│   │   │   │   └── errors/        # Error handling
│   │   │   └── routes/
│   │   └── package.json
│   │
│   └── fulfillment-service/       # Post-sale operations
│       ├── src/
│       │   ├── modules/
│       │   │   ├── projects/      # Project management
│       │   │   ├── payments/      # Payment management
│       │   │   ├── service-requests/  # Service tickets
│       │   │   └── referrals/     # Referral program
│       │   └── routes/
│       └── package.json
│
├── src/                           # Frontend application
│   ├── app/                       # App shell
│   │   ├── layouts/               # Layout components
│   │   ├── providers/             # Context providers
│   │   ├── theme/                 # MUI theme
│   │   └── router.jsx             # Route configuration
│   │
│   ├── features/                  # Feature modules
│   │   ├── admin/                 # Admin portal
│   │   │   ├── api/               # API clients
│   │   │   ├── components/        # Shared components
│   │   │   └── pages/             # Page components
│   │   ├── auth/                  # Authentication
│   │   ├── customer/              # Customer portal
│   │   ├── vendor/                # Vendor portal
│   │   └── public/                # Public website
│   │
│   └── shared/                    # Shared resources
│       ├── assets/                # Images, icons
│       ├── components/            # Reusable components
│       ├── config/                # Configuration
│       ├── hooks/                 # Custom hooks
│       ├── lib/                   # Libraries
│       │   └── http/              # HTTP clients
│       ├── ui/                    # UI primitives
│       └── utils/                 # Utility functions
│
├── .env                           # Frontend environment
├── package.json                   # Root package
└── vite.config.js                 # Vite configuration
```

---

## 🔧 Common Development Tasks

### Add New API Endpoint

**Backend (business-service example):**

1. **Create Schema** (`src/modules/leads/leads.schemas.js`):

```javascript
export const myNewSchema = z.object({
  field: z.string().min(1),
});
```

2. **Add Route** (`src/modules/leads/leads.routes.js`):

```javascript
leadsRouter.post(
  "/my-endpoint",
  validate(myNewSchema),
  asyncHandler(leadsController.myHandler),
);
```

3. **Add Controller** (`src/modules/leads/leads.controller.js`):

```javascript
async myHandler(req, res) {
  const result = await leadsService.myService(req.auth, req.body);
  res.status(200).json({ result });
}
```

4. **Add Service** (`src/modules/leads/leads.service.js`):

```javascript
async myService(user, input) {
  // Business logic here
  return await leadsRepository.myQuery(input);
}
```

**Frontend:**

1. **Add API Client** (`src/features/public/api/leadsApi.js`):

```javascript
async myEndpoint(payload) {
  const { data } = await businessClient.post("/leads/my-endpoint", payload);
  return data.result;
}
```

2. **Use in Component**:

```javascript
const result = await leadsApi.myEndpoint({ field: "value" });
```

---

### Add New Database Model

**Example: Adding a new collection**

1. **Create Model** (`src/modules/mymodule/mymodel.model.js`):

```javascript
import mongoose from "mongoose";

const mySchema = new mongoose.Schema(
  {
    field: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
  },
);

export const MyModel = mongoose.model("MyModel", mySchema);
```

2. **Create Repository** (`src/modules/mymodule/mymodule.repository.js`):

```javascript
import { MyModel } from "./mymodel.model.js";

export const myRepository = {
  async create(data) {
    return MyModel.create(data);
  },

  async findAll() {
    return MyModel.find().lean();
  },

  async findById(id) {
    return MyModel.findById(id).lean();
  },
};
```

---

### Debug API Calls

**Backend:**

```javascript
// Add console.log in service
console.log("Request received:", { user, input });
```

**Frontend:**

```javascript
// Check network tab in browser DevTools
// Or add console.log
console.log("API response:", data);
```

**Check MongoDB:**

```bash
# Connect to MongoDB
mongosh

# Switch to database
use sparkin-business

# View collections
show collections

# Query data
db.leads.find().pretty()
```

---

## 🐛 Troubleshooting

### Service won't start

```bash
# Check if port is already in use
lsof -i :4001  # or 4002, 4003

# Kill process
kill -9 <PID>
```

### MongoDB connection error

```bash
# Check if MongoDB is running
mongosh

# If not, start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### Frontend can't connect to backend

1. Check `.env` file has correct URLs
2. Check CORS configuration in backend
3. Check if all services are running
4. Clear browser cache and reload

### JWT token errors

1. Make sure JWT_ACCESS_SECRET is same in all services
2. Check token expiry time
3. Clear localStorage and login again

---

## 📚 API Documentation

### Authentication Endpoints

**POST /api/v1/auth/register**

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "Password@123",
  "phoneNumber": "9876543210",
  "role": "customer"
}
```

**POST /api/v1/auth/login**

```json
{
  "email": "john@example.com",
  "password": "Password@123"
}
```

**Response:**

```json
{
  "user": {
    "id": "...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "customer"
  },
  "tokens": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

### Lead Endpoints

**GET /api/v1/leads**

- Returns all leads (filtered by role)

**POST /api/v1/leads**

```json
{
  "contact": {
    "fullName": "Customer Name",
    "phoneNumber": "9876543210",
    "email": "customer@example.com"
  },
  "installationAddress": {
    "street": "123 Main St",
    "city": "Hyderabad",
    "state": "Telangana",
    "pincode": "500001"
  },
  "property": {
    "type": "independent_house",
    "roofType": "flat",
    "ownership": "owned",
    "sanctionedLoadKw": 5
  },
  "roof": {
    "sizeRange": "500_1000",
    "shadow": "partial",
    "condition": "average"
  }
}
```

**PATCH /api/v1/leads/:leadId/vendors**

```json
{
  "vendorIds": ["vendor1", "vendor2", "vendor3"]
}
```

### Quote Endpoints

**POST /api/v1/quotes/leads/:leadId**

```json
{
  "system": {
    "panelType": "Monocrystalline",
    "inverterType": "String Inverter",
    "capacity": 5
  },
  "pricing": {
    "totalPrice": 325000,
    "breakdown": {
      "panels": 200000,
      "inverter": 75000,
      "installation": 50000
    }
  },
  "timeline": {
    "installationWindow": "2-3 weeks"
  }
}
```

**POST /api/v1/quotes/:quoteId/accept**

- No body required
- Creates project automatically

---

## 🎯 Next Steps

1. ✅ **Verify all flows work** - DONE
2. ⏳ **Implement API Gateway** - 2 weeks
3. ⏳ **Implement Notification Service** - 2 weeks
4. ⏳ **Set up Docker & K8s** - 2 weeks
5. ⏳ **Add monitoring & logging** - 1 week
6. ⏳ **Write tests** - 2 weeks
7. ⏳ **Deploy to production** - 1 week

---

## 📞 Support

For issues or questions:

1. Check this guide first
2. Check `END_TO_END_VERIFICATION.md`
3. Check `PRODUCTION_READINESS_REPORT.md`
4. Review code comments in relevant files

---

**Last Updated**: May 5, 2026  
**Status**: ✅ All core flows verified and working
