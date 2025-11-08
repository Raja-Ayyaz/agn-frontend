"""
Test script to verify the apply form flow:
1. CV upload
2. Masking process
3. Cloudinary upload
4. Database insertion

Run this after starting the Flask server to test the complete flow.
"""
import requests
import os

# Test configuration
API_URL = "http://localhost:8000/insert_employee"
TEST_CV_PATH = "cv modifier/pdf_samples"  # Adjust if you have test PDFs

def test_insert_employee():
    """Test the complete employee insertion flow"""
    
    # Sample employee data
    employee_data = {
        "name": "Test Employee",
        "age": "25",
        "email": "test@example.com",
        "mobile_no": "1234567890",
        "location": "Test City",
        "nearest_route": "Test Route",
        "cnic_no": "12345-1234567-1",
        "educational_profile": "Bachelor's Degree",
        "recent_completed_education": "Computer Science",
        "applying_for": "Software Developer",
        "experience": "2 years",
        "experience_detail": "Python, JavaScript, React",
    }
    
    # Find a test PDF file
    test_pdf = None
    if os.path.exists(TEST_CV_PATH):
        for file in os.listdir(TEST_CV_PATH):
            if file.endswith('.pdf'):
                test_pdf = os.path.join(TEST_CV_PATH, file)
                break
    
    if not test_pdf or not os.path.exists(test_pdf):
        print("❌ No test PDF found. Please provide a test CV file.")
        print(f"   Looking in: {TEST_CV_PATH}")
        return False
    
    print(f"✅ Found test CV: {test_pdf}")
    print(f"📤 Sending request to: {API_URL}")
    print(f"📋 Employee: {employee_data['name']} ({employee_data['email']})")
    
    # Prepare multipart form data
    files = {
        'cv': open(test_pdf, 'rb')
    }
    
    try:
        # Send POST request
        response = requests.post(API_URL, data=employee_data, files=files)
        
        print(f"\n📡 Response Status: {response.status_code}")
        print(f"📄 Response Body: {response.text}\n")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('ok'):
                print("✅ SUCCESS! Employee inserted successfully")
                print(f"   Employee ID: {data.get('employee_id')}")
                print(f"   Original CV: {data.get('cv_url')}")
                print(f"   Masked CV: {data.get('masked_cv_url')}")
                return True
            else:
                print(f"❌ API Error: {data.get('error')}")
                return False
        else:
            print(f"❌ HTTP Error: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
        return False
    finally:
        files['cv'].close()

def check_server():
    """Check if the Flask server is running"""
    try:
        response = requests.get("http://localhost:8000/api/health")
        if response.status_code == 200:
            print("✅ Server is running")
            return True
        else:
            print("❌ Server responded with error")
            return False
    except:
        print("❌ Server is not running. Please start it with: python full_api.py")
        return False

if __name__ == "__main__":
    print("="*60)
    print("Testing Apply Form Flow")
    print("="*60)
    print()
    
    if check_server():
        print()
        test_insert_employee()
    
    print()
    print("="*60)
