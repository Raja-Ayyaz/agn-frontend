# Admin Hire Requests Management Feature

## Overview
Complete hire request management system for the admin panel. Admins can view all hire requests from employers, see detailed information, and accept or reject requests with response messages.

## Features Implemented

### 1. Dashboard Statistics
- **Total Requests**: Shows count of all hire requests
- **Pending**: Shows pending requests (clickable to filter)
- **Accepted**: Shows accepted requests (clickable to filter)
- **Rejected**: Shows rejected requests (clickable to filter)

### 2. Filter Tabs
- All Requests
- Pending Only
- Accepted Only
- Rejected Only

### 3. Request Details Display
Each request card shows:

#### Employer Information
- Company name
- Contact person username
- Email address

#### Candidate Information
- Employee name
- Job field/role
- Location
- Experience level

#### Request Metadata
- Request ID
- Status badge (color-coded)
- Request sent date/time
- Response date/time (if responded)

#### Messages
- **Employer's Message**: Original hire request message
- **Admin Response**: Admin's response message (if responded)

### 4. Accept/Reject Functionality

#### Accept Flow:
1. Admin clicks "Accept Request" button
2. Modal opens with green theme
3. Shows request summary
4. Admin enters acceptance message
5. Clicks "Confirm Accept"
6. Status updates to 'accepted'
7. Response message and timestamp saved
8. List refreshes automatically

#### Reject Flow:
1. Admin clicks "Reject Request" button
2. Modal opens with red theme
3. Shows request summary
4. Admin enters rejection reason
5. Clicks "Confirm Reject"
6. Status updates to 'rejected'
7. Response message and timestamp saved
8. List refreshes automatically

## API Endpoints

### GET /api/admin/hire-requests
**Purpose**: Fetch all hire requests for admin panel

**Response:**
```json
{
  "ok": true,
  "count": 10,
  "requests": [
    {
      "request_id": 1,
      "employer_id": 5,
      "employee_id": 123,
      "status": "pending",
      "request_date": "2025-01-20T10:30:00",
      "response_date": null,
      "message": "We want to hire this candidate...",
      "response_message": null,
      "employee_name": "John Doe",
      "employee_field": "Accounting",
      "employee_location": "Karachi",
      "employee_experience": "5 years",
      "employee_email": "john@example.com",
      "employer_username": "hr_manager",
      "employer_company": "ABC Corp",
      "employer_email": "hr@abccorp.com"
    }
  ]
}
```

### POST /api/admin/hire-request/respond
**Purpose**: Accept or reject a hire request

**Request Body:**
```json
{
  "request_id": 1,
  "status": "accepted",
  "response_message": "We have approved this hire request. Please contact the candidate directly."
}
```

**Response:**
```json
{
  "ok": true,
  "request_id": 1,
  "status": "accepted"
}
```

**Validation:**
- `request_id` is required
- `status` must be 'accepted' or 'rejected'
- `response_message` is required
- Request must be in 'pending' status
- Sets `response_date` to current timestamp

## Database Schema

### hire_request Table
```sql
CREATE TABLE hire_request (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    employer_id INT NOT NULL,
    employee_id INT NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    response_date TIMESTAMP NULL,
    message TEXT,
    response_message TEXT,  -- NEW COLUMN
    
    CONSTRAINT fk_hire_employer
        FOREIGN KEY (employer_id) REFERENCES employer(employer_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
        
    CONSTRAINT fk_hire_employee
        FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
        ON DELETE CASCADE ON UPDATE CASCADE,
        
    CONSTRAINT unique_hire_request UNIQUE (employer_id, employee_id)
);
```

**Important**: If your table already exists, add the response_message column:
```sql
ALTER TABLE hire_request ADD COLUMN response_message TEXT AFTER message;
```

## Component Structure

### HireRequests.jsx (Admin Panel)

