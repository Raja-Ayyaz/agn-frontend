import os
import sys

# Ensure the subdirectory with the API is on sys.path
HERE = os.path.dirname(__file__)
API_DIR = os.path.join(HERE, "huggingface_deploy_clean")
if API_DIR not in sys.path:
    sys.path.insert(0, API_DIR)

import importlib.util

# Import the Flask app object from the full_api module in huggingface_deploy_clean
full_api_path = os.path.join(API_DIR, "full_api.py")
if os.path.exists(full_api_path):
    spec = importlib.util.spec_from_file_location("full_api", full_api_path)
    if spec and spec.loader:
        module = importlib.util.module_from_spec(spec)
        try:
            spec.loader.exec_module(module)
            app = getattr(module, "app")
        except Exception as e:
            raise ImportError(f"Failed to execute module {full_api_path}: {e}")
    else:
        raise ImportError(f"Could not load spec for {full_api_path}")
else:
    raise ImportError(f"full_api.py not found at expected path: {full_api_path}")

__all__ = ["app"]
