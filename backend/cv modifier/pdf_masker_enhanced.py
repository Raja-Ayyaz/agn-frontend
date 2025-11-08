"""
Enhanced PDF masker that handles both text-based and image-based PDFs
Uses OCR to detect sensitive information in image-based PDFs
"""
import fitz
import os
from regix_pattren import PHONE_REGEX, EMAIL_REGEX

DEFAULT_PHONE = "+92-300-0000000"
DEFAULT_EMAIL = "hidden@email.com"

# Try to import OCR dependencies
try:
    from PIL import Image
    import pytesseract
    from pdf2image import convert_from_path
    OCR_AVAILABLE = True
except ImportError:
    OCR_AVAILABLE = False
    print("[PDF MASKER] Warning: OCR libraries not available. Image-based PDFs cannot be masked.")
    print("[PDF MASKER] Install with: pip install pytesseract Pillow pdf2image")


def mask_pdf_with_ocr(input_pdf, output_pdf):
    """
    Mask PDFs that contain images (like Canva PDFs) using OCR
    """
    if not OCR_AVAILABLE:
        raise Exception("OCR libraries not installed. Cannot mask image-based PDFs.")
    
    print(f"[PDF MASKER OCR] Processing image-based PDF: {input_pdf}")
    
    # Convert PDF pages to images
    try:
        images = convert_from_path(input_pdf, dpi=300)
    except Exception as e:
        raise Exception(f"Failed to convert PDF to images: {e}")
    
    # Open the PDF for editing
    doc = fitz.open(input_pdf)
    
    total_phones = 0
    total_emails = 0
    
    for page_num, (page, img) in enumerate(zip(doc, images), 1):
        print(f"[PDF MASKER OCR] Processing page {page_num} with OCR...")
        
        # Use OCR to get text and positions
        try:
            ocr_data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)
        except Exception as e:
            print(f"[PDF MASKER OCR] Warning: OCR failed on page {page_num}: {e}")
            continue
        
        # Get page dimensions for coordinate mapping
        page_rect = page.rect
        img_width, img_height = img.size
        
        # Scale factors to map image coordinates to PDF coordinates
        x_scale = page_rect.width / img_width
        y_scale = page_rect.height / img_height
        
        # Process each text element
        n_boxes = len(ocr_data['text'])
        for i in range(n_boxes):
            text = ocr_data['text'][i].strip()
            if not text:
                continue
            
            # Check if this text contains phone or email
            is_phone = PHONE_REGEX.search(text)
            is_email = EMAIL_REGEX.search(text)
            
            if is_phone or is_email:
                # Get bounding box from OCR
                x = ocr_data['left'][i]
                y = ocr_data['top'][i]
                w = ocr_data['width'][i]
                h = ocr_data['height'][i]
                
                # Convert image coordinates to PDF coordinates
                x0 = x * x_scale
                y0 = y * y_scale
                x1 = (x + w) * x_scale
                y1 = (y + h) * y_scale
                
                # Create rectangle for redaction
                rect = fitz.Rect(x0, y0, x1, y1)
                
                # Add white redaction
                page.add_redact_annot(rect, fill=(1, 1, 1))
                
                if is_phone:
                    print(f"[PDF MASKER OCR] Page {page_num}: Masking phone: {text}")
                    total_phones += 1
                if is_email:
                    print(f"[PDF MASKER OCR] Page {page_num}: Masking email: {text}")
                    total_emails += 1
        
        # Apply all redactions for this page
        if total_phones > 0 or total_emails > 0:
            page.apply_redactions()
    
    # Save the masked PDF
    doc.save(output_pdf)
    doc.close()
    
    print(f"[PDF MASKER OCR] ✅ Complete: {total_phones} phone(s) and {total_emails} email(s) masked")
    print(f"[PDF MASKER OCR] Output: {output_pdf}")


def mask_pdf(input_pdf, output_pdf):
    """
    Main masking function - automatically detects if PDF is text-based or image-based
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
        # Image-based PDF (like Canva)
        print(f"[PDF MASKER] Detected image-based PDF (text length: {total_text_length}, has images: {has_images})")
        if OCR_AVAILABLE:
            print(f"[PDF MASKER] Using OCR-based masking...")
            mask_pdf_with_ocr(input_pdf, output_pdf)
        else:
            print(f"[PDF MASKER] ⚠️ WARNING: Image-based PDF but OCR not available!")
            print(f"[PDF MASKER] Falling back to text-based masking (may not work properly)")
            mask_pdf_text_based(input_pdf, output_pdf)
    else:
        # Text-based PDF
        print(f"[PDF MASKER] Detected text-based PDF (text length: {total_text_length})")
        mask_pdf_text_based(input_pdf, output_pdf)


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

    doc.save(output_pdf)
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
