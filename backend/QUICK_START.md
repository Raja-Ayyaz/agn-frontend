# Quick Start Guide - Apply Form

## ✅ Implementation Status: COMPLETE

The apply form is **fully implemented** and ready to use!

## How It Works

1. **User fills form** on frontend (apply.jsx)
2. **Uploads CV** (PDF or DOCX)
3. **Backend receives** data and file
4. **CV is masked** (sensitive info removed)
5. **Both CVs uploaded** to Cloudinary (original + masked)
6. **Data saved** to database with CV links
7. **Success response** sent to frontend

## Start Using It

### 1. Start Backend Server
```powershell
cd "d:\AGN website\backend"
python full_api.py
```

✅ Server runs on: `http://localhost:8000`

### 2. Start Frontend (separate terminal)
```powershell
cd "d:\AGN website\frontend\my-react-app"
npm run dev
```

✅ Frontend runs on: `http://localhost:5173` (or similar)

### 3. Test It
- Navigate to apply page
- Fill in the form
- Upload a CV (PDF or DOCX)
- Click Submit

## What Happens Behind the Scenes

```
User Submits Form
      ↓
Frontend sends FormData to /insert_employee
      ↓
Backend receives CV + employee details
      ↓
CV saved to temporary file
      ↓
Original CV → Upload to Cloudinary ✅
      ↓
CV processed through masker (removes sensitive data)
      ↓
Masked CV → Upload to Cloudinary ✅
      ↓
Both URLs + employee data → Database ✅
      ↓
Success! Return employee_id + CV URLs
```

## Files in Database

After submission, the `employees` table will have:
- `cv` = Original CV URL (full version)
- `masked_cv` = Masked CV URL (sensitive info removed)
- All other employee details

## Verify It's Working

### Check Server Health
```powershell
curl http://localhost:8000/api/health
```

Expected: `{"ok":true,"service":"full_api"}`

### Run Test Script
```powershell
cd "d:\AGN website\backend"
python test_apply_flow.py
```

This will test the complete flow with a sample CV.

## Logs to Watch

When a form is submitted, you'll see console output like:
```
[insert_employee] Request received
[insert_employee] Fields: name=John Doe, email=john@example.com
[insert_employee] Processing file upload: cv.pdf
[_handle_cv_mask_and_cloud_upload] Uploading original to Cloudinary...
[_handle_cv_mask_and_cloud_upload] Masking complete, uploading masked CV...
[_insert_employee_row] Employee inserted successfully with ID: 123
[insert_employee] SUCCESS: Employee created with ID: 123
```

## Dependencies Installed

All required packages are in `requirements.txt`:
- Flask (API server)
- flask-cors (CORS support)
- cloudinary (file uploads)
- mysql-connector-python (database)
- PyMuPDF (PDF processing)
- python-docx (Word processing)

## Configuration

Everything is configured in `.env`:
```env
# Cloudinary (for CV storage)
Cloudinary_Cloud_Name=daknxfxvv
Cloudinary_API_Key=782796493951941
Cloudinary_API_Secret=uhw7NmEOPTfRv4b9cyasDe25hBc

# Database
AGN_DB_HOST=gateway01.eu-central-1.prod.aws.tidbcloud.com
AGN_DB_USER=4YoWi5wpZWfFZMg.root
AGN_DB_PASS=rM9HHqklqdSdDSfi
AGN_DB_NAME=agn
```

## Key Features

✅ **Automatic CV Masking** - Removes sensitive information
✅ **Cloud Storage** - CVs stored on Cloudinary CDN
✅ **Two Versions** - Original for admin, masked for public
✅ **Error Handling** - Comprehensive error messages
✅ **File Validation** - Only PDF and DOCX accepted
✅ **Size Limit** - 30MB max file size
✅ **Auto Cleanup** - Temporary files automatically deleted

## Common Issues

### "Cannot connect to server"
- Make sure backend is running: `python full_api.py`
- Check port 8000 is not in use

### "Cloudinary upload failed"
- Verify `.env` has correct Cloudinary credentials
- Check internet connection

### "Database error"
- Verify database credentials in `.env`
- Check database is accessible

## Next Steps

The apply form is ready! You can now:
1. ✅ Accept job applications
2. ✅ Store CVs securely
3. ✅ Protect candidate privacy (masked CVs)
4. ✅ Review applications in admin panel

## Need More Info?

See `APPLY_FORM_IMPLEMENTATION.md` for detailed technical documentation.
