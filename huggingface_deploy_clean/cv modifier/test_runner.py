# test_runner.py
import os
from processor import process_file

INPUT_DIR = "pdf_samples"    # put mixed .pdf and .docx files here
OUTPUT_DIR = "outputs"

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

def main():
    files = [f for f in os.listdir(INPUT_DIR) if not f.startswith(".")]
    if not files:
        print("No test files found in pdf_samples/. Put .pdf/.docx files there.")
        return

    for filename in files:
        inp = os.path.join(INPUT_DIR, filename)
        out = os.path.join(OUTPUT_DIR, f"masked_{filename}")
        print(f"Processing: {filename}")
        try:
            process_file(inp, out)
        except Exception as e:
            print(f"ERROR processing {filename}: {e}")

if __name__ == "__main__":
    main()
