---
title: AGN Job Bank API
emoji: 💼
colorFrom: yellow
colorTo: pink
sdk: docker
pinned: false
license: mit
app_port: 7860
---

# AGN Job Bank - Backend API

## Description
Professional job bank platform API for managing employee applications, employer hire requests, and CV processing with automatic PII masking.

## Features
- 📝 Employee application processing
- 🏢 Employer dashboard & hire requests
- 📄 Automated CV masking (removes phone numbers, emails)
- ☁️ Cloudinary integration for CV storage
- 🔒 Secure admin panel with JWT authentication
- 🛡️ Enterprise-grade API security (rate limiting, XSS/SQL injection prevention)
- 🚀 High-performance database connection pooling

## API Endpoints
- `POST /insert_employee` - Submit employee application
- `GET /api/employees` - Search employees
- `POST /api/hire-request` - Create hire request
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- And more...

## Environment Variables
Required environment variables (set in Hugging Face Spaces settings):
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `DB_SSL_CA` - SSL certificate path (optional)
- `Cloudinary_Cloud_Name` - Cloudinary cloud name
- `Cloudinary_API_Key` - Cloudinary API key
- `Cloudinary_API_Secret` - Cloudinary API secret
- `JWT_SECRET` - Secret key for JWT token generation (recommended)

## Tech Stack
- Python 3.14
- Flask 3.0
- PyMySQL with connection pooling
- PyMuPDF for PDF processing
- python-docx for Word documents
- Cloudinary for file storage
- PyJWT for authentication
- Bleach for input sanitization
- Cryptography for secure token handling

## Security Features
🛡️ This API includes enterprise-grade security:
- ✅ JWT authentication with 24-hour token expiry
- ✅ Rate limiting (prevents brute force attacks)
- ✅ Input sanitization (XSS prevention)
- ✅ SQL injection protection
- ✅ Role-based access control
- ✅ CORS security configuration

📖 See `API_SECURITY.md` for complete security documentation
