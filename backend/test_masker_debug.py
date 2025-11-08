"""
Debug script to test CV masking on a sample PDF
"""
import os
import sys

# Add cv modifier to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'cv modifier'))

from pdf_masker import mask_pdf
from regix_pattren import PHONE_REGEX, EMAIL_REGEX
import fitz

def test_pdf_content(pdf_path, label="PDF"):
    """Extract and print text from PDF to see what's in it"""
    print(f"\n{'='*60}")
    print(f"{label}: {pdf_path}")
    print(f"{'='*60}")
    
    if not os.path.exists(pdf_path):
        print(f"❌ File doesn't exist!")
        return
    
    doc = fitz.open(pdf_path)
    
    for page_num, page in enumerate(doc, 1):
        text = page.get_text("text")
        print(f"\n--- Page {page_num} ---")
        
        # Check for phone numbers
        phones = PHONE_REGEX.findall(text)
        if phones:
            print(f"📱 PHONES FOUND: {phones}")
        else:
            print("📱 No phones found")
        
        # Check for emails
        emails = EMAIL_REGEX.findall(text)
        if emails:
            print(f"📧 EMAILS FOUND: {emails}")
        else:
            print("📧 No emails found")
        
        # Show first 500 chars
        print(f"\nText preview:\n{text[:500]}...")
    
    doc.close()

def test_masking():
    """Test the masking process"""
    # Look for sample PDFs
    sample_dir = os.path.join(os.path.dirname(__file__), 'cv modifier', 'pdf_samples')
    
    if not os.path.exists(sample_dir):
        print(f"❌ Sample directory doesn't exist: {sample_dir}")
        return
    
    pdf_files = [f for f in os.listdir(sample_dir) if f.endswith('.pdf')]
    
    if not pdf_files:
        print(f"❌ No PDF files found in {sample_dir}")
        return
    
    # Test with first PDF
    test_pdf = os.path.join(sample_dir, pdf_files[0])
    output_pdf = os.path.join(sample_dir, f"MASKED_{pdf_files[0]}")
    
    print(f"\n🔍 Testing masking process...")
    print(f"Input: {test_pdf}")
    print(f"Output: {output_pdf}")
    
    # Show original content
    test_pdf_content(test_pdf, "ORIGINAL")
    
    # Mask it
    print(f"\n⚙️ Running mask_pdf()...")
    try:
        mask_pdf(test_pdf, output_pdf)
        print("✅ Masking completed")
    except Exception as e:
        print(f"❌ Masking failed: {e}")
        import traceback
        traceback.print_exc()
        return
    
    # Show masked content
    test_pdf_content(output_pdf, "MASKED")
    
    print(f"\n✅ Test complete! Check the masked file at:\n{output_pdf}")

if __name__ == "__main__":
    test_masking()
