"""Small CLI to upload multiple PDFs to Cloudinary using cloudinary_helper.

Usage examples:
  python upload_to_cloudinary.py file1.pdf file2.pdf
  python upload_to_cloudinary.py  # then be prompted for comma-separated paths
"""
from __future__ import annotations

import sys
from pathlib import Path
from cloudinary_helper import upload_files


def main(argv: list[str] | None = None) -> int:
    argv = list(argv) if argv is not None else list(sys.argv)
    paths: list[str] = []
    if len(argv) > 1:
        paths = argv[1:]
    else:
        raw = input("Enter file paths (comma-separated) or drag files here: ").strip()
        if not raw:
            print("No files provided — exiting")
            return 2
        paths = [p.strip().strip('"') for p in raw.split(',') if p.strip()]

    # normalize
    paths = [str(Path(p).resolve()) for p in paths]

    print(f"Uploading {len(paths)} files to Cloudinary...")
    results = upload_files(paths)

    for r in results:
        if r.get('status') == 'ok':
            print(f"OK: {r['path']} -> {r['secure_url']} (public_id={r['public_id']})")
        else:
            print(f"ERR: {r['path']} -> {r.get('error')}")

    return 0


if __name__ == '__main__':
    raise SystemExit(main())
