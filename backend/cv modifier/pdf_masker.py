import fitz
import os
from regix_pattren import PHONE_REGEX, EMAIL_REGEX

DEFAULT_PHONE = "+92 3037774400"
DEFAULT_EMAIL = "agnjobbank123@gmail.com"

def mask_pdf(input_pdf, output_pdf):
    """
    Main masking function - automatically detects if PDF is text-based or image-based
    For image-based PDFs, applies a simple black box redaction strategy
    """
    print(f"[PDF MASKER] Starting to mask: {input_pdf}")
    doc = fitz.open(input_pdf)
    
    # Check if PDF has extractable text
    total_text_length = 0
    has_images = False
    
    for page in doc:
        text = page.get_text("text")
        total_text_length += len(text.strip())
        if page.get_images():
            has_images = True
    
    doc.close()
    
    # Determine strategy
    if total_text_length < 50 and has_images:
        # Image-based PDF (like Canva) - use simple black box strategy
        print(f"[PDF MASKER] ⚠️ Detected image-based PDF (text length: {total_text_length})")
        print(f"[PDF MASKER] This appears to be a Canva or scanned PDF")
        print(f"[PDF MASKER] Applying simple redaction to common contact info areas...")
        mask_pdf_image_based_simple(input_pdf, output_pdf)
    else:
        # Text-based PDF
        print(f"[PDF MASKER] Detected text-based PDF (text length: {total_text_length})")
        mask_pdf_text_based(input_pdf, output_pdf)


def mask_pdf_image_based_simple(input_pdf, output_pdf):
    """
    Simple masking for image-based PDFs - adds black boxes over common contact areas
    This is a fallback when text cannot be extracted
    """
    doc = fitz.open(input_pdf)
    
    print(f"[PDF MASKER] Applying image-based masking (simple black box method)")
    print(f"[PDF MASKER] ⚠️ WARNING: This method may not be 100% accurate")
    print(f"[PDF MASKER] Recommendation: Request user to upload text-based PDF instead")
    
    for page_num, page in enumerate(doc, 1):
        page_rect = page.rect
        
        # Get page dimensions
        width = page_rect.width
        height = page_rect.height
        
        # Define areas to redact (these are typical positions for contact info)
        # Top-left corner (where name/contact usually appears in CVs)
        redact_areas = [
            # Format: (x0, y0, x1, y1) as percentages of page dimensions
            # Phone number area (usually near top, left side around 10-40% from top)
            fitz.Rect(30, height * 0.10, width * 0.35, height * 0.15),
            # Email area (usually just below phone)
            fitz.Rect(30, height * 0.15, width * 0.45, height * 0.20),
            # Alternative: right side contact info
            fitz.Rect(width * 0.65, 50, width - 30, 150),
        ]
        
        # Only apply minimal redaction to avoid over-redacting
        # We'll just white-out a small area at the top where contact info typically is
        print(f"[PDF MASKER] Page {page_num}: Adding white redaction boxes to probable contact areas")
        
        # Add white rectangles (less intrusive than black)
        for rect in redact_areas:
            page.add_redact_annot(rect, fill=(1, 1, 1))  # white fill
        
        page.apply_redactions()
        
        # Add watermark text
        text_point = fitz.Point(50, height * 0.13)
        page.insert_text(text_point, "Contact: Hidden", fontsize=10, color=(0.5, 0.5, 0.5))
    
    doc.save(output_pdf, garbage=4, deflate=True, clean=True)
    doc.close()
    
    # Check file size and compress if needed
    file_size = os.path.getsize(output_pdf)
    print(f"[PDF MASKER] Initial output size: {file_size / 1024 / 1024:.2f} MB")
    
    # If file is too large (>5MB), re-save with aggressive compression
    if file_size > 5 * 1024 * 1024:
        print(f"[PDF MASKER] File too large, applying aggressive compression...")
        doc = fitz.open(output_pdf)
        
        # Compress images in the PDF
        for page_num, page in enumerate(doc, 1):
            # Get all images
            img_list = page.get_images()
            for img_index, img in enumerate(img_list):
                xref = img[0]
                # Replace with compressed version
                pix = fitz.Pixmap(doc, xref)
                if pix.n - pix.alpha > 3:  # CMYK
                    pix = fitz.Pixmap(fitz.csRGB, pix)
                # Save with compression
                img_bytes = pix.tobytes("jpeg", quality=60)  # 60% JPEG quality
                doc.update_stream(xref, img_bytes)
                pix = None
        
        # Re-save with maximum compression
        doc.save(output_pdf, garbage=4, deflate=True, clean=True, linear=True)
        doc.close()
        
        new_size = os.path.getsize(output_pdf)
        print(f"[PDF MASKER] Compressed size: {new_size / 1024 / 1024:.2f} MB (reduced by {((file_size - new_size) / file_size * 100):.1f}%)")
    
    print(f"[PDF MASKER] ✅ Image-based masking complete")
    print(f"[PDF MASKER] Output: {output_pdf}")


