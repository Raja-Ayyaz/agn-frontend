import os, mimetypes, sys

# Add the current directory to sys.path so imports work
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from pdf_masker import mask_pdf
from word_masker import mask_word_doc


def process_file(input_path, output_path, upload_to_cloud: bool = False):
    """Process (mask) an input file and write to output_path.

    If upload_to_cloud is True, the function will attempt to upload the
    resulting output file to Cloudinary (requires cloudinary_helper to be
    configured via env or backend/.env).
    """
    ext = os.path.splitext(input_path)[1].lower()
    handled = False
    if ext == ".pdf":
        mask_pdf(input_path, output_path)
        handled = True
    elif ext == ".docx":
        mask_word_doc(input_path, output_path)
        handled = True
    else:
        mime, _ = mimetypes.guess_type(input_path)
        if mime == "application/pdf":
            mask_pdf(input_path, output_path)
            handled = True
        elif mime == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            mask_word_doc(input_path, output_path)
            handled = True
        else:
            print(f"[SKIP] Unsupported: {input_path}")

    # optionally upload the processed output
    if handled and upload_to_cloud:
        try:
            # lazy import to avoid adding cloudinary dependency for consumers who don't use uploads
            from cloudinary_helper import upload_files

            res = upload_files([output_path])
            if res and res[0].get('status') == 'ok':
                print(f"[UPLOAD] Uploaded to Cloudinary: {res[0].get('secure_url')}")
            else:
                print(f"[UPLOAD] Failed: {res[0].get('error') if res else 'unknown'}")
        except Exception as exc:
            print(f"[UPLOAD] Error while uploading to Cloudinary: {exc}")
