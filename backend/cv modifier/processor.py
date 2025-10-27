import os, mimetypes
from pdf_masker import mask_pdf
from word_masker import mask_word_doc

def process_file(input_path, output_path):
    ext = os.path.splitext(input_path)[1].lower()
    if ext == ".pdf":
        mask_pdf(input_path, output_path)
    elif ext == ".docx":
        mask_word_doc(input_path, output_path)
    else:
        mime, _ = mimetypes.guess_type(input_path)
        if mime == "application/pdf":
            mask_pdf(input_path, output_path)
        elif mime == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            mask_word_doc(input_path, output_path)
        else:   
            print(f"[SKIP] Unsupported: {input_path}")
