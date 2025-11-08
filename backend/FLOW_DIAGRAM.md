# Apply Form Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         APPLY FORM COMPLETE FLOW                        │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   FRONTEND   │  User fills application form
│  (apply.jsx) │  - Name, Email, Phone
└──────┬───────┘  - Education, Experience
       │          - CV File Upload (PDF/DOCX)
       │
       │  FormData POST Request
       │  http://localhost:8000/insert_employee
       ↓
┌──────────────────────────────────────────────────────────────────────────┐
│                            BACKEND SERVER                                │
│                          (full_api.py)                                   │
└──────────────────────────────────────────────────────────────────────────┘
       │
       │ 1. Receive Request
       ↓
┌─────────────────┐
│ Validate Input  │  - Check CV file present
│  & Save Temp    │  - Validate file type (PDF/DOCX)
└────────┬────────┘  - Save to temp file
         │            /tmp/upload_xyz.pdf
         │
         │ 2. Start Processing
         ↓
┌────────────────────────────────────────────────────────────────────────┐
│              _handle_cv_mask_and_cloud_upload()                        │
└────────────────────────────────────────────────────────────────────────┘
         │
         │ Step A: Upload Original
         ↓
    ┌─────────────┐
    │ Cloudinary  │ → Upload to folder: agn_cv/originals/
    │   Upload    │ → Get URL: https://res.cloudinary.com/.../original.pdf
    └─────┬───────┘
          │
          │ Step B: Mask CV
          ↓
    ┌──────────────────┐
    │  processor.py    │ → Detect file type (PDF/DOCX)
    │  process_file()  │ → Route to appropriate masker
    └─────┬────────────┘
          │
          ├─ PDF? ──→ pdf_masker.py
          │           - Remove CNIC numbers
          │           - Remove phone numbers  
          │           - Remove sensitive data
          │           ↓
          │         Masked PDF created
          │
          └─ DOCX? ─→ word_masker.py
                      - Remove CNIC numbers
                      - Remove phone numbers
                      - Remove sensitive data
                      ↓
                    Masked DOCX created
          │
          │ Step C: Upload Masked
          ↓
    ┌─────────────┐
    │ Cloudinary  │ → Upload to folder: agn_cv/masked/
    │   Upload    │ → Get URL: https://res.cloudinary.com/.../masked.pdf
    └─────┬───────┘
          │
          │ Step D: Cleanup
          ↓
    ┌──────────────┐
    │ Delete Temp  │ → Remove /tmp/masked_xyz.pdf
    │    Files     │ → Free up disk space
    └──────┬───────┘
           │
           │ Return URLs
           ↓
┌────────────────────────────────────────────────────────────────────────┐
│                    _insert_employee_row()                              │
└────────────────────────────────────────────────────────────────────────┘
           │
           │ 3. Database Insert
           ↓
    ┌──────────────────┐
    │  MySQL Database  │ INSERT INTO employees
    │  (employees tbl) │ - name, email, phone, etc.
    └──────────────────┘ - cv = original URL
           │              - masked_cv = masked URL
           │
           │ Return employee_id
           ↓
┌────────────────────────────────────────────────────────────────────────┐
│                        SUCCESS RESPONSE                                │
└────────────────────────────────────────────────────────────────────────┘
           │
           │ JSON Response
           │ {
           │   "ok": true,
           │   "employee_id": 123,
           │   "cv_url": "https://..../original.pdf",
           │   "masked_cv_url": "https://..../masked.pdf"
           │ }
           ↓
┌──────────────┐
│   FRONTEND   │  Display Success Message
│  (apply.jsx) │  - Show toast notification
└──────────────┘  - Reset form
                  - Ready for next applicant


═══════════════════════════════════════════════════════════════════════════

                           DATA FLOW SUMMARY

┌─────────────┐       ┌──────────────┐       ┌───────────────┐
│   CV File   │  →    │   Backend    │  →    │  Cloudinary   │
│  (Upload)   │       │  Processing  │       │   (Storage)   │
└─────────────┘       └──────────────┘       └───────────────┘
                             │
                             ↓
                      ┌──────────────┐
                      │   Database   │
                      │ (employees)  │
                      └──────────────┘

Original CV:  User → Backend → Cloudinary → Database (cv field)
Masked CV:    User → Backend → Masker → Cloudinary → Database (masked_cv)
Form Data:    User → Backend → Database (all other fields)

═══════════════════════════════════════════════════════════════════════════

                         FILE LOCATIONS

Backend:
  d:\AGN website\backend\
    ├── full_api.py           ← Main API server
    ├── processor.py          ← Masking orchestrator
    ├── cloudinary_helper.py  ← Upload handler
    ├── .env                  ← Configuration
    └── cv modifier/
        ├── pdf_masker.py     ← PDF masking
        └── word_masker.py    ← DOCX masking

Frontend:
  d:\AGN website\frontend\my-react-app\
    └── src\components\apply\
        └── apply.jsx         ← Application form

Database:
  TiDB Cloud (MySQL)
    └── employees table       ← Stores all data

Cloud Storage:
  Cloudinary CDN
    ├── agn_cv/originals/    ← Original CVs
    └── agn_cv/masked/       ← Masked CVs

═══════════════════════════════════════════════════════════════════════════

                      PROCESSING TIME BREAKDOWN

Step                          Time (approx)
────────────────────────────────────────────
1. File upload to backend     0.5 - 2s
2. Save to temp file          0.1s
3. Upload original to Cloud   1 - 3s
4. Mask CV (process_file)     0.5 - 2s
5. Upload masked to Cloud     1 - 3s
6. Database insert            0.1s
7. Cleanup temp files         0.1s
────────────────────────────────────────────
Total:                        3 - 10s

* Depends on file size and internet speed

═══════════════════════════════════════════════════════════════════════════

                         ERROR HANDLING FLOW

┌─────────────┐
│ User Input  │
└──────┬──────┘
       │
       ├─ No CV file? ──────→ Error: "Missing CV file"
       │
       ├─ Wrong type? ──────→ Error: "Unsupported file type"
       │
       ├─ Too large? ───────→ Error: "File too large (max 30MB)"
       │
       ├─ Upload fails? ────→ Error: "Cloudinary upload failed"
       │
       ├─ Masking fails? ───→ Error: "CV processing failed"
       │
       └─ DB error? ────────→ Error: "Database insertion failed"

All errors:
  → Logged to console with details
  → Returned to frontend with message
  → Temp files cleaned up
  → User notified via toast/alert

═══════════════════════════════════════════════════════════════════════════
```

## Key Points

1. **Two CV Versions**: Original (full) + Masked (privacy-protected)
2. **Cloud Storage**: Both stored on Cloudinary CDN for fast access
3. **Database**: Only URLs stored, not files themselves
4. **Automatic Cleanup**: Temp files deleted after processing
5. **Error Recovery**: Comprehensive error handling at each step
6. **Scalable**: Cloud storage handles any number of files
7. **Secure**: Sensitive data removed from masked version

## Privacy Protection

The masked CV removes:
- ✅ CNIC numbers (identity)
- ✅ Phone numbers (contact)
- ✅ Email addresses (optional)
- ✅ Other PII patterns

This allows:
- **Admins**: View original CV (full details)
- **Employers**: View masked CV (privacy protected)
- **Public**: No access to CVs
