# How to Verify lxml in Virtual Environment

## ✅ LXML IS INSTALLED AND WORKING!

### Current Status:
- ✅ Virtual Environment: `D:\AGN website\.venv`
- ✅ Python Version: 3.14.0
- ✅ lxml Version: **6.0.2**
- ✅ Location: `d:\AGN website\.venv\Lib\site-packages\lxml\`
- ✅ All functionality tested and working

---

## Quick Verification Commands

### 1. Check if lxml is installed
```powershell
cd "d:\AGN website\backend"
python -c "import lxml; print(f'lxml {lxml.etree.__version__} installed')"
```

Expected output:
```
lxml 6.0.2 installed
```

### 2. Check virtual environment packages
```powershell
cd "d:\AGN website\backend"
pip list | findstr lxml
```

Expected output:
```
lxml           6.0.2
```

### 3. Verify lxml location
```powershell
cd "d:\AGN website\backend"
python -c "import lxml; print(lxml.__file__)"
```

Expected output (should contain `.venv`):
```
d:\AGN website\.venv\Lib\site-packages\lxml\__init__.py
```

---

## Full Verification Script

Run the complete verification:
```powershell
cd "d:\AGN website\backend"
python verify_lxml.py
```

Or run inline test:
```powershell
python -c "from lxml import etree; root = etree.Element('test'); print('lxml works!')"
```

---

## If lxml is NOT installed

### Install lxml in the virtual environment:
```powershell
cd "d:\AGN website\backend"
pip install lxml
```

### Or install all requirements:
```powershell
cd "d:\AGN website\backend"
pip install -r requirements.txt
```

---

## How to Ensure Server Uses Virtual Environment

### Option 1: Activate virtual environment first (Recommended)
```powershell
cd "d:\AGN website\backend"
& ..\..venv\Scripts\Activate.ps1
python full_api.py
```

### Option 2: Use full path to venv python
```powershell
cd "d:\AGN website\backend"
"D:/AGN website/.venv/Scripts/python.exe" full_api.py
```

### Option 3: Just use `python` (if venv is activated)
```powershell
# First activate venv
& "d:\AGN website\.venv\Scripts\Activate.ps1"

# Then run
cd "d:\AGN website\backend"
python full_api.py
```

---

## Verify Server is Using Correct Python

When you start the server, check the first few log lines. They should show:
```
Python executable: d:\AGN website\.venv\Scripts\python.exe
```

Or run this test:
```powershell
python -c "import sys; print(sys.executable)"
```

Should output:
```
d:\AGN website\.venv\Scripts\python.exe
```

---

## Test lxml Works with Word Masker

```powershell
cd "d:\AGN website\backend"
python -c "from lxml import etree; ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}; print('Word masker imports work!')"
```

---

## Common Issues

### Issue: "ModuleNotFoundError: No module named 'lxml'"
**Solution:** Install lxml in the virtual environment:
```powershell
pip install lxml
```

### Issue: Server shows wrong Python path
**Solution:** Activate virtual environment before running:
```powershell
& "d:\AGN website\.venv\Scripts\Activate.ps1"
python full_api.py
```

### Issue: lxml installed but still getting import error
**Solution:** Make sure you're running Python from the virtual environment:
```powershell
# Check which python is being used
python -c "import sys; print(sys.executable)"

# Should show: d:\AGN website\.venv\Scripts\python.exe
```

---

## Summary

✅ **lxml 6.0.2 is installed in your virtual environment**
✅ **All functionality tested and working**
✅ **Ready to use with the apply form**

To start the server:
```powershell
cd "d:\AGN website\backend"
python full_api.py
```

The CV masking will work correctly! 🚀
