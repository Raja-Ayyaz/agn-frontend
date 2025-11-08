"""Shim module to expose `process_file` at package-level as `processor.process_file`.

This file dynamically loads the real processor implementation which in this repo
is located under the folder named "cv modifier" (note the space). That path is
not a valid Python package name, so importing it directly fails for tools like
Pylance. This shim resolves the real file by path and re-exports the expected
symbol so `from processor import process_file` works.

If you ever move `cv modifier/processor.py` into a normal package, you can
remove this shim.
"""
from __future__ import annotations

import importlib.util
import os
import sys
from typing import Any


def _load_processor_module() -> Any:
    # location of this shim
    base = os.path.dirname(__file__)
    # the original file in the repo is in the folder named "cv modifier"
    candidate = os.path.join(base, "cv modifier", "processor.py")
    if not os.path.exists(candidate):
        raise ImportError(f"processor implementation not found at: {candidate}")

    spec = importlib.util.spec_from_file_location("_cv_modifier_processor", candidate)
    if spec is None or spec.loader is None:
        raise ImportError(f"Unable to load processor spec from: {candidate}")
    mod = importlib.util.module_from_spec(spec)
    # execute module
    spec.loader.exec_module(mod)
    return mod


_mod = None
try:
    _mod = _load_processor_module()
except Exception as exc:  # pragma: no cover - friendly runtime error
    # Defer raising until someone actually tries to call process_file so tooling
    # (linters / editors) can still import this module successfully.
    _load_error = exc
else:
    _load_error = None


def process_file(src_path: str, out_path: str, *args, **kwargs):
    """Proxy to the actual process_file implementation.

    Raises ImportError with helpful message if the underlying module couldn't be
    loaded.
    """
    if _load_error:
        raise ImportError(f"Failed to load processor implementation: {_load_error}")
    func = getattr(_mod, "process_file", None)
    if func is None:
        raise ImportError("Loaded processor module does not define 'process_file'")
    return func(src_path, out_path, *args, **kwargs)


__all__ = ["process_file"]
