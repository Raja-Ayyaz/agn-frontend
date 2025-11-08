# Image-Only PDF Validation Implementation

## Overview
Added automatic validation to reject image-only PDFs (like Canva exports) before processing. This prevents:
- Resource waste (masking, compression, upload)
- File size bloat (897KB → 27MB)
- Upload failures (exceeds Cloudinary 10MB limit)

## Implementation

### 1. Helper Function: `is_image_only_pdf()`
**Location:** `full_api.py` (after `save_temp_file()` function)

```python
def is_image_only_pdf(file_path: str, text_threshold: int = 20) -> bool:
    """Check if a PDF is image-only (like Canva exports).
    
    Returns True if the PDF has less than text_threshold characters of text.
    These PDFs can't be properly masked and cause file size bloat.
    """
```

**Logic:**
- Opens PDF with PyMuPDF (fitz)
- Extracts all text from all pages
- Counts characters (strips whitespace)
- Returns `True` if character count < 20
- Returns `False` for non-PDF files or errors

**Why 20 characters?**
- Canva PDFs have 0 extractable text
- Scanned PDFs have minimal OCR artifacts
- Normal CVs have hundreds/thousands of characters
- 20 provides safe margin for detection

### 2. Validation in `/insert_employee` Endpoint

**Location:** Right after `save_temp_file()` call, before masking

**Validation Order:**
1. **File Size Check** (3MB limit)
   - Prevents huge uploads
   - Returns: `"File size exceeds 3MB limit. Please compress your CV or use a smaller file."`

2. **Image-Only PDF Check** (only for PDFs)
   - Uses `is_image_only_pdf()` with 20 char threshold
   - Returns: `"Image-only PDFs (like Canva exports) are not supported. Please upload a text-based PDF or Word document instead."`

**Both validations:**
- Clean up temp file before returning
- Return HTTP 400 with descriptive JSON error
- Prevent further processing

### 3. Import Added
**Location:** Top of `full_api.py`

```python
import fitz  # PyMuPDF for PDF validation
```

## Files Modified

### Backend (`backend/full_api.py`):
- ✅ Added `import fitz`
- ✅ Added `is_image_only_pdf()` function
- ✅ Added file size validation (3MB)
- ✅ Added image-only PDF validation

### Hugging Face Deploy (`huggingface_deploy_clean/full_api.py`):
- ✅ Added `import fitz`
- ✅ Added `is_image_only_pdf()` function
- ✅ Added file size validation (3MB)
- ✅ Added image-only PDF validation

## Testing

### Test Case 1: Normal Text-Based PDF
**Expected:** ✅ Accepted and processed
- Character count: 1000+ (typical CV)
- File size: < 3MB
- Masking works correctly

### Test Case 2: Canva Export (Image-Only PDF)
**Expected:** ❌ Rejected with error
- Character count: 0
- Error: "Image-only PDFs (like Canva exports) are not supported..."
- HTTP 400 response

### Test Case 3: Large File (>3MB)
**Expected:** ❌ Rejected with error
- Error: "File size exceeds 3MB limit..."
- HTTP 400 response

### Test Case 4: Word Document
**Expected:** ✅ Accepted and processed
- Not PDF, so image-only check skipped
- File size check still applies

## Error Messages

Both error messages display in the frontend modal:

1. **File Too Large:**
   ```json
   {
     "ok": false,
     "error": "File size exceeds 3MB limit. Please compress your CV or use a smaller file."
   }
   ```

2. **Image-Only PDF:**
   ```json
   {
     "ok": false,
     "error": "Image-only PDFs (like Canva exports) are not supported. Please upload a text-based PDF or Word document instead."
   }
   ```

## Deployment Checklist

- ✅ Backend implementation complete
- ✅ Hugging Face deployment updated
- ✅ PyMuPDF (fitz) already in requirements
- ⏳ Deploy to Hugging Face (push to main)
- ⏳ Test on production

## Next Steps

1. **Deploy to Hugging Face:**
   ```bash
   cd huggingface_deploy_clean
   git add full_api.py IMAGE_PDF_VALIDATION.md
   git commit -m "Add image-only PDF validation and file size limits"
   git push origin main
   ```

2. **Test Production:**
   - Upload normal CV → should work
   - Upload Canva PDF → should reject with clear message
   - Upload large file (>3MB) → should reject

3. **Monitor:**
   - Check Hugging Face logs for validation messages
   - Verify error messages display correctly in frontend modal
   - Confirm no resource waste on rejected files

## Technical Notes

- **Threshold Tuning:** 20 characters is conservative
  - Increase if false positives occur
  - Decrease if Canva PDFs slip through

- **Performance:** Validation is fast
  - Text extraction: ~100ms per page
  - Happens before expensive masking/upload
  - Net performance gain by avoiding bad uploads

- **Compatibility:**
  - PyMuPDF (fitz) already in requirements
  - Works with Python 3.10+
  - No new dependencies needed