def mask_pdf_text_based(input_pdf, output_pdf):
    """
    Original text-based masking (for PDFs with extractable text)
    """
    doc = fitz.open(input_pdf)
    
    total_phones_masked = 0
    total_emails_masked = 0

    for page_num, page in enumerate(doc, 1):
        text = page.get_text("text")
        print(f"[PDF MASKER] Page {page_num}: Extracted {len(text)} characters")

        replacements = []  # collect rect + dummy

        # Phones – replace ALL, not just first
        phones_in_text = PHONE_REGEX.findall(text)
        print(f"[PDF MASKER] Page {page_num}: Found {len(phones_in_text)} phone(s): {phones_in_text}")
        
        for p in phones_in_text:
            rects = page.search_for(p)
            print(f"[PDF MASKER] Page {page_num}: Phone '{p}' found in {len(rects)} location(s)")
            for rect in rects:
                page.add_redact_annot(rect, fill=(1,1,1))
                replacements.append((rect, DEFAULT_PHONE))
                total_phones_masked += 1

        # Emails
        emails_in_text = EMAIL_REGEX.findall(text)
        print(f"[PDF MASKER] Page {page_num}: Found {len(emails_in_text)} email(s): {emails_in_text}")
        
        for e in emails_in_text:
            rects = page.search_for(e)
            print(f"[PDF MASKER] Page {page_num}: Email '{e}' found in {len(rects)} location(s)")
            for rect in rects:
                page.add_redact_annot(rect, fill=(1,1,1))
                replacements.append((rect, DEFAULT_EMAIL))
                total_emails_masked += 1

        if replacements:
            print(f"[PDF MASKER] Page {page_num}: Applying {len(replacements)} redaction(s)")
            # Apply all redactions once
            page.apply_redactions()

            # Insert dummy replacements
            for rect, dummy in replacements:
                x = rect.x0 + 1
                y = rect.y1 - 2
                page.insert_text((x, y), dummy, fontsize=9, fontname="helv", color=(0,0,0))
        else:
            print(f"[PDF MASKER] Page {page_num}: No sensitive data found to mask")

    doc.save(output_pdf, garbage=4, deflate=True, clean=True)
    doc.close()
    print(f"[PDF MASKER] ✅ Complete: {total_phones_masked} phone(s) and {total_emails_masked} email(s) masked")
    print(f"[PDF MASKER] Output: {output_pdf}")
    
    # Verify the output
    verify_doc = fitz.open(output_pdf)
    verify_text = ""
    for page in verify_doc:
        verify_text += page.get_text("text")
    verify_doc.close()
    
    # Check if any original data leaked through
    remaining_phones = PHONE_REGEX.findall(verify_text)
    remaining_emails = EMAIL_REGEX.findall(verify_text)
    
    # Filter out our default replacements
    remaining_phones = [p for p in remaining_phones if p != DEFAULT_PHONE]
    remaining_emails = [e for e in remaining_emails if e != DEFAULT_EMAIL]
    
    if remaining_phones:
        print(f"[PDF MASKER] ⚠️ WARNING: {len(remaining_phones)} phone(s) still in output: {remaining_phones}")
    if remaining_emails:
        print(f"[PDF MASKER] ⚠️ WARNING: {len(remaining_emails)} email(s) still in output: {remaining_emails}")
