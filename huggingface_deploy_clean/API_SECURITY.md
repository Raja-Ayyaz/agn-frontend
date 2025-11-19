# 🛡️ AGN Job Bank - API Security for Hugging Face Deployment

## Overview
This Hugging Face deployment includes enterprise-grade security features for the AGN Job Bank API.

## Security Features Implemented

### 1. JWT (JSON Web Token) Authentication ✅

**What It Does:**
- Generates encrypted tokens for authenticated users
- Tokens expire after 24 hours
- Prevents session hijacking and replay attacks

**Token Structure:**
```json
{
  "user_id": "admin_user",
  "role": "admin",
  "username": "admin",
  "exp": "2025-11-19T12:00:00",
  "iat": "2025-11-18T12:00:00"
}
```

### 2. Rate Limiting ✅

**Protection Against:**
- Brute force attacks
- DDoS attacks
- API abuse

**Configuration:**
- Login endpoints: 5 requests per 60 seconds per IP
- General endpoints: 100 requests per 60 seconds per IP

### 3. Input Sanitization ✅

**Prevents:**
- XSS (Cross-Site Scripting) attacks
- SQL Injection
- HTML injection
- JavaScript injection

**Dangerous Patterns Blocked:**
```
- OR 1=1 / AND 1=1
- DROP TABLE
- DELETE FROM
- UNION SELECT
- <script> tags
- javascript: protocol
```

### 4. SQL Injection Protection ✅

**Features:**
- Parameterized queries
- Input validation
- Pattern detection for SQL injection attempts
- Automatic blocking of suspicious queries

### 5. CORS Security ✅

**Blocks:**
- Unauthorized domains
- Cross-site request forgery (CSRF)
- Unauthorized API access from external sites

### 6. File Upload Validation ✅

**Checks:**
- File type validation
- File size limits (3MB for CVs)
- Extension whitelist (.pdf, .docx only)
- Content validation

## Security Architecture

```
Client Request
    ↓
Rate Limiting → Check IP + endpoint limits
    ↓
CORS Check → Verify origin allowed
    ↓
Input Sanitize → Clean XSS, SQL injection
    ↓
Auth Required?
    ↓
Verify JWT Token → Check validity & expiration
    ↓
Check Role Permissions → admin/employer
    ↓
Process Request
```

## Environment Variables for Hugging Face

Set these in your Space's settings:

```env
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRATION_HOURS=24
```

## API Usage

### Login with JWT Token

**Admin Login:**
```bash
curl -X POST https://your-space.hf.space/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"yourpassword"}'
```

**Response:**
```json
{
  "ok": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "admin",
  "username": "admin"
}
```

### Protected API Call

Include the JWT token in the Authorization header:

```bash
curl -X GET https://your-space.hf.space/api/admin/dashboard/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Security Testing

### Test 1: Rate Limiting
Try logging in 10 times rapidly - after the 5th attempt, you should receive:
```json
{
  "ok": false,
  "error": "Rate limit exceeded. Please try again later."
}
```

### Test 2: SQL Injection Prevention
Query with SQL injection pattern - should be sanitized:
```bash
curl "https://your-space.hf.space/api/employees?search=admin'%20OR%20'1'='1"
```

### Test 3: Unauthorized Access
Try accessing protected endpoint without token - should return 401:
```bash
curl https://your-space.hf.space/api/admin/dashboard/stats
```

## Common Attack Vectors - PROTECTED ✅

| Attack Type | Status | Protection Method |
|-------------|--------|-------------------|
| SQL Injection | ✅ Protected | Parameterized queries + Input sanitization |
| XSS (Cross-Site Scripting) | ✅ Protected | HTML tag stripping + bleach library |
| CSRF (Cross-Site Request Forgery) | ✅ Protected | CORS configuration |
| Brute Force | ✅ Protected | Rate limiting (5 attempts/60s) |
| DDoS | ✅ Mitigated | Rate limiting + Connection pooling |
| Session Hijacking | ✅ Protected | JWT tokens with expiration |
| File Upload Malware | ✅ Protected | Extension whitelist + Size limits |
| Replay Attacks | ✅ Protected | Token expiration + Timestamps |
| Privilege Escalation | ✅ Protected | Role-based access control |

## Files Included

1. **security_middleware.py** - Security middleware module with JWT, rate limiting, and input validation
2. **full_api.py** - Main API with security integration
3. **requirements.txt** - Updated with security packages (PyJWT, bleach, cryptography)

## Dependencies

```
PyJWT==2.8.0       # JWT token generation and verification
bleach==6.1.0      # XSS prevention and input sanitization
cryptography==41.0.7  # Encryption utilities
```

## Production Recommendations

### For Hugging Face Spaces:

1. **Set JWT Secret as Environment Variable:**
   - Go to Space Settings → Repository secrets
   - Add: `JWT_SECRET=your-long-random-secret-key-here`

2. **Update CORS for Your Frontend:**
   - Modify allowed origins in `full_api.py` if needed

3. **Monitor Rate Limiting:**
   - Check logs for rate limit violations
   - Adjust limits based on legitimate traffic patterns

4. **Regular Security Updates:**
   - Keep dependencies updated: `pip install --upgrade PyJWT bleach cryptography`

## Status: 🛡️ SECURED

Your Hugging Face Space API is now protected against:
- ✅ SQL Injection
- ✅ XSS Attacks
- ✅ CSRF Attacks
- ✅ Brute Force
- ✅ DDoS (mitigated)
- ✅ Unauthorized Access
- ✅ Session Hijacking
- ✅ Malware Uploads
- ✅ API Abuse

## Support

For security issues or questions:
1. Check logs in Hugging Face Space dashboard
2. Review rate limiting patterns
3. Verify JWT secret is properly configured
4. Ensure all dependencies are installed correctly
