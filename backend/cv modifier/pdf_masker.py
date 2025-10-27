import fitz
from regix_pattren import PHONE_REGEX, EMAIL_REGEX

DEFAULT_PHONE = "+92-300-0000000"
DEFAULT_EMAIL = "hidden@email.com"

def mask_pdf(input_pdf, output_pdf):
    doc = fitz.open(input_pdf)

    for page in doc:
        text = page.get_text("text")

        replacements = []  # collect rect + dummy

        # Phones – replace ALL, not just first
        for p in PHONE_REGEX.findall(text):
            for rect in page.search_for(p):
                page.add_redact_annot(rect, fill=(1,1,1))
                replacements.append((rect, DEFAULT_PHONE))

        # Emails
        for e in EMAIL_REGEX.findall(text):
            for rect in page.search_for(e):
                page.add_redact_annot(rect, fill=(1,1,1))
                replacements.append((rect, DEFAULT_EMAIL))

        if replacements:
            # Apply all redactions once
            page.apply_redactions()

            # Insert dummy replacements
            for rect, dummy in replacements:
                x = rect.x0 + 1
                y = rect.y1 - 2
                page.insert_text((x, y), dummy, fontsize=9, fontname="helv", color=(0,0,0))

    doc.save(output_pdf)
    doc.close()
    print(f"[PDF OK] {input_pdf} → {output_pdf}")
