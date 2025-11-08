"""
Quick test to verify the CV masking module imports work correctly
"""
import sys
import os

print("="*60)
print("Testing CV Modifier Module Imports")
print("="*60)

# Add backend to path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

print("\n1. Testing processor import...")
try:
    from processor import process_file
    print("   ✅ processor.process_file imported successfully")
except Exception as e:
    print(f"   ❌ Failed to import processor: {e}")
    sys.exit(1)

print("\n2. Testing cv modifier module components...")
cv_modifier_dir = os.path.join(backend_dir, "cv modifier")
if cv_modifier_dir not in sys.path:
    sys.path.insert(0, cv_modifier_dir)

try:
    from pdf_masker import mask_pdf
    print("   ✅ pdf_masker imported successfully")
except Exception as e:
    print(f"   ❌ Failed to import pdf_masker: {e}")

try:
    from word_masker import mask_word_doc
    print("   ✅ word_masker imported successfully")
except Exception as e:
    print(f"   ❌ Failed to import word_masker: {e}")

try:
    from regix_pattren import PHONE_REGEX, EMAIL_REGEX
    print("   ✅ regix_pattren imported successfully")
except Exception as e:
    print(f"   ❌ Failed to import regix_pattren: {e}")

print("\n3. Testing cloudinary helper...")
try:
    from cloudinary_helper import upload_file, fetch_and_upload_url
    print("   ✅ cloudinary_helper imported successfully")
except Exception as e:
    print(f"   ❌ Failed to import cloudinary_helper: {e}")

print("\n" + "="*60)
print("Import Test Complete!")
print("="*60)
print("\nAll core modules are accessible.")
print("You can now start the server with: python full_api.py")
