# Apply Form Implementation Guide

## Overview
The apply form allows candidates to submit their CV and personal details. The backend automatically processes the CV through a masking module, uploads both original and masked versions to Cloudinary, and stores the information in the database.

## Complete Flow

```
Frontend (apply.jsx)
    ↓
    FormData: CV file + employee details
    ↓
POST http://localhost:8000/insert_employee
    ↓
Backend (full_api.py)
    ↓
1. Receive CV file & form data
    ↓
2. Save CV to temporary file
    ↓
3. Upload original CV to Cloudinary
   → agn_cv/originals/ folder
   → Get original CV URL
    ↓
4. Process CV through masking module
   → processor.process_file(original, masked)
   → Calls pdf_masker.py or word_masker.py
   → Removes sensitive information (CNIC, phone, etc.)
    ↓
5. Upload masked CV to Cloudinary
   → agn_cv/masked/ folder
   → Get masked CV URL
    ↓
6. Insert into database (employees table)
   → cv field = original CV URL
   → masked_cv field = masked CV URL
   → All other employee details
    ↓
7. Return response
   → employee_id
   → cv_url (original)
   → masked_cv_url (masked)
```

## Files Involved

### Backend Files

1. **full_api.py** - Main API endpoint
   - `/insert_employee` - Handles the form submission
   - `_handle_cv_mask_and_cloud_upload()` - Orchestrates CV processing
   - `_insert_employee_row()` - Database insertion

2. **processor.py** - CV masking orchestrator
   - `process_file()` - Routes to appropriate masker based on file type

3. **cv modifier/pdf_masker.py** - PDF masking logic
   - Removes sensitive information from PDF files

4. **cv modifier/word_masker.py** - DOCX masking logic
   - Removes sensitive information from Word documents

5. **cloudinary_helper.py** - Cloudinary integration
   - `upload_file()` - Uploads files to Cloudinary
   - `fetch_and_upload_url()` - Uploads from URL

### Frontend Files

1. **apply.jsx** - Application form component
   - Form fields for employee details
   - File upload for CV
   - FormData submission to backend

## API Endpoint

### POST /insert_employee

**Request:**
- Content-Type: `multipart/form-data`
- Fields:
  ```javascript
  {
    // Required
    cv: File,                    // PDF or DOCX file
    name: string,
    email: string,
    mobile_no: string,
    
    // Optional
    age: string,
    location: string,
    nearest_route: string,
    cnic_no: string,
    educational_profile: string,
    recent_completed_education: string,
    applying_for: string,        // Job role/field
    experience: string,
    experience_detail: string
  }
  ```

**Response (Success - 200):**
```json
{
  "ok": true,
  "employee_id": 123,
  "cv_url": "https://res.cloudinary.com/.../originals/cv.pdf",
  "masked_cv_url": "https://res.cloudinary.com/.../masked/cv.pdf"
}
```

**Response (Error - 400/500):**
```json
{
  "ok": false,
  "error": "Error message here"
}
```

## Database Schema

### employees Table
```sql
CREATE TABLE employees (
  employee_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  age INT,
  email VARCHAR(255),
  mobile_no VARCHAR(20),
  location VARCHAR(255),
  nearest_route VARCHAR(255),
  cnic_no VARCHAR(20),
  educational_profile TEXT,
  recent_completed_education VARCHAR(255),
  field VARCHAR(255),              -- Job role (from applying_for)
  experience VARCHAR(255),
  experience_detail TEXT,
  cv TEXT,                         -- Original CV URL
  masked_cv TEXT,                  -- Masked CV URL
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables

Required in `.env` file:

```env
# Cloudinary Configuration
Cloudinary_Cloud_Name=your_cloud_name
Cloudinary_API_Key=your_api_key
Cloudinary_API_Secret=your_api_secret

# Database Configuration
AGN_DB_HOST=gateway01.eu-central-1.prod.aws.tidbcloud.com
AGN_DB_USER=4YoWi5wpZWfFZMg.root
AGN_DB_PASS=rM9HHqklqdSdDSfi
AGN_DB_NAME=agn
AGN_DB_PORT=3306
```

## Testing

### 1. Start the Backend Server
```bash
cd backend
python full_api.py
```

Server will start on: `http://localhost:8000`

