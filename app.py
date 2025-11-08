import os
import sys

# Ensure the subdirectory with the API is on sys.path
HERE = os.path.dirname(__file__)
API_DIR = os.path.join(HERE, "huggingface_deploy_clean")
if API_DIR not in sys.path:
    sys.path.insert(0, API_DIR)

# Import the Flask app object from the full_api module in huggingface_deploy_clean
try:
    from full_api import app  # type: ignore
except Exception as e:
    # If import fails, raise a helpful error so logs show the cause
    raise ImportError(f"Failed to import 'full_api.app' from {API_DIR}: {e}")

__all__ = ["app"]
