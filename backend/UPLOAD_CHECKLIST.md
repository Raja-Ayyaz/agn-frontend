# 📦 Files Required for Hugging Face Upload

## ✅ Core Application Files

### Python Scripts
- [x] `full_api.py` - Main Flask application
- [x] `db_conn.py` - Database connection pooling
- [x] `processor.py` - CV processor shim
- [x] `cloudinary_helper.py` - Cloudinary integration

### CV Modifier Module
- [x] `cv modifier/__init__.py`
- [x] `cv modifier/processor.py`
- [x] `cv modifier/pdf_masker.py`
- [x] `cv modifier/word_masker.py`
- [x] `cv modifier/regix_pattren.py`

### Configuration Files
- [x] `requirements_huggingface.txt` - Python dependencies
- [x] `Dockerfile` - Docker build configuration
- [x] `.dockerignore` - Files to exclude from build
- [x] `README_HUGGINGFACE.md` - Space documentation

### SSL/Certificates
- [x] `isrgrootx1.pem` - TiDB SSL certificate

### Optional Service Account
- [ ] `cv-storage-api-2f7734b5aa02.json` - Google Cloud service account (if needed)

---

## ❌ Files to EXCLUDE (Security)

### Sensitive Data
- [ ] `.env` - Contains secrets (use environment variables instead)
- [ ] `password/` - Credential folder
- [ ] Any files with API keys or passwords

### Development Files
- [ ] `test_*.py` - Test scripts
- [ ] `benchmark_*.py` - Benchmark scripts
- [ ] `example_*.py` - Example scripts
- [ ] `start_server.ps1` - Local development script
- [ ] `admin_panal_view.py` - CLI tool (not needed for API)
- [ ] `employer_view.py` - CLI tool
- [ ] `main.py` - Old CLI interface

### Documentation (Keep only essential)
- [ ] `ADMIN_HIRE_REQUESTS_FEATURE.md`
- [ ] `APPLY_FORM_IMPLEMENTATION.md`
- [ ] `CHECKLIST.md`
- [ ] `FLOW_DIAGRAM.md`
- [ ] `HIRE_REQUESTS_FEATURE.md`
- [ ] `IMPORT_FIX.md`
- [ ] `LXML_VERIFICATION.md`
- [ ] `PYTHON_314_FIX.md`
- [ ] `QUICK_START.md`
- [ ] `READY_TO_USE.md`
- [ ] `DB_POOLING_GUIDE.md`
- [ ] `MIGRATION_CHECKLIST.md`
- [ ] `POOLING_*.md`

### Build Artifacts
- [ ] `__pycache__/` - Python cache
- [ ] `*.pyc` - Compiled Python
- [ ] `.git/` - Git repository

### Sample/Test Data
- [ ] `cv modifier/outputs/` - Test outputs
- [ ] `cv modifier/pdf_samples/` - Sample PDFs
- [ ] `exports/` - CSV exports

---

## 🔧 Environment Variables to Set in Hugging Face

### Database
```bash
DB_HOST=gateway01.eu-central-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_USER=4YoWi5wpZWfFZMg.root
DB_PASSWORD=rM9HHqklqdSdDSfi
DB_NAME=agn
DB_POOL_SIZE=10
DB_CONNECT_TIMEOUT=10
```

### Cloudinary
```bash
Cloudinary_Cloud_Name=daknxfxvv
Cloudinary_API_Key=782796493951941
Cloudinary_API_Secret=uhw7NmEOPTfRv4b9cyasDe25hBc
```

---

## 📋 Quick Upload Command (if using git)

```bash
# Clone your Hugging Face Space
git clone https://huggingface.co/spaces/[your-username]/agn-job-bank-api
cd agn-job-bank-api

# Copy required files from your backend
cp path/to/backend/full_api.py .
cp path/to/backend/db_conn.py .
cp path/to/backend/processor.py .
cp path/to/backend/cloudinary_helper.py .
cp path/to/backend/requirements_huggingface.txt .
cp path/to/backend/Dockerfile .
cp path/to/backend/.dockerignore .
cp path/to/backend/README_HUGGINGFACE.md README.md
cp path/to/backend/isrgrootx1.pem .
cp -r "path/to/backend/cv modifier" .

# Commit and push
git add .
git commit -m "Initial deployment"
git push
```

---

## ✅ Deployment Verification Checklist

After uploading, verify:

- [ ] Space shows "Building" then "Running" status
- [ ] No errors in Logs tab
- [ ] Health endpoint responds: `https://[your-space].hf.space/api/health`
- [ ] Database connection works: Test `/api/employees?limit=1`
- [ ] File upload works: Test `/insert_employee` with a CV
- [ ] CV masking works: Verify masked CV removes PII
- [ ] All environment variables set correctly
- [ ] SSL certificate loaded (for TiDB connection)
- [ ] Cloudinary uploads working

---

## 📊 File Size Estimates

| File/Folder | Size | Required |
|------------|------|----------|
| full_api.py | ~35 KB | ✅ Yes |
| db_conn.py | ~12 KB | ✅ Yes |
| processor.py | ~2 KB | ✅ Yes |
| cloudinary_helper.py | ~6 KB | ✅ Yes |
| cv modifier/ | ~20 KB | ✅ Yes |
| isrgrootx1.pem | ~2 KB | ✅ Yes |
| requirements_huggingface.txt | ~2 KB | ✅ Yes |
| Dockerfile | ~1 KB | ✅ Yes |
| **Total** | **~80 KB** | |

---

## 🎯 Minimal Deployment (Fastest)

If you want to deploy as quickly as possible, upload ONLY these files:

1. `full_api.py`
2. `db_conn.py`
3. `processor.py`
4. `cloudinary_helper.py`
5. `cv modifier/` (entire folder)
6. `isrgrootx1.pem`
7. `requirements_huggingface.txt`
8. `Dockerfile`

Then set environment variables and you're done!

---

**Total files to upload**: ~10 files + 1 folder  
**Estimated upload time**: 2-5 minutes  
**Build time**: 5-10 minutes  
**Total deployment time**: ~15 minutes
