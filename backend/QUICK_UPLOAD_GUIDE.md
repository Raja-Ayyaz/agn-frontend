# 🚀 Quick Upload to Hugging Face - AGN768/backend

## Current Status Check

Based on the screenshot, your space shows:
- ⚠️ "No application file" warning
- Space URL: https://huggingface.co/spaces/AGN768/backend
- Space is created but files not yet uploaded

---

## Upload Commands (Git Method)

### Step 1: Clone Your Space
```powershell
cd "d:\AGN website"
git clone https://huggingface.co/spaces/AGN768/backend agn-backend-space
cd agn-backend-space
```

### Step 2: Copy Required Files
```powershell
# Copy core files
Copy-Item "..\backend\full_api.py" .
Copy-Item "..\backend\db_conn.py" .
Copy-Item "..\backend\processor.py" .
Copy-Item "..\backend\cloudinary_helper.py" .

# Copy deployment files
Copy-Item "..\backend\requirements_huggingface.txt" .\requirements.txt
Copy-Item "..\backend\Dockerfile" .
Copy-Item "..\backend\.dockerignore" .
Copy-Item "..\backend\README_HUGGINGFACE.md" .\README.md

# Copy CV modifier folder
Copy-Item "..\backend\cv modifier" . -Recurse

# Copy SSL certificate (if you have it)
# Copy-Item "..\backend\isrgrootx1.pem" .
```

### Step 3: Commit and Push
```powershell
git add .
git commit -m "Initial backend deployment"
git push
```

---

## Alternative: Web UI Upload

1. **Go to**: https://huggingface.co/spaces/AGN768/backend
2. **Click**: "Files" → "Add file" → "Upload files"
3. **Drag & drop** these files:
   - `full_api.py`
   - `db_conn.py`
   - `processor.py`
   - `cloudinary_helper.py`
   - `requirements_huggingface.txt` (rename to `requirements.txt`)
   - `Dockerfile`
   - `.dockerignore`
   - `README_HUGGINGFACE.md` (rename to `README.md`)
   - Entire `cv modifier` folder

4. **Commit** the changes

---

## ⚠️ IMPORTANT: Set Environment Variables

Before the app can run, you MUST set these in Settings → Variables:

### Database Variables
```
DB_HOST = gateway01.eu-central-1.prod.aws.tidbcloud.com
DB_PORT = 4000
DB_USER = 4YoWi5wpZWfFZMg.root
DB_PASSWORD = rM9HHqklqdSdDSfi
DB_NAME = agn
DB_POOL_SIZE = 10
```

### Cloudinary Variables
```
Cloudinary_Cloud_Name = daknxfxvv
Cloudinary_API_Key = 782796493951941
Cloudinary_API_Secret = uhw7NmEOPTfRv4b9cyasDe25hBc
```

### SSL Certificate (Optional - if database requires it)
```
DB_SSL_CA = /app/isrgrootx1.pem
```
(Only set if you upload the certificate file)

---

## After Upload - Testing

Once uploaded and environment variables are set:

1. **Check Logs**: Go to your space → "Logs" tab
2. **Wait for Build**: Takes 5-10 minutes
3. **Test Health**: Visit `https://AGN768-backend.hf.space/api/health`
   - Expected: `{"ok": true, "service": "full_api"}`

4. **Test Database**: Visit `https://AGN768-backend.hf.space/api/employees?limit=1`
   - Should return employee data

---

## SSL Certificate Note

The `isrgrootx1.pem` file is for TiDB SSL connection. You have two options:

### Option 1: Without SSL Certificate (Recommended for now)
TiDB Cloud usually works without the certificate file. Just don't set `DB_SSL_CA` environment variable.

### Option 2: With SSL Certificate
If you need it, download from: https://letsencrypt.org/certs/isrgrootx1.pem
Then upload to your space and set `DB_SSL_CA=/app/isrgrootx1.pem`

---

## Quick Test Command

After uploading, run this to test:
```powershell
Invoke-WebRequest -Uri "https://AGN768-backend.hf.space/api/health" | Select-Object -ExpandProperty Content
```

---

## Need Help?

If you see errors:
1. Check the "Logs" tab in your space
2. Verify all environment variables are set
3. Make sure `requirements.txt` is named correctly (not `requirements_huggingface.txt`)
4. Ensure Dockerfile is in the root

---

**Next**: Upload the files and set environment variables!
