"""Simple Cloudinary helper to upload multiple files (PDFs) as raw resources.

Reads credentials from environment variables. Supported names (case-sensitive):
- Cloudinary_Cloud_Name or CLOUDINARY_CLOUD_NAME
- Cloudinary_API_Key or CLOUDINARY_API_KEY
- Cloudinary_API_Secret or CLOUDINARY_API_SECRET

If the env vars are missing, the module will try to parse a local `.env` file
in the same directory (simple KEY=VALUE parser).

Public API:
- upload_files(file_paths, folder=None) -> list[dict]
  Each dict contains: { 'path', 'public_id', 'secure_url', 'bytes', 'status', 'error' }
"""
from __future__ import annotations

import os
import typing as t

try:
    import cloudinary
    import cloudinary.uploader
except Exception as e:  # pragma: no cover - best-effort import
    raise ImportError("cloudinary package is required. Install with `pip install cloudinary`") from e


def _read_dotenv_file(env_path: str) -> dict:
    data: dict = {}
    try:
        with open(env_path, 'r', encoding='utf-8') as fh:
            for line in fh:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                if '=' not in line:
                    continue
                k, v = line.split('=', 1)
                data[k.strip()] = v.strip().strip('"').strip("'")
    except FileNotFoundError:
        pass
    return data


def _get_cred_from_env() -> dict:
    keys = {
        'cloud_name': ['Cloudinary_Cloud_Name', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_CLOUDNAME'],
        'api_key': ['Cloudinary_API_Key', 'CLOUDINARY_API_KEY'],
        'api_secret': ['Cloudinary_API_Secret', 'CLOUDINARY_API_SECRET'],
    }
    creds: dict = {}
    # load .env fallback
    cwd = os.path.dirname(__file__)
    dotenv = _read_dotenv_file(os.path.join(cwd, '.env'))

    for out_key, names in keys.items():
        val = None
        for name in names:
            val = os.environ.get(name) or dotenv.get(name)
            if val:
                break
        creds[out_key] = val
    return creds


def configure() -> None:
    """Configure cloudinary from environment or .env file.

    Raises RuntimeError if credentials are missing.
    """
    creds = _get_cred_from_env()
    if not creds.get('cloud_name') or not creds.get('api_key') or not creds.get('api_secret'):
        raise RuntimeError(
            'Cloudinary credentials not found in environment or .env. ' "Please set Cloudinary_Cloud_Name, Cloudinary_API_Key and Cloudinary_API_Secret."
        )

    cloudinary.config(
        cloud_name=creds['cloud_name'],
        api_key=creds['api_key'],
        api_secret=creds['api_secret'],
        secure=True,
    )


def upload_files(file_paths: t.Iterable[str], folder: t.Optional[str] = None) -> t.List[dict]:
    """Upload multiple files to Cloudinary as raw resources (suitable for PDFs).

    Args:
        file_paths: iterable of local file paths to upload.
        folder: optional Cloudinary folder to place uploads under.

    Returns:
        list of result dicts, each containing: path, public_id, secure_url, bytes, status, error
    """
    configure()
    results: t.List[dict] = []

    for p in file_paths:
        rec = { 'path': p, 'public_id': None, 'secure_url': None, 'bytes': None, 'status': 'error', 'error': None }
        try:
            if not os.path.exists(p):
                rec['error'] = 'file-not-found'
                results.append(rec)
                continue

            # Upload as raw (keeps PDF as-is). If you prefer transformations, change resource_type.
            opts = {'resource_type': 'raw'}
            if folder:
                opts['folder'] = folder

            resp = cloudinary.uploader.upload(p, **opts)

            rec['public_id'] = resp.get('public_id')
            rec['secure_url'] = resp.get('secure_url') or resp.get('url')
            rec['bytes'] = resp.get('bytes')
            rec['status'] = 'ok'
        except Exception as exc:
            rec['error'] = str(exc)
        results.append(rec)

    return results


def upload_file(path: str, folder: t.Optional[str] = None) -> dict:
    """Upload a single local file and return the first result dict (convenience).

    Returns a dict with keys similar to upload_files result entries.
    """
    res = upload_files([path], folder=folder)
    return res[0] if res else { 'path': path, 'status': 'error', 'error': 'no-result' }


def fetch_and_upload_url(url: str, folder: t.Optional[str] = None) -> dict:
    """Upload a remote file (by URL) directly to Cloudinary and return the upload response dict.

    Cloudinary supports uploading by remote URL; we call cloudinary.uploader.upload with
    the remote URL and resource_type='raw' so PDFs are preserved.
    """
    configure()
    try:
        opts = {'resource_type': 'raw'}
        if folder:
            opts['folder'] = folder
        resp = cloudinary.uploader.upload(url, **opts)
        return {
            'path': url,
            'public_id': resp.get('public_id'),
            'secure_url': resp.get('secure_url') or resp.get('url'),
            'bytes': resp.get('bytes'),
            'status': 'ok',
            'error': None,
        }
    except Exception as exc:
        return { 'path': url, 'status': 'error', 'error': str(exc) }


if __name__ == '__main__':
    import sys

    if len(sys.argv) < 2:
        print('Usage: python cloudinary_helper.py <file1.pdf> [file2.pdf ...]')
        raise SystemExit(2)

    res = upload_files(sys.argv[1:])
    for r in res:
        print(r)
