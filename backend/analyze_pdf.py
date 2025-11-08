"""
Diagnostic tool to analyze a PDF and check if text can be extracted
This helps identify if sensitive data is in images vs. extractable text
"""
import sys
import os
import fitz

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'cv modifier'))
from regix_pattren import PHONE_REGEX, EMAIL_REGEX

def analyze_pdf(pdf_path):
    """Analyze a PDF to see what can be extracted and masked"""
    print(f"\n{'='*70}")
    print(f"ANALYZING: {pdf_path}")
    print(f"{'='*70}\n")
    
    if not os.path.exists(pdf_path):
        print(f"❌ File not found: {pdf_path}")
        return
    
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"❌ Could not open PDF: {e}")
        return
    
    print(f"📄 Total pages: {len(doc)}")
    print(f"📝 Format: {doc.metadata.get('format', 'Unknown')}")
    print(f"✍️  Creator: {doc.metadata.get('creator', 'Unknown')}")
    print(f"🏗️  Producer: {doc.metadata.get('producer', 'Unknown')}\n")
    
    for page_num, page in enumerate(doc, 1):
        print(f"\n{'─'*70}")
        print(f"PAGE {page_num}")
        print(f"{'─'*70}")
        
        # Extract text
        text = page.get_text("text")
        print(f"📊 Text length: {len(text)} characters")
        
        # Check for images
        image_list = page.get_images()
        print(f"🖼️  Images: {len(image_list)}")
        
        # Look for phone numbers
        phones = PHONE_REGEX.findall(text)
        if phones:
            print(f"\n📱 PHONES FOUND ({len(phones)}):")
            for phone in phones:
                print(f"   - {phone}")
                rects = page.search_for(phone)
                print(f"     Locations: {len(rects)} (can {'✅ mask' if rects else '❌ NOT mask'})")
        else:
            print(f"\n📱 No phone numbers detected in extractable text")
        
        # Look for emails
        emails = EMAIL_REGEX.findall(text)
        if emails:
            print(f"\n📧 EMAILS FOUND ({len(emails)}):")
            for email in emails:
                print(f"   - {email}")
                rects = page.search_for(email)
                print(f"     Locations: {len(rects)} (can {'✅ mask' if rects else '❌ NOT mask'})")
        else:
            print(f"\n📧 No emails detected in extractable text")
        
        # Show text preview
        if text.strip():
            print(f"\n📝 TEXT PREVIEW (first 500 chars):")
            print("─" * 70)
            print(text[:500].strip())
            if len(text) > 500:
                print(f"\n... ({len(text) - 500} more characters)")
            print("─" * 70)
        else:
            print(f"\n⚠️  WARNING: No extractable text on this page!")
            if image_list:
                print(f"   → This page appears to be image-based (scanned PDF)")
                print(f"   → Text in images CANNOT be masked with current method")
    
    doc.close()
    
    print(f"\n{'='*70}")
    print("ANALYSIS COMPLETE")
    print(f"{'='*70}\n")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        pdf_path = sys.argv[1]
        analyze_pdf(pdf_path)
    else:
        print("Usage: python analyze_pdf.py <path_to_pdf>")
        print("\nOr drag and drop a PDF file onto this script")
        
        # Look for sample PDFs
        sample_dir = os.path.join(os.path.dirname(__file__), 'cv modifier', 'pdf_samples')
        if os.path.exists(sample_dir):
            pdf_files = [f for f in os.listdir(sample_dir) if f.endswith('.pdf') and not f.startswith('MASKED_')]
            if pdf_files:
                print(f"\nFound sample PDFs:")
                for i, pdf in enumerate(pdf_files, 1):
                    print(f"  {i}. {pdf}")
                
                choice = input("\nEnter number to analyze (or Enter to skip): ").strip()
                if choice.isdigit() and 1 <= int(choice) <= len(pdf_files):
                    pdf_path = os.path.join(sample_dir, pdf_files[int(choice) - 1])
                    analyze_pdf(pdf_path)
