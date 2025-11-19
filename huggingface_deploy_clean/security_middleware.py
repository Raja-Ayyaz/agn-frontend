"""
Security Middleware for AGN Job Bank API
Provides JWT authentication, input validation, and rate limiting
"""

import jwt
import bleach
import re
import os
from functools import wraps
from datetime import datetime, timedelta
from flask import request, jsonify
from typing import Callable, Any, Dict

# Secret key for JWT (MUST be set via environment variable in production)
JWT_SECRET = os.environ.get('JWT_SECRET_KEY', 'agn_job_bank_secret_key_change_in_production')
if JWT_SECRET == 'agn_job_bank_secret_key_change_in_production':
    print("⚠️ WARNING: Using default JWT secret! Set JWT_SECRET_KEY environment variable in production!")

JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = int(os.environ.get('JWT_EXPIRATION_HOURS', 24))

# Rate limiting storage (in-memory, use Redis in production)
rate_limit_storage = {}

class SecurityMiddleware:
    """Security middleware for API protection"""
    
    @staticmethod
    def generate_token(user_id: str, role: str, username: str) -> str:
        """Generate JWT token for authenticated users"""
        payload = {
            'user_id': user_id,
            'role': role,
            'username': username,
            'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
            'iat': datetime.utcnow()
        }
        return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    
    @staticmethod
    def verify_token(token: str) -> Dict[str, Any]:
        """Verify and decode JWT token"""
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            return {'valid': True, 'payload': payload}
        except jwt.ExpiredSignatureError:
            return {'valid': False, 'error': 'Token expired'}
        except jwt.InvalidTokenError:
            return {'valid': False, 'error': 'Invalid token'}
    
    @staticmethod
    def require_auth(roles: list = None):
        """Decorator to require authentication for routes"""
        def decorator(f: Callable) -> Callable:
            @wraps(f)
            def decorated_function(*args, **kwargs):
                # Get token from Authorization header
                auth_header = request.headers.get('Authorization', '')
                
                if not auth_header.startswith('Bearer '):
                    return jsonify({'ok': False, 'error': 'Missing or invalid authorization header'}), 401
                
                token = auth_header.split('Bearer ')[1]
                result = SecurityMiddleware.verify_token(token)
                
                if not result['valid']:
                    return jsonify({'ok': False, 'error': result['error']}), 401
                
                payload = result['payload']
                
                # Check role if specified
                if roles and payload.get('role') not in roles:
                    return jsonify({'ok': False, 'error': 'Insufficient permissions'}), 403
                
                # Add user info to request context
                request.user = payload
                
                return f(*args, **kwargs)
            return decorated_function
        return decorator
    
    @staticmethod
    def rate_limit(max_requests: int = 100, window_seconds: int = 60):
        """Decorator to rate limit requests"""
        def decorator(f: Callable) -> Callable:
            @wraps(f)
            def decorated_function(*args, **kwargs):
                # Get client IP
                client_ip = request.remote_addr
                current_time = datetime.utcnow()
                
                # Create key for this IP and endpoint
                key = f"{client_ip}:{request.endpoint}"
                
                # Clean old entries
                if key in rate_limit_storage:
                    rate_limit_storage[key] = [
                        timestamp for timestamp in rate_limit_storage[key]
                        if (current_time - timestamp).total_seconds() < window_seconds
                    ]
                else:
                    rate_limit_storage[key] = []
                
                # Check rate limit
                if len(rate_limit_storage[key]) >= max_requests:
                    return jsonify({
                        'ok': False,
                        'error': 'Rate limit exceeded. Please try again later.'
                    }), 429
                
                # Add current request
                rate_limit_storage[key].append(current_time)
                
                return f(*args, **kwargs)
            return decorated_function
        return decorator
    
    @staticmethod
    def sanitize_input(data: Dict[str, Any]) -> Dict[str, Any]:
        """Sanitize input data to prevent XSS and injection attacks"""
        sanitized = {}
        
        for key, value in data.items():
            if isinstance(value, str):
                # Remove HTML tags and escape special characters
                sanitized[key] = bleach.clean(value, tags=[], strip=True)
                
                # Additional SQL injection prevention patterns
                dangerous_patterns = [
                    r'(\bOR\b|\bAND\b).*?=.*?',  # OR 1=1, AND 1=1
                    r';\s*DROP\s+TABLE',  # DROP TABLE
                    r';\s*DELETE\s+FROM',  # DELETE FROM
                    r'UNION\s+SELECT',  # UNION SELECT
                    r'<script',  # Script tags
                    r'javascript:',  # JavaScript protocol
                ]
                
                for pattern in dangerous_patterns:
                    if re.search(pattern, value, re.IGNORECASE):
                        sanitized[key] = ''  # Clear suspicious input
                        break
            else:
                sanitized[key] = value
        
        return sanitized
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))
    
    @staticmethod
    def validate_phone(phone: str) -> bool:
        """Validate phone number format"""
        # Allow various Pakistani phone formats
        pattern = r'^(\+92|92|0)?3[0-9]{9}$'
        clean_phone = re.sub(r'[\s\-\(\)]', '', phone)
        return bool(re.match(pattern, clean_phone))
    
    @staticmethod
    def validate_cnic(cnic: str) -> bool:
        """Validate Pakistani CNIC format"""
        pattern = r'^\d{5}-\d{7}-\d{1}$'
        return bool(re.match(pattern, cnic))
    
    @staticmethod
    def validate_file_upload(file, allowed_extensions: set, max_size_mb: int = 5) -> Dict[str, Any]:
        """Validate uploaded files"""
        if not file:
            return {'valid': False, 'error': 'No file provided'}
        
        # Check filename
        if not file.filename:
            return {'valid': False, 'error': 'No filename'}
        
        # Check extension
        ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
        if ext not in allowed_extensions:
            return {'valid': False, 'error': f'Invalid file type. Allowed: {", ".join(allowed_extensions)}'}
        
        # Check file size (read file to get size)
        file.seek(0, 2)  # Seek to end
        size = file.tell()
        file.seek(0)  # Reset to beginning
        
        max_size = max_size_mb * 1024 * 1024
        if size > max_size:
            return {'valid': False, 'error': f'File too large. Maximum size: {max_size_mb}MB'}
        
        return {'valid': True}
    
    @staticmethod
    def check_sql_injection(value: str) -> bool:
        """Check if input contains SQL injection patterns"""
        dangerous_patterns = [
            r"'.*?OR.*?'.*?=.*?'",
            r'".*?OR.*?".*?=.*?"',
            r';\s*DROP',
            r';\s*DELETE',
            r';\s*UPDATE',
            r'UNION.*?SELECT',
            r'/\*.*?\*/',
            r'--',
            r'xp_cmdshell',
        ]
        
        for pattern in dangerous_patterns:
            if re.search(pattern, value, re.IGNORECASE):
                return True
        return False
    
    @staticmethod
    def secure_cors(allowed_origins: list):
        """Configure secure CORS"""
        from flask_cors import CORS
        return CORS(
            allow_headers=['Content-Type', 'Authorization'],
            methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            origins=allowed_origins,
            supports_credentials=True
        )
