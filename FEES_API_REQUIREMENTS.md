# Fees API Requirements for Backend Team

## Overview
The Student Portal frontend needs fees/payment management endpoints to complete the Fees feature integration. Currently, the FeesView falls back to mock data since these endpoints don't exist yet.

## Status
- ✅ **Frontend Ready**: Service layer implemented (`src/services/feeService.js`)
- ✅ **UI Complete**: FeesView with payment upload functionality
- ⏳ **Backend Needed**: API endpoints must be created

---

## Required Endpoints

### 1. Get Student Fees
**Endpoint:** `GET /api/v1/fees/`

**Description:** List all fees for the currently authenticated student

**Authentication:** Required (JWT Bearer token)

**Response:**
```json
[
  {
    "id": 1,
    "description": "Department Shirt",
    "category": "Uniform",
    "amount": 450.00,
    "semester": "1st Semester 2024",
    "due_date": "2024-01-30",
    "status": "unpaid",
    "is_overdue": false,
    "created_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": 2,
    "description": "IT Club Membership",
    "category": "Organization",
    "amount": 300.00,
    "semester": "1st Semester 2024",
    "due_date": "2024-02-15",
    "status": "paid",
    "is_overdue": false,
    "payment_date": "2024-02-10T00:00:00Z",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

**Status Values:**
- `unpaid` - Not yet paid
- `pending` - Payment submitted, awaiting verification
- `paid` - Payment verified and approved
- `rejected` - Payment rejected (requires resubmission)

**Category Examples:**
- `Uniform` - Department shirts, IDs, etc.
- `Organization` - Club memberships
- `Events` - Summit registrations, workshops
- `Department` - Activity fees
- `Miscellaneous` - Other fees

---

### 2. Get Fees Summary
**Endpoint:** `GET /api/v1/fees/summary/`

**Description:** Get aggregated fees statistics for the current student

**Authentication:** Required (JWT Bearer token)

**Response:**
```json
{
  "total": 1950.00,
  "paid": 650.00,
  "outstanding": 550.00,
  "pending": 750.00
}
```

**Fields:**
- `total` - Total amount of all fees
- `paid` - Total amount of paid fees
- `outstanding` - Total amount of unpaid fees
- `pending` - Total amount of fees with pending payments

---

### 3. Submit Payment Proof
**Endpoint:** `POST /api/v1/fees/{id}/payment/`

**Description:** Submit payment receipt/proof for a specific fee

**Authentication:** Required (JWT Bearer token)

**Request:** `multipart/form-data`

**Form Fields:**
- `receipt` (file, required) - Image file (PNG, JPG, max 10MB)
- `notes` (string, optional) - Additional notes or reference number

**Example using FormData:**
```javascript
const formData = new FormData()
formData.append('receipt', fileBlob)
formData.append('notes', 'GCash payment - Ref: 123456789')
```

**Success Response (201 Created):**
```json
{
  "id": 123,
  "fee": 1,
  "receipt_url": "https://api.example.com/media/receipts/123.jpg",
  "notes": "GCash payment - Ref: 123456789",
  "submitted_at": "2024-02-15T10:30:00Z",
  "status": "pending",
  "reviewed_by": null,
  "reviewed_at": null
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Fee already paid",
  "details": "This fee has already been paid and verified"
}
```

---

### 4. Get Payment Receipt Details
**Endpoint:** `GET /api/v1/fees/{id}/receipt/`

**Description:** Get payment receipt/proof details for a specific fee

**Authentication:** Required (JWT Bearer token)

**Response:**
```json
{
  "id": 123,
  "fee": {
    "id": 1,
    "description": "Department Shirt",
    "amount": 450.00
  },
  "receipt_url": "https://api.example.com/media/receipts/123.jpg",
  "notes": "GCash payment - Ref: 123456789",
  "submitted_at": "2024-02-15T10:30:00Z",
  "status": "paid",
  "reviewed_by": "Admin User",
  "reviewed_at": "2024-02-16T08:00:00Z",
  "review_notes": "Payment verified"
}
```

---

## Database Schema Suggestions

### Fees Table
```sql
CREATE TABLE fees (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    description VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    semester VARCHAR(50),
    due_date DATE,
    status VARCHAR(20) DEFAULT 'unpaid',
    is_overdue BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Payments Table
```sql
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    fee_id INTEGER REFERENCES fees(id),
    receipt_image VARCHAR(500),
    notes TEXT,
    submitted_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'pending',
    reviewed_by INTEGER REFERENCES users(id),
    reviewed_at TIMESTAMP,
    review_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Business Logic Requirements

### 1. Payment Submission
- Student can only submit payment for unpaid fees
- Submitting payment changes fee status to `pending`
- Allow multiple payment submissions if previous was rejected
- Store receipt image securely (AWS S3, Cloudinary, etc.)
- Validate image format and size (max 10MB)

### 2. Payment Review (Admin)
- Admin can approve/reject payment submissions
- Approval changes fee status to `paid`
- Rejection changes status back to `unpaid` with reason
- Track who reviewed and when

### 3. Overdue Detection
- Automatically mark fees as overdue if `due_date` has passed
- Run periodic task (cron job) to update overdue status
- Send notifications for upcoming due dates (optional)

### 4. Access Control
- Students can only view/pay their own fees
- Admins can view all fees and manage payments
- Collection management team can review payments

---

## Frontend Integration Status

✅ **Already Implemented in Frontend:**
- Service layer with all API calls (`src/services/feeService.js`)
- Automatic fallback to mock data if endpoints don't exist
- Loading states and error handling
- Payment upload form with drag-and-drop
- File preview before submission
- Status badges and filtering

⏳ **Waiting for Backend:**
- Create the 4 endpoints listed above
- Update `.env` to set `VITE_USE_MOCK_API=false` (already set to true for graceful degradation)

---

## Testing

Once endpoints are ready, test with these scenarios:

1. **List Fees**: Login as student, navigate to Fees page
2. **View Summary**: Verify totals calculate correctly
3. **Submit Payment**: 
   - Select unpaid fee
   - Upload receipt image
   - Add notes
   - Submit
   - Verify status changes to "pending"
4. **View Receipt**: Click "View" on paid fee

**Test Credentials:**
- Student: `aparece.alex` / `123456`
- Admin: (provide admin credentials)

---

## Questions?

Contact the frontend team if you need:
- Clarification on any endpoint
- Different response format
- Additional fields in responses
- Help with testing

---

**Last Updated:** February 15, 2026  
**Status:** Awaiting Backend Implementation  
**Priority:** Medium
