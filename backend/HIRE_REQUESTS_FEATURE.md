# Hire Requests Feature Documentation

## Overview
This feature allows employers to send hire requests to candidates and view all their pending/accepted/rejected requests in one place.

## Components

### Frontend

#### 1. EmployerDashboard.jsx
- **New Button**: "My Hire Requests" button in the sticky header (blue button)
- **New Modal**: Full-screen modal showing all hire requests with details
- **Features**:
  - Summary statistics (Pending, Accepted, Rejected counts)
  - List of all hire requests with candidate details
  - Status indicators with color coding
  - Request and response timestamps
  - Message/comment display

#### 2. apiService.js
- **New Function**: `getEmployerHireRequests(employer_id)`
- Fetches all hire requests for the logged-in employer

### Backend

#### 1. full_api.py
- **New Endpoint**: `GET /api/hire-requests/<employer_id>`
- Returns all hire requests with joined employee data
- Includes: candidate name, field, location, experience, email
- Ordered by request_date (newest first)

## Database

### Table: hire_request
Already created with columns:
- `request_id` - Primary key
- `employer_id` - Foreign key to employer table
- `employee_id` - Foreign key to employees table
- `status` - ENUM('pending', 'accepted', 'rejected')
- `request_date` - Timestamp when request was created
- `response_date` - Timestamp when status changed
- `message` - Employer's message/comment

## User Flow

1. Employer clicks "My Hire Requests" button in header
2. Modal opens and automatically fetches all requests from API
3. Displays summary stats at the top (pending/accepted/rejected counts)
4. Shows list of all requests with:
   - Candidate name and role
   - Location and field
   - Status badge (color-coded)
   - Request sent date/time
   - Response date/time (if responded)
   - Employer's original message
5. Employer can close modal to return to dashboard

## Status Color Coding

- **Pending**: Yellow background, yellow border, clock icon
- **Accepted**: Green background, green border, checkmark icon
- **Rejected**: Red background, red border, X icon

## API Endpoints Used

### GET /api/hire-requests/<employer_id>
**Response:**
```json
{
  "ok": true,
  "count": 5,
  "requests": [
    {
      "request_id": 1,
      "employer_id": 123,
      "employee_id": 456,
      "status": "pending",
      "request_date": "2025-01-15T10:30:00",
      "response_date": null,
      "message": "We'd like to hire you for Senior Accountant position...",
      "employee_name": "John Doe",
      "employee_field": "Accounting",
      "employee_location": "Karachi",
      "employee_experience": "5 years",
      "employee_email": "john@example.com"
    }
  ]
}
```

## Testing

1. Login as employer
2. Search and hire some candidates
3. Click "My Hire Requests" button
4. Verify all requests are shown
5. Check that status colors match the status
6. Verify timestamps are formatted correctly
7. Confirm messages are displayed properly

## Future Enhancements

- Filter by status (show only pending/accepted/rejected)
- Search/filter requests by candidate name
- Export requests to CSV
- Email notifications when status changes
- Cancel pending requests
- Add notes/comments to existing requests
