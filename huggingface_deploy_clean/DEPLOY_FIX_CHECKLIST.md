# Deploy Empty File Upload Fix - Checklist

## Pre-Deployment
- [x] Fixed `save_temp_file()` function to properly handle file saving
- [x] Added file size validation (reject 0-byte files)
- [x] Added Cloudinary upload validation
- [x] Added comprehensive error logging
- [x] Updated both `huggingface_deploy_clean` and `backend` folders
- [x] Created documentation (FIX_EMPTY_FILE_UPLOAD.md)

## Deployment Steps

### 1. Verify Local Changes
```powershell
cd "d:\AGN website\huggingface_deploy_clean"
git status  # Check what files changed
git diff full_api.py  # Review changes
```

### 2. Commit Changes
```powershell
git add full_api.py FIX_EMPTY_FILE_UPLOAD.md DEPLOY_FIX_CHECKLIST.md
git commit -m "Fix: Empty file upload issue - Add validation and error handling

- Fixed save_temp_file() to properly save uploaded files
- Added file size validation (reject empty files)
- Added Cloudinary upload validation
- Enhanced error messages and logging
- Fixes pymupdf.EmptyFileError on CV processing"
```

### 3. Push to Repository
```powershell
git push origin main
```

### 4. Deploy to Hugging Face
Option A: **If auto-deploy is enabled**, Hugging Face will automatically pull the changes.

Option B: **Manual deployment**:
- Go to https://huggingface.co/spaces/agn768/backend (or your space)
- Settings → Repository → Pull latest changes
- Or upload `full_api.py` directly via the web interface

### 5. Verify Deployment

#### Check Logs After Deployment
```bash
# Look for these patterns in Hugging Face logs:
[save_temp_file] Saved ...
[_handle_cv_mask_and_cloud_upload] Source file validated: XXX bytes
[_handle_cv_mask_and_cloud_upload] Original uploaded successfully: ...
```

#### Test Upload
1. Go to your frontend: https://www.agnjobbank.com/
2. Try uploading a CV via the employee form
3. Monitor Hugging Face logs in real-time
4. Verify:
   - File size is logged
   - Both URLs (original and masked) are logged
   - No `EmptyFileError` occurs

#### Database Check
```sql
-- Check latest employee record
SELECT id, name, email, cv, masked_cv, created_at 
FROM employees 
ORDER BY created_at DESC 
LIMIT 1;

-- Verify both URLs are present and valid
```

## Expected Log Output (Success)

```
[insert_employee] Request received
[insert_employee] Fields: name=Test User, email=test@example.com
[insert_employee] Processing file upload: test_cv.pdf
[save_temp_file] Saved test_cv.pdf to /tmp/tmpXXXXX.pdf (45678 bytes)
[insert_employee] File saved to temp: /tmp/tmpXXXXX.pdf
[insert_employee] Starting CV masking and upload process...
[_handle_cv_mask_and_cloud_upload] Starting process for: /tmp/tmpXXXXX.pdf
[_handle_cv_mask_and_cloud_upload] Source file validated: 45678 bytes
[_handle_cv_mask_and_cloud_upload] Uploading original to Cloudinary...
[_handle_cv_mask_and_cloud_upload] Original uploaded successfully: https://res.cloudinary.com/...
[_handle_cv_mask_and_cloud_upload] Creating masked version at: /tmp/tmpYYYYY.pdf
[_handle_cv_mask_and_cloud_upload] Masking complete, uploading masked CV...
[_handle_cv_mask_and_cloud_upload] Masked uploaded successfully: https://res.cloudinary.com/...
[insert_employee] Upload complete. Original: https://res.cloudinary.com/...
[insert_employee] SUCCESS: Employee created with ID: 123
```

## Rollback Plan (If Needed)

If issues occur after deployment:

```powershell
# Revert to previous version
git revert HEAD
git push origin main

# Or restore specific file
git checkout HEAD~1 -- full_api.py
git commit -m "Rollback: Revert empty file upload fix"
git push origin main
```

## Monitoring (First 24 Hours)

- [ ] Check Hugging Face logs every few hours
- [ ] Monitor error rate in logs
- [ ] Check if employee uploads are succeeding
- [ ] Verify database entries have both `cv` and `masked_cv` URLs
- [ ] Test with different file sizes (small, medium, large PDFs)
- [ ] Test with DOCX files if supported

## Success Criteria

✅ No more `pymupdf.EmptyFileError` in logs  
✅ File sizes are being logged  
✅ Cloudinary uploads show success messages  
✅ Database entries have valid URLs  
✅ Users can successfully submit employee forms  
✅ Clear error messages if upload fails  

## Troubleshooting

### If Empty File Error Still Occurs
1. Check if `save_temp_file()` is logging file size
2. Check if file size is 0 bytes → frontend issue
3. Check if file size > 0 but still fails → Cloudinary issue

### If Cloudinary Upload Fails
1. Check environment variables on Hugging Face:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
2. Check Cloudinary dashboard for quota/errors
3. Check network connectivity from Hugging Face

### If Masking Fails
1. Check if original file was saved correctly (file size logged)
2. Check if Cloudinary upload succeeded
3. Check PyMuPDF/dependencies are installed correctly

## Contact

If issues persist after deployment:
- Check `FIX_EMPTY_FILE_UPLOAD.md` for detailed technical info
- Review Hugging Face logs for specific error messages
- Verify environment variables are set correctly
