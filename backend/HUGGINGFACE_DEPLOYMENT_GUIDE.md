# 🚀 AGN Job Bank - Hugging Face Deployment Guide

## Prerequisites
- Hugging Face account (https://huggingface.co/)
- TiDB Cloud database (or MySQL database)
- Cloudinary account for file storage

---

## 📋 Step-by-Step Deployment

### 1️⃣ Prepare Your Repository

Create a new Hugging Face Space:
1. Go to https://huggingface.co/spaces
2. Click "Create new Space"
3. Choose:
   - **Space name**: `agn-job-bank-api`
   - **SDK**: Docker
   - **Hardware**: CPU basic (free tier)
   - **Visibility**: Public or Private

### 2️⃣ Upload Required Files

Upload these files to your Hugging Face Space:

**Essential Files:**
```
├── full_api.py                      # Main Flask application
├── db_conn.py                       # Database connection pooling
├── processor.py                     # CV processor shim
├── cloudinary_helper.py             # Cloudinary upload helper
├── requirements_huggingface.txt     # Python dependencies
├── Dockerfile                       # Docker configuration
├── README_HUGGINGFACE.md           # Space documentation
├── isrgrootx1.pem                  # SSL certificate for TiDB
├── cv-storage-api-2f7734b5aa02.json # Service account key (optional)
└── cv modifier/                     # CV masking module
    ├── __init__.py
    ├── processor.py
    ├── pdf_masker.py
    ├── word_masker.py
    └── regix_pattren.py
```

**Files to EXCLUDE (security):**
- `.env` (use environment variables instead)
- `password/` folder
- Test files (`test_*.py`, `benchmark_*.py`)
- Development scripts (`start_server.ps1`)

### 3️⃣ Configure Environment Variables

In your Hugging Face Space settings, add these **Secrets**:

#### Database Configuration
```bash
DB_HOST=gateway01.eu-central-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_USER=4YoWi5wpZWfFZMg.root
DB_PASSWORD=rM9HHqklqdSdDSfi
DB_NAME=agn
DB_POOL_SIZE=10
DB_CONNECT_TIMEOUT=10
```

#### Cloudinary Configuration
```bash
Cloudinary_Cloud_Name=daknxfxvv
Cloudinary_API_Key=782796493951941
Cloudinary_API_Secret=uhw7NmEOPTfRv4b9cyasDe25hBc
```

> ⚠️ **Important**: Never commit these values to your repository!

### 4️⃣ Verify Dockerfile

Ensure your `Dockerfile` contains:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
# ... (see Dockerfile for full content)
EXPOSE 7860
CMD ["gunicorn", "--bind", "0.0.0.0:7860", ...]
```

### 5️⃣ Deploy

1. **Push files** to your Hugging Face Space
2. **Wait for build** (check "Logs" tab)
3. **Verify deployment**:
   - Space should show "Running" status
   - Visit: `https://[your-username]-agn-job-bank-api.hf.space/api/health`
   - Expected response: `{"ok": true, "service": "full_api"}`

---

## 🧪 Testing Your Deployment

### Test Health Endpoint
```bash
curl https://[your-space-url].hf.space/api/health
```

### Test Database Connection
```bash
curl https://[your-space-url].hf.space/api/employees?limit=1
```

### Test Employee Search
```bash
curl "https://[your-space-url].hf.space/api/employees?role=Software%20Engineer"
```

---

## 🔧 Configuration Options

### Adjust Worker Count (for higher traffic)
Edit `Dockerfile`:
```dockerfile
CMD ["gunicorn", "--bind", "0.0.0.0:7860", 
     "--workers", "4",        # Increase workers
     "--threads", "8",        # Increase threads
     ...
]
```

### Database Pool Size
Set environment variable:
```bash
DB_POOL_SIZE=20  # Increase for higher traffic
```

### Request Timeout
Edit `Dockerfile`:
```dockerfile
CMD ["gunicorn", ..., "--timeout", "180", ...]  # 3 minutes
```

---

## 📊 Resource Requirements

### Minimum (Free Tier)
- **CPU**: 2 vCPUs
- **RAM**: 16 GB
- **Storage**: 50 GB
- **Handles**: ~100 requests/minute

### Recommended (Paid Tier)
- **CPU**: 4 vCPUs
- **RAM**: 32 GB
- **Storage**: 100 GB
- **Handles**: ~500 requests/minute

---

## 🐛 Troubleshooting

### Build Fails
**Error**: `No module named 'fitz'`
**Fix**: PyMuPDF is listed in requirements_huggingface.txt

**Error**: `lxml` build fails
**Fix**: Dockerfile includes `libxml2-dev libxslt1-dev gcc g++`

### Runtime Errors
**Error**: `Can't connect to MySQL server`
**Fix**: 
1. Check DB_HOST, DB_PORT environment variables
2. Verify TiDB firewall allows Hugging Face IPs
3. Check SSL certificate path

**Error**: `Pool is full`
**Fix**: Increase `DB_POOL_SIZE` environment variable

### Performance Issues
**Slow responses**:
1. Increase workers: `--workers 4`
2. Increase pool size: `DB_POOL_SIZE=20`
3. Upgrade to paid tier for more CPU

---

## 🔒 Security Best Practices

### ✅ DO:
- Use environment variables for all secrets
- Keep `.env` file in `.gitignore`
- Use HTTPS endpoints only
- Regularly rotate database passwords
- Monitor API usage logs

### ❌ DON'T:
- Commit API keys or passwords
- Expose `.env` file
- Use `DEBUG=True` in production
- Allow unlimited file uploads
- Disable CORS without authentication

---

## 📈 Monitoring

### Check Space Logs
1. Go to your Space page
2. Click "Logs" tab
3. Monitor for errors

### Pool Status Endpoint (Add to full_api.py)
```python
@app.route("/api/pool/status", methods=["GET"])
def pool_status():
    from db_conn import get_pool_status
    return jsonify(get_pool_status())
```

### Health Check
Hugging Face automatically pings:
```
GET /api/health
```
Returns 200 OK if healthy.

---

## 🔄 Updating Your Deployment

1. **Make changes** to your code locally
2. **Test locally**: `python full_api.py`
3. **Push to Hugging Face**: Git push or upload via UI
4. **Space auto-rebuilds** (check Logs tab)
5. **Verify changes**: Test your endpoints

---

## 📞 Support

### Common Issues
- **Database errors**: Check TiDB connection settings
- **File upload fails**: Verify Cloudinary credentials
- **Slow performance**: Increase workers/pool size
- **Memory errors**: Upgrade to larger instance

### Resources
- Hugging Face Docs: https://huggingface.co/docs/hub/spaces
- TiDB Cloud: https://tidbcloud.com/
- Cloudinary Docs: https://cloudinary.com/documentation

---

## ✅ Deployment Checklist

- [ ] Created Hugging Face Space
- [ ] Uploaded all required files
- [ ] Set all environment variables (DB_*, Cloudinary_*)
- [ ] Verified Dockerfile configuration
- [ ] Tested /api/health endpoint
- [ ] Tested database connection
- [ ] Tested file upload (employee application)
- [ ] Verified CV masking works
- [ ] Set up monitoring
- [ ] Documented API endpoints
- [ ] Configured CORS for frontend domain

---

## 🎉 You're Live!

Your API is now running on Hugging Face Spaces!

**Share your API URL**:
```
https://[your-username]-agn-job-bank-api.hf.space
```

**Update your frontend** (`config.js`):
```javascript
const CONFIG = {
  BASE_URL: 'https://[your-username]-agn-job-bank-api.hf.space'
};
```

---

**Happy Deploying! 🚀**
