"""
Root shim that loads the real `full_api.py` from the `huggingface_deploy_clean` folder.

This exists so Gunicorn can import `full_api` (a common pattern) while the real
implementation lives in a subdirectory. It inserts the subdirectory into sys.path
and executes the module by file path so its local imports resolve correctly.
"""
import os
import sys
import importlib.util

HERE = os.path.dirname(__file__)
API_DIR = os.path.join(HERE, "huggingface_deploy_clean")

full_api_path = os.path.join(API_DIR, "full_api.py")
if not os.path.exists(full_api_path):
    raise ImportError(f"full_api.py not found at expected path: {full_api_path}")

# Ensure the module's directory is on sys.path so its local imports work
if API_DIR not in sys.path:
    sys.path.insert(0, API_DIR)

spec = importlib.util.spec_from_file_location("full_api_impl", full_api_path)
if spec is None or spec.loader is None:
    raise ImportError(f"Could not load spec for {full_api_path}")

module = importlib.util.module_from_spec(spec)
try:
    spec.loader.exec_module(module)
except Exception as e:
    raise ImportError(f"Failed to execute {full_api_path}: {e}")

# Export the Flask `app` object expected by Gunicorn
try:
    app = getattr(module, "app")
except AttributeError:
    raise ImportError(f"Module {full_api_path} does not define `app`")

__all__ = ["app"]
