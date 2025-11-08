# 🔧 HUGGING FACE BUILD ERROR FIX

## Error Diagnosis
The error `failed to calculate checksum of ref` means Hugging Face's cache is corrupted or the requirements.txt file was modified after upload.

## Solutions (Try in order):

### Solution 1: Force Rebuild from Scratch ⚡ (RECOMMENDED)
1. Go to: https://huggingface.co/spaces/AGN768/backend/settings
2. Scroll down to **"Factory reboot"** section
3. Click **"Factory reboot"** button
4. Wait for automatic rebuild (5-10 minutes)

### Solution 2: Re-upload Requirements File 📤
1. Delete the current `requirements.txt` from HF Space
2. Upload the **clean version**: `requirements_clean.txt` 
3. Rename it to `requirements.txt` in HF interface
4. This will trigger automatic rebuild

### Solution 3: Update Dockerfile 🐳
1. Upload the updated `Dockerfile` (already fixed in this folder)
2. The changes:
   - `COPY requirements.txt .` instead of `COPY requirements.txt requirements.txt`
   - Added `pip install --upgrade pip` before installing packages
3. Commit to trigger rebuild

### Solution 4: Clear Build Cache 🧹
1. Go to HF Space Settings
2. Look for "Build logs" or "Settings"
3. Find option to clear cache or rebuild
4. Trigger manual rebuild

## Files to Upload to Hugging Face:
✅ `Dockerfile` (updated - use this one!)
✅ `requirements_clean.txt` → rename to `requirements.txt`
✅ `db_conn.py` (with SSL certificate support)
✅ `full_api.py`
✅ `cloudinary_helper.py`
✅ `processor.py`
✅ Entire `cv modifier/` folder

## After Upload - Set Environment Variables:
Go to Settings → Variables and secrets → Add these 9 secrets:

**Database (6 variables):**
```
DB_HOST = gateway01.eu-central-1.prod.aws.tidbcloud.com
DB_PORT = 4000
DB_USER = 4YoWi5wpZWfFZMg.root
DB_PASSWORD = rM9HHqklqdSdDSfi
DB_NAME = agn
DB_POOL_SIZE = 10
```

**Cloudinary (3 variables):**
```
Cloudinary_Cloud_Name = daknxfxvv
Cloudinary_API_Key = 782796493951941
Cloudinary_API_Secret = uhw7NmEOPTfRv4b9cyasDe25hBc
```

## Expected Build Time:
- Initial build: 8-12 minutes
- Cached rebuild: 2-3 minutes

## How to Verify Success:
1. Check build logs for: `✅ PyMySQL pool created`
2. Space status changes to "Running" 
3. Test endpoint: https://AGN768-backend.hf.space/api/health
4. Should return: `{"ok": true, "database": "connected", "cloudinary": "configured"}`

## If Still Failing:
- Check build logs for specific error
- Verify all files uploaded correctly
- Ensure environment variables are set as "Secret"
- Try deleting the space and creating new one

---
**Pro Tip:** Hugging Face caches Docker layers. If you keep getting the same error, use "Factory reboot" to clear all caches.
