import zipfile, tempfile, shutil, os
from lxml import etree
from regix_pattren import PHONE_REGEX, EMAIL_REGEX

DEFAULT_PHONE = "+92-300-0000000"
DEFAULT_EMAIL = "hidden@email.com"

def mask_docx_xml_text(root_xml):
    ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}

    # Loop through every paragraph
    for para in root_xml.xpath("//w:p", namespaces=ns):
        texts = para.xpath(".//w:t", namespaces=ns)
        if not texts:
            continue

        # Merge all text runs
        full_text = "".join([t.text or "" for t in texts])

        # Replace ALL matches
        new_text = PHONE_REGEX.sub(DEFAULT_PHONE, full_text)
        new_text = EMAIL_REGEX.sub(DEFAULT_EMAIL, new_text)

        if new_text != full_text:
            texts[0].text = new_text
            for t in texts[1:]:
                t.text = ""  # clear extra runs


def mask_word_doc(input_docx_path, output_docx_path):
    tmpdir = tempfile.mkdtemp()
    try:
        # unzip docx
        with zipfile.ZipFile(input_docx_path, "r") as zin:
            zin.extractall(tmpdir)

        # process all XML inside word/
        word_dir = os.path.join(tmpdir, "word")
        for root, dirs, files in os.walk(word_dir):
            for fname in files:
                if fname.endswith(".xml"):
                    fpath = os.path.join(root, fname)
                    parser = etree.XMLParser(ns_clean=True, recover=True)
                    tree = etree.parse(fpath, parser)
                    root_xml = tree.getroot()

                    mask_docx_xml_text(root_xml)

                    tree.write(fpath, encoding="utf-8", xml_declaration=True, standalone="yes")

        # re-zip to docx
        with zipfile.ZipFile(output_docx_path, "w", zipfile.ZIP_DEFLATED) as zout:
            for folder, _, files in os.walk(tmpdir):
                for fname in files:
                    fullpath = os.path.join(folder, fname)
                    arcname = os.path.relpath(fullpath, tmpdir)
                    zout.write(fullpath, arcname)

        print(f"[WORD OK] {input_docx_path} → {output_docx_path}")
    finally:
        shutil.rmtree(tmpdir)
