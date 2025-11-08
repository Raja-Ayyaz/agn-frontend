"""
Test if we can detect and mask the specific phone/email from Faizan's CV
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'cv modifier'))

from regix_pattren import PHONE_REGEX, EMAIL_REGEX
import fitz

# The phone and email from the CV you showed
test_phone = "03075612409"
test_email = "gmfaizan124@gmail.com"
test_name = "FAIZAN MUSTAFA"

print("Testing regex patterns...")
print(f"Phone '{test_phone}': {PHONE_REGEX.search(test_phone)}")
print(f"Email '{test_email}': {EMAIL_REGEX.search(test_email)}")

# Now let's simulate what happens in the PDF
sample_text = f"""
{test_name}

{test_phone}
{test_email}

St#2,House#124, Ramzanabad, Near Noor Fatima Mills, Faisalabad
"""

print(f"\n\nSample text:\n{sample_text}")
print("\n" + "="*60)
print("Searching for patterns in text...")
print("="*60)

phones_found = PHONE_REGEX.findall(sample_text)
emails_found = EMAIL_REGEX.findall(sample_text)

print(f"\nPhones found: {phones_found}")
print(f"Emails found: {emails_found}")

if phones_found and emails_found:
    print("\n✅ Patterns WOULD be detected in PDF text")
else:
    print("\n❌ Patterns NOT detected - masking would fail!")

# Let's also check what happens with the actual PDF masking process
print("\n" + "="*60)
print("Now let's see what happens during actual PDF processing...")
print("="*60)

# Create a test PDF with this content
test_pdf_path = os.path.join(os.path.dirname(__file__), "test_faizan_cv.pdf")
masked_pdf_path = os.path.join(os.path.dirname(__file__), "test_faizan_cv_MASKED.pdf")

# Create a simple PDF with the text
doc = fitz.open()  # new empty PDF
page = doc.new_page()

# Insert the test text
page.insert_text((50, 50), test_name, fontsize=14, fontname="helv")
page.insert_text((50, 80), test_phone, fontsize=10, fontname="helv")
page.insert_text((50, 100), test_email, fontsize=10, fontname="helv")
page.insert_text((50, 120), "St#2,House#124, Ramzanabad", fontsize=10, fontname="helv")

doc.save(test_pdf_path)
doc.close()

print(f"✅ Created test PDF: {test_pdf_path}")

# Now try to mask it
from pdf_masker import mask_pdf

print(f"\n⚙️ Attempting to mask the test PDF...")
try:
    mask_pdf(test_pdf_path, masked_pdf_path)
    print(f"✅ Masking completed: {masked_pdf_path}")
    
    # Check what's in the masked PDF
    doc = fitz.open(masked_pdf_path)
    page = doc[0]
    masked_text = page.get_text("text")
    doc.close()
    
    print("\n" + "="*60)
    print("MASKED PDF CONTENT:")
    print("="*60)
    print(masked_text)
    
    # Check if original values are still there
    if test_phone in masked_text:
        print(f"\n❌ PROBLEM: Original phone '{test_phone}' still in masked PDF!")
    else:
        print(f"\n✅ Original phone '{test_phone}' successfully removed")
    
    if test_email in masked_text:
        print(f"❌ PROBLEM: Original email '{test_email}' still in masked PDF!")
    else:
        print(f"✅ Original email '{test_email}' successfully removed")
        
    # Check if replacements are there
    phones_in_masked = PHONE_REGEX.findall(masked_text)
    emails_in_masked = EMAIL_REGEX.findall(masked_text)
    print(f"\nPhones in masked PDF: {phones_in_masked}")
    print(f"Emails in masked PDF: {emails_in_masked}")
    
except Exception as e:
    print(f"❌ Masking failed: {e}")
    import traceback
    traceback.print_exc()

print(f"\n\n📁 Check these files:")
print(f"  Original: {test_pdf_path}")
print(f"  Masked:   {masked_pdf_path}")