**State Management:**
- `allRequests`: All hire requests from database
- `filteredRequests`: Filtered by status
- `filterStatus`: Current filter ('all', 'pending', 'accepted', 'rejected')
- `responseModal`: Modal visibility
- `selectedRequest`: Request being responded to
- `responseAction`: 'accept' or 'reject'
- `responseMessage`: Admin's response text
- `submitting`: Loading state during submission

**Key Functions:**
- `fetchAllRequests()`: Loads all requests from API
- `openResponseModal(request, action)`: Opens accept/reject modal
- `handleResponseSubmit()`: Submits admin response to API
- `getStatusIcon(status)`: Returns icon based on status
- `getStatusColor(status)`: Returns color classes for status
- `formatDate(dateString)`: Formats timestamps

## UI/UX Features

### Color Coding
- **Pending**: Yellow theme (bg-yellow-100, border-yellow-300)
- **Accepted**: Green theme (bg-green-100, border-green-300)
- **Rejected**: Red theme (bg-red-100, border-red-300)

### Interactive Elements
- Click on stat cards to filter by status
- Hover effects on request cards
- Animated modal entrance
- Loading spinners during API calls
- Toast notifications for feedback

### Responsive Design
- Grid layout for stats (4 columns on desktop)
- Stacked layout on mobile
- Scrollable modal content
- Touch-friendly buttons

## Business Logic

### Validation Rules
1. Only 'pending' requests can be accepted/rejected
2. Response message is mandatory
3. Once responded, status cannot be changed again
4. Unique constraint: One request per employer-employee pair

### Status Flow
```
pending → accepted (with response_message)
pending → rejected (with response_message)
accepted → [final state]
rejected → [final state]
```

## Testing Checklist

- [ ] View all hire requests on page load
- [ ] Filter by pending/accepted/rejected
- [ ] Click stat cards to filter
- [ ] View employer and employee details
- [ ] Read original hire request message
- [ ] Click "Accept Request" button
- [ ] Enter acceptance message and submit
- [ ] Verify status updates to 'accepted'
- [ ] Verify response message is saved
- [ ] Click "Reject Request" button
- [ ] Enter rejection reason and submit
- [ ] Verify status updates to 'rejected'
- [ ] Verify response_date is set
- [ ] Try accepting already-responded request (should fail)
- [ ] Verify buttons disappear after response
- [ ] Check toast notifications appear
- [ ] Test refresh button functionality

## Integration Points

### Frontend Routes
- Admin Panel → Hire Requests menu item → HireRequests component

### API Integration
- `getAllHireRequests()` from apiService.js
- `respondToHireRequest({ request_id, status, response_message })` from apiService.js

### Database Tables Used
- `hire_request` (main table)
- `employees` (joined for candidate details)
- `employer` (joined for employer details)

## Future Enhancements

1. **Email Notifications**
   - Notify employer when request is accepted/rejected
   - Send response message via email

2. **Search & Advanced Filters**
   - Search by company name
   - Search by candidate name
   - Filter by date range
   - Filter by field/role

3. **Bulk Actions**
   - Accept/reject multiple requests at once
   - Export to CSV/Excel

4. **Analytics**
   - Acceptance rate statistics
   - Average response time
   - Most active employers

5. **Comments/Notes**
   - Internal admin notes on requests
   - Request history/audit log

6. **Status Updates**
   - Additional statuses (e.g., 'on-hold', 'interview-scheduled')
   - Allow status reversals with proper authorization

## Error Handling

### Frontend
- Toast notifications for all API errors
- Form validation before submission
- Disabled states during submission
- Graceful handling of network errors

### Backend
- Validates all required fields
- Checks request exists before updating
- Prevents duplicate responses
- Returns proper HTTP status codes
- Logs errors to console

## Performance Considerations

- Requests loaded once on component mount
- Manual refresh via button (not auto-polling)
- Efficient database queries with proper JOINs
- Indexes on frequently queried columns
- Filtered results computed client-side from cached data