### 2. Test with Script
```bash
python test_apply_flow.py
```

### 3. Test with Frontend
```bash
cd frontend/my-react-app
npm run dev
```

Navigate to the apply form and submit an application.

## Debugging

The implementation includes detailed logging. When a request is processed, you'll see:

```
[insert_employee] Request received
[insert_employee] Fields: name=John Doe, email=john@example.com
[insert_employee] Processing file upload: cv.pdf
[insert_employee] File saved to temp: /tmp/xyz.pdf
[insert_employee] Starting CV masking and upload process...
[_handle_cv_mask_and_cloud_upload] Starting process for: /tmp/xyz.pdf
[_handle_cv_mask_and_cloud_upload] Uploading original to Cloudinary...
[_handle_cv_mask_and_cloud_upload] Original uploaded: https://res.cloudinary.com/...
[_handle_cv_mask_and_cloud_upload] Creating masked version at: /tmp/masked_xyz.pdf
[_handle_cv_mask_and_cloud_upload] Masking complete, uploading masked CV...
[_handle_cv_mask_and_cloud_upload] Masked uploaded: https://res.cloudinary.com/...
[_handle_cv_mask_and_cloud_upload] Cleaned up masked temp file
[insert_employee] Upload complete. Original: https://...
[insert_employee] Cleaned up temp file
[_insert_employee_row] Inserting employee: John Doe (john@example.com)
[_insert_employee_row] Employee inserted successfully with ID: 123
[insert_employee] SUCCESS: Employee created with ID: 123
```

## Error Handling

The implementation handles:
- ✅ Missing CV file
- ✅ Unsupported file types (only PDF and DOCX allowed)
- ✅ Cloudinary upload failures
- ✅ Masking process errors
- ✅ Database insertion errors
- ✅ Temporary file cleanup

All errors are logged and returned to the frontend with descriptive messages.

## Supported File Types

- ✅ PDF (`.pdf`)
- ✅ DOCX (`.docx`)
- ❌ DOC (old format - not supported)
- ❌ Other formats

## Security Features

1. **File Validation**: Only PDF and DOCX files accepted
2. **Filename Sanitization**: Using `secure_filename()` from Werkzeug
3. **Sensitive Data Masking**: Automatically removes:
   - CNIC numbers
   - Phone numbers
   - Email addresses (optional)
   - Other PII data
4. **Temporary File Cleanup**: All temp files deleted after processing

## Next Steps

1. ✅ Backend fully implemented
2. ✅ Frontend form ready
3. ✅ Database integration complete
4. ✅ Cloudinary storage configured
5. ✅ CV masking module integrated

**Ready for production use!**

## Troubleshooting

### Issue: "Cloudinary credentials not found"
**Solution**: Check `.env` file has correct Cloudinary credentials

### Issue: "Unsupported file type"
**Solution**: Only PDF and DOCX files are supported

### Issue: "Database connection error"
**Solution**: Verify database credentials in `.env` file

### Issue: "Module 'processor' not found"
**Solution**: Ensure `cv modifier/` folder exists with processor.py

### Issue: "File upload fails"
**Solution**: Check file size (max 30MB) and internet connection for Cloudinary

## Performance Notes

- Max file size: 30MB (configurable in `full_api.py`)
- Average processing time: 3-10 seconds depending on:
  - CV file size
  - Internet upload speed
  - Masking complexity
- Temporary files are automatically cleaned up
- Cloudinary handles CDN distribution for fast access

## Maintenance

### Adding New File Types
1. Add extension to `ALLOWED_EXT` in `full_api.py`
2. Implement masker in `cv modifier/` folder
3. Update `processor.py` to handle new type

### Modifying Masking Rules
Edit the masking logic in:
- `cv modifier/pdf_masker.py` for PDFs
- `cv modifier/word_masker.py` for DOCX files
- `cv modifier/regix_pattren.py` for regex patterns

### Changing Cloudinary Folder Structure
Update folder names in:
- `_handle_cv_mask_and_cloud_upload()` function
- Change `folder="agn_cv/originals"` and `folder="agn_cv/masked"`
