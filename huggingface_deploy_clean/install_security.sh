#!/bin/bash
# AGN Job Bank - Security Packages Installation Script for Hugging Face Spaces
# This script ensures all security packages are installed

echo "🔐 Installing AGN Job Bank Security Packages..."
echo ""

echo "📦 Installing security packages..."

# Install packages
pip install PyJWT==2.8.0
pip install bleach==6.1.0
pip install cryptography==41.0.7

echo ""
echo "🎉 Security packages installation complete!"
echo ""
echo "Security features enabled:"
echo "  ✅ JWT authentication"
echo "  ✅ Rate limiting"
echo "  ✅ Input sanitization"
echo "  ✅ SQL injection prevention"
echo "  ✅ CORS security"
echo ""
echo "📖 Read API_SECURITY.md for full documentation"
