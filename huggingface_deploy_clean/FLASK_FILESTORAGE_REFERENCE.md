# Flask FileStorage Save Method - Quick Reference

## Correct Usage

Flask's `FileStorage.save()` method accepts either:
1. **A file path (string)** - Opens file internally and writes
2. **An open file object** - Writes to the provided file object

## Our Issue

### ❌ Original (Broken) Code:
```python
tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
tmp.close()  # File handle is closed
storage_obj.save(tmp.name)  # Tries to write to path, but may fail on some systems
```

### ✅ Fixed Code:
```python
tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
storage_obj.save(tmp)  # Pass file object directly
tmp.flush()  # Ensure all buffered data is written
tmp.close()  # Close after writing
```

## Why the Fix Works

1. **File Object**: When you pass a file object, Flask writes directly to it
2. **Flush**: Ensures all buffered data in Python is written to the OS
3. **Close**: Properly closes the file descriptor after writing is complete

## Alternative (Also Works):
```python
tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
tmp.close()  # Close the handle
storage_obj.save(tmp.name)  # Flask opens the path, writes, and closes

# Verify
assert os.path.getsize(tmp.name) > 0
```

However, the file object approach is **more reliable** because:
- No race conditions with file paths
- Direct control over flushing
- Better error handling
- Clearer intent

## Flask Documentation Reference

From Flask documentation:
> `save(dst, buffer_size=16384)`
> 
> Save the file to a destination path or file object. If the destination is a file object you have to close it yourself after calling this method.

Source: https://flask.palletsprojects.com/en/2.3.x/api/#flask.FileStorage.save

## Our Implementation

We chose the **file object approach** with:
- ✅ Explicit `flush()` for data integrity
- ✅ Try-except with cleanup on errors
- ✅ File size validation after save
- ✅ Clear error messages

This ensures maximum reliability across different environments (local, Docker, Hugging Face Spaces).
