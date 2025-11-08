import os
import sys
import importlib.util
import traceback

# Robust loader for the Flask `app` object. Try a small list of candidate locations
# so the container doesn't fail if the HF build used a branch/layout that omitted
# the `huggingface_deploy_clean` folder. The candidates are tried in order:
#  1. huggingface_deploy_clean/full_api.py
#  2. full_api.py (repo root)
#  3. backend/full_api.py

HERE = os.path.dirname(__file__)
candidate_paths = [
    os.path.join(HERE, "huggingface_deploy_clean", "full_api.py"),
    os.path.join(HERE, "full_api.py"),
    os.path.join(HERE, "backend", "full_api.py"),
]

last_exc = None
app = None
for p in candidate_paths:
    try:
        if not os.path.exists(p):
            # Not present in the image/build context
            continue

        # Attempt to load by file path to preserve local imports
        spec = importlib.util.spec_from_file_location("full_api_impl", p)
        if spec is None or spec.loader is None:
            raise ImportError(f"Could not create spec for {p}")
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        # Expect the module to define `app` (Flask instance)
        if hasattr(module, "app"):
            app = getattr(module, "app")
            print(f"[app loader] Loaded Flask app from: {p}")
            break
        else:
            raise ImportError(f"Module {p} did not define `app`")
    except Exception as e:
        last_exc = e
        # print traceback to help runtime debugging in the Space logs
        try:
            traceback.print_exc()
        except Exception:
            pass

if app is None:
    candidates = ", ".join(candidate_paths)
    raise ImportError(f"Could not locate and load a `full_api` app. Tried: {candidates}. Last error: {last_exc}")

__all__ = ["app"]
