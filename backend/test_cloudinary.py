"""Test Cloudinary connection and upload capability"""
import cloudinary
import cloudinary.uploader
from cloudinary_helper import configure

print("=" * 60)
print("CLOUDINARY CONNECTION TEST")
print("=" * 60)

# Step 1: Configure
print("\n1. Configuring Cloudinary...")
try:
    configure()
    print("   ✅ Configuration successful!")
    print(f"   Cloud Name: {cloudinary.config().cloud_name}")
    print(f"   API Key: {cloudinary.config().api_key[:4]}***{cloudinary.config().api_key[-4:]}")
except Exception as e:
    print(f"   ❌ Configuration failed: {e}")
    exit(1)

# Step 2: Create a test text file
print("\n2. Creating test file...")
test_file = "test_upload.txt"
with open(test_file, 'w') as f:
    f.write("This is a Cloudinary connection test file.")
print(f"   ✅ Created {test_file}")

# Step 3: Test upload with the local file
print("\n3. Testing upload capability...")
try:
    result = cloudinary.uploader.upload(
        test_file,
        resource_type='raw',
        folder='test'
    )
    print("   ✅ Upload successful!")
    print(f"   Public ID: {result['public_id']}")
    print(f"   URL: {result['secure_url']}")
    print(f"   Size: {result['bytes']} bytes")
    print(f"   Format: {result.get('format', 'raw')}")
    
    # Step 4: Clean up
    print("\n4. Cleaning up...")
    cloudinary.uploader.destroy(result['public_id'], resource_type='raw')
    print("   ✅ Test file deleted from Cloudinary")
    
    import os
    os.remove(test_file)
    print(f"   ✅ Local {test_file} deleted")
    
except Exception as e:
    print(f"   ❌ Upload failed: {e}")
    exit(1)

print("\n" + "=" * 60)
print("✅ ALL CLOUDINARY TESTS PASSED!")
print("=" * 60)
