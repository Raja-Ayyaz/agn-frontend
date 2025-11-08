#!/bin/bash
# Hugging Face Spaces Startup Script

# Print Python version
echo "🐍 Python version:"
python --version

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements_huggingface.txt

# Verify critical packages
echo "✅ Verifying installations..."
python -c "import flask; print(f'Flask: {flask.__version__}')"
python -c "import pymysql; print(f'PyMySQL: {pymysql.__version__}')"
python -c "import fitz; print('PyMuPDF: OK')"
python -c "import cloudinary; print('Cloudinary: OK')"

# Initialize database pool (test connection)
echo "🔧 Testing database connection..."
python -c "from db_conn import initialize_pool, get_pool_status; initialize_pool(); print('DB Pool:', get_pool_status())"

# Start the Flask application with Gunicorn
echo "🚀 Starting AGN Job Bank API..."
exec gunicorn --bind 0.0.0.0:7860 \
    --workers 2 \
    --threads 4 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile - \
    --log-level info \
    full_api:app
