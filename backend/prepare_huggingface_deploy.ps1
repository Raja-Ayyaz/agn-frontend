# Prepare files for Hugging Face upload
# Run this script to copy all required files to a deployment folder

Write-Host "`n🚀 Preparing AGN Backend for Hugging Face Deployment" -ForegroundColor Cyan
Write-Host "════════════════════════════════════════════════════`n" -ForegroundColor Cyan

# Create deployment folder
$deployFolder = "d:\AGN website\huggingface_deploy"
if (Test-Path $deployFolder) {
    Write-Host "⚠️  Deployment folder exists. Cleaning..." -ForegroundColor Yellow
    Remove-Item $deployFolder -Recurse -Force
}

New-Item -ItemType Directory -Path $deployFolder | Out-Null
Write-Host "✓ Created deployment folder: $deployFolder" -ForegroundColor Green

# Source folder
$sourceFolder = "d:\AGN website\backend"

# Copy core files
Write-Host "`n📦 Copying core application files..." -ForegroundColor Yellow
$coreFiles = @(
    "full_api.py",
    "db_conn.py", 
    "processor.py",
    "cloudinary_helper.py"
)

foreach ($file in $coreFiles) {
    Copy-Item "$sourceFolder\$file" $deployFolder
    Write-Host "  ✓ $file" -ForegroundColor Green
}

# Copy deployment configuration
Write-Host "`n📋 Copying deployment configuration..." -ForegroundColor Yellow
Copy-Item "$sourceFolder\requirements_huggingface.txt" "$deployFolder\requirements.txt"
Write-Host "  ✓ requirements.txt (renamed from requirements_huggingface.txt)" -ForegroundColor Green

Copy-Item "$sourceFolder\Dockerfile" $deployFolder
Write-Host "  ✓ Dockerfile" -ForegroundColor Green

Copy-Item "$sourceFolder\.dockerignore" $deployFolder
Write-Host "  ✓ .dockerignore" -ForegroundColor Green

Copy-Item "$sourceFolder\README_HUGGINGFACE.md" "$deployFolder\README.md"
Write-Host "  ✓ README.md (renamed from README_HUGGINGFACE.md)" -ForegroundColor Green

# Copy cv modifier folder
Write-Host "`n📂 Copying CV modifier module..." -ForegroundColor Yellow
Copy-Item "$sourceFolder\cv modifier" $deployFolder -Recurse
Write-Host "  ✓ cv modifier/ (5 files)" -ForegroundColor Green

# Create .env template (DO NOT commit this with actual values)
Write-Host "`n🔐 Creating environment variables template..." -ForegroundColor Yellow
$envTemplate = @"
# Environment Variables for Hugging Face Space
# DO NOT upload this file! Set these in Settings → Variables

# Database Configuration
DB_HOST=gateway01.eu-central-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_USER=4YoWi5wpZWfFZMg.root
DB_PASSWORD=rM9HHqklqdSdDSfi
DB_NAME=agn
DB_POOL_SIZE=10

# Cloudinary Configuration
Cloudinary_Cloud_Name=daknxfxvv
Cloudinary_API_Key=782796493951941
Cloudinary_API_Secret=uhw7NmEOPTfRv4b9cyasDe25hBc
"@

$envTemplate | Out-File "$deployFolder\ENV_VARIABLES_REFERENCE.txt" -Encoding UTF8
Write-Host "  ✓ ENV_VARIABLES_REFERENCE.txt (for your reference only)" -ForegroundColor Green

# Create upload instructions
$instructions = @"
# 🚀 READY TO UPLOAD TO HUGGING FACE

## Files in this folder are ready to upload to:
https://huggingface.co/spaces/AGN768/backend

## Upload Methods:

### Method 1: Web UI (Easiest)
1. Go to https://huggingface.co/spaces/AGN768/backend
2. Click "Files" tab
3. Click "Add file" → "Upload files"
4. Drag ALL files from THIS folder
5. Commit changes

### Method 2: Git Clone (Advanced)
```powershell
cd "d:\AGN website"
git clone https://huggingface.co/spaces/AGN768/backend hf-backend
cd hf-backend
Copy-Item ..\huggingface_deploy\* . -Recurse -Force
git add .
git commit -m "Deploy AGN backend"
git push
```

## CRITICAL: Set Environment Variables
After uploading files, go to:
Settings → Variables → Add Secret

Copy variables from: ENV_VARIABLES_REFERENCE.txt

## After Upload:
1. Wait 5-10 minutes for build
2. Check "Logs" tab for errors
3. Test: https://AGN768-backend.hf.space/api/health

## Files included:
- full_api.py (main application)
- db_conn.py (database pooling)
- processor.py (CV processor)
- cloudinary_helper.py (file uploads)
- requirements.txt (dependencies)
- Dockerfile (container config)
- .dockerignore (exclude files)
- README.md (space documentation)
- cv modifier/ (CV masking module)

Total: 9 files ready to deploy
"@

$instructions | Out-File "$deployFolder\UPLOAD_INSTRUCTIONS.txt" -Encoding UTF8

# Summary
Write-Host "`n════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ DEPLOYMENT PACKAGE READY!" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "`n📁 Location: $deployFolder" -ForegroundColor Yellow
Write-Host "`n📊 Files prepared:" -ForegroundColor Yellow
Get-ChildItem $deployFolder -Recurse -File | ForEach-Object {
    Write-Host "   $($_.FullName.Replace($deployFolder, '.'))" -ForegroundColor White
}

Write-Host "`n🎯 Next Steps:" -ForegroundColor Yellow
Write-Host "   1. Open folder: $deployFolder" -ForegroundColor White
Write-Host "   2. Read UPLOAD_INSTRUCTIONS.txt" -ForegroundColor White
Write-Host "   3. Upload ALL files to Hugging Face" -ForegroundColor White
Write-Host "   4. Set environment variables from ENV_VARIABLES_REFERENCE.txt" -ForegroundColor White
Write-Host "   5. Wait for build and test!" -ForegroundColor White

Write-Host "`n⚠️  IMPORTANT: Do NOT upload ENV_VARIABLES_REFERENCE.txt" -ForegroundColor Red
Write-Host "   Set those values in Hugging Face Settings → Variables instead" -ForegroundColor Yellow

Write-Host "`n════════════════════════════════════════════════════`n" -ForegroundColor Cyan

# Open folder
Write-Host "Opening deployment folder..." -ForegroundColor Cyan
Start-Process $deployFolder
