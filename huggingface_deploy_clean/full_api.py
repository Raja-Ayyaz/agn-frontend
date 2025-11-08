# full_api.py
"""
Full REST API bridging your frontend and backend logic.

- Keeps original backend modules intact (processor.py, pdf_masker.py, word_masker.py).
- Uses cloudinary_helper for uploads.
- Provides endpoints:
    GET  /api/health
    POST /insert_employee              (keeps compatibility with current react: http://localhost:8000/insert_employee)
    POST /api/upload_employee          (same as above; accepts FormData or JSON with cv_url)
    GET  /api/employees                (search/list; supports query params)
    GET  /api/employee/<id>            (single employee record)
    POST /api/employee/<id>/update_cv  (upload new CV / cv_url for an existing employee)
"""

import os
import tempfile
import traceback
from typing import List, Dict, Any

from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import fitz  # PyMuPDF for PDF validation

# Compatibility shim: pkgutil.get_loader was removed in newer Python versions (3.12+).
# Some older Flask/Werkzeug versions call pkgutil.get_loader; if it's missing, add a safe
# fallback so the app can start. This keeps the rest of the code unchanged.
import pkgutil
if not hasattr(pkgutil, 'get_loader'):
    def _pkgutil_get_loader(name):
        return None
    pkgutil.get_loader = _pkgutil_get_loader

# Import connection pool instead of mysql.connector directly
from db_conn import get_db_connection, initialize_pool

# reuse masking pipeline (existing file in your repo). :contentReference[oaicite:3]{index=3}
from processor import process_file

# cloudinary helper we added. :contentReference[oaicite:4]{index=4}
from cloudinary_helper import upload_file, fetch_and_upload_url

# Allowed extensions
ALLOWED_EXT = {".pdf", ".docx"}

# Initialize database connection pool at startup
print("🔧 Initializing database connection pool...")
try:
    initialize_pool()
    print("✅ Database connection pool ready")
except Exception as e:
    print(f"⚠️ Warning: Could not initialize pool: {e}")
    print("ℹ️ Connections will be created on-demand")


app = Flask(__name__)
CORS(app)  # allow requests from your frontend during development
app.config["MAX_CONTENT_LENGTH"] = 30 * 1024 * 1024  # 30MB max default


def allowed_file(filename: str) -> bool:
    return os.path.splitext(filename)[1].lower() in ALLOWED_EXT


def save_temp_file(storage_obj, filename_hint: str) -> str:
    """Save uploaded file to a temporary file and return the path.
    
    Args:
        storage_obj: Flask FileStorage object (from request.files)
        filename_hint: Original filename to extract extension
    
    Returns:
        Path to the saved temporary file
    """
    suffix = os.path.splitext(filename_hint)[1] or ""
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    
    # Don't close yet - save directly to the open file object
    try:
        storage_obj.save(tmp)
        tmp.flush()  # Ensure all data is written to disk
        tmp.close()  # Now close the file
        
        # Verify file was written and has content
        if not os.path.exists(tmp.name):
            raise Exception(f"Failed to save file to temp location: {tmp.name}")
        
        file_size = os.path.getsize(tmp.name)
        if file_size == 0:
            os.unlink(tmp.name)  # Clean up empty file
            raise Exception(f"Uploaded file is empty: {filename_hint}")
        
        print(f"[save_temp_file] Saved {filename_hint} to {tmp.name} ({file_size} bytes)")
        return tmp.name
    except Exception as e:
        # Clean up on error
        try:
            tmp.close()
            if os.path.exists(tmp.name):
                os.unlink(tmp.name)
        except Exception:
            pass
        raise


def is_image_only_pdf(file_path: str, text_threshold: int = 20) -> bool:
    """Check if a PDF is image-only (like Canva exports).
    
    Returns True if the PDF has less than text_threshold characters of text.
    These PDFs can't be properly masked and cause file size bloat.
    """
    try:
        doc = fitz.open(file_path)
        total_text = ""
        for page in doc:
            total_text += page.get_text()
        doc.close()
        
        char_count = len(total_text.strip())
        print(f"[is_image_only_pdf] {file_path} has {char_count} characters")
        return char_count < text_threshold
    except Exception as e:
        print(f"[is_image_only_pdf] Error checking PDF: {e}")
        return False  # Allow non-PDF files or if check fails


def download_remote_to_temp(url: str) -> str:
    import requests
    r = requests.get(url, stream=True, timeout=30)
    r.raise_for_status()
    ct = r.headers.get("Content-Type", "")
    suffix = ""
    if "pdf" in ct:
        suffix = ".pdf"
    elif "officedocument" in ct or "word" in ct or "docx" in ct:
        suffix = ".docx"
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
    with open(tmp.name, "wb") as f:
        for chunk in r.iter_content(chunk_size=8192):
            if chunk:
                f.write(chunk)
    return tmp.name


def rows_to_dicts(cursor, rows) -> List[Dict[str, Any]]:
    cols = [d[0] for d in cursor.description] if cursor.description else []
    result = []
    for r in rows:
        obj = {}
        for i, c in enumerate(cols):
            obj[c] = r[i]
        result.append(obj)
    return result


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"ok": True, "service": "full_api"})


# --- Authentication helpers (adapted from main.py) ---------------------------------
def _sha256(text: str) -> str:
    import hashlib

    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def check_admin_credentials(username: str, password: str) -> bool:
    """Return True if username/password match an entry in admin table.

    Accepts plaintext or SHA-256 hashed stored values (backwards compatible).
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT password FROM admin WHERE user_name = %s LIMIT 1", (username,))
            row = cursor.fetchone()
            cursor.close()
            
            if not row:
                return False
            stored = row[0] or ""
            if password == stored:
                return True
            if _sha256(password) == stored:
                return True
            return False
    except Exception:
        return False


def check_employer_credentials(username: str, password: str):
    """Return tuple (employer_id, role) if credentials valid, otherwise None.

    Tries plaintext, truncated plaintext (VARCHAR(15) legacy), and SHA-256. Also returns
    the `role` column from the employer table so the caller can decide routing.
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT employer_id, password, role FROM employer WHERE username = %s LIMIT 1", (username,))
            row = cursor.fetchone()
            cursor.close()
            
            if not row:
                return None
            employer_id = row[0]
            stored = row[1] or ""
            role = (row[2] or "").lower()
            if password == stored:
                return (int(employer_id), role)
            if len(password) > 15 and password[:15] == stored:
                return (int(employer_id), role)
            if _sha256(password) == stored:
                return (int(employer_id), role)
            return None
    except Exception:
        return None


@app.route("/api/admin/login", methods=["POST"])
def api_admin_login():
    """Admin login endpoint. Expects JSON {username, password}."""
    try:
        data = request.get_json(silent=True) or {}
        username = (data.get("username") or "").strip()
        password = (data.get("password") or "").strip()
        if not username or not password:
            return jsonify({"ok": False, "error": "username and password required"}), 400
        ok = check_admin_credentials(username, password)
        if ok:
            return jsonify({"ok": True})
        return jsonify({"ok": False, "error": "invalid credentials"}), 401
    except Exception as e:
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500


@app.route("/api/employer/login", methods=["POST"])
def api_employer_login():
    """Employer login. Expects JSON {username, password}. Returns employer_id on success."""
    try:
        data = request.get_json(silent=True) or {}
        username = (data.get("username") or "").strip()
        password = (data.get("password") or "").strip()
        if not username or not password:
            return jsonify({"ok": False, "error": "username and password required"}), 400
        emp = check_employer_credentials(username, password)
        if emp:
            # check_employer_credentials now returns (employer_id, role)
            emp_id, role = emp
            return jsonify({"ok": True, "employer_id": int(emp_id), "role": role})
        return jsonify({"ok": False, "error": "invalid credentials"}), 401
    except Exception as e:
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500


@app.route("/api/employer/signup", methods=["POST"])
def api_employer_signup():
    """Create a new employer account.

    Accepts JSON with: username, comapny_name, email, password
    Mimics the behavior of `insert_employeer_signup` but non-interactive and returns the inserted id.
    Sets default role to 'user' and checks for duplicate emails.
    """
    try:
        data = request.get_json(silent=True) or {}
        username = (data.get("username") or "").strip()
        company_name = (data.get("comapny_name") or data.get("company_name") or "").strip()
        email = (data.get("email") or "").strip()
        password_raw = (data.get("password") or "").strip()
        # Optional contact fields: phone, location, referance (note: database column is `referance`)
        phone = (data.get("phone") or "").strip()
        location = (data.get("location") or "").strip()
        referance = (data.get("referance") or data.get("reference") or "").strip()

        if not username or not password_raw:
            return jsonify({"ok": False, "error": "username and password are required"}), 400
        
        if not email:
            return jsonify({"ok": False, "error": "email is required"}), 400

        with get_db_connection() as conn:
            cursor = conn.cursor()

            # Check for duplicate email
            cursor.execute("SELECT employer_id FROM employer WHERE email = %s", (email,))
            existing = cursor.fetchone()
            if existing:
                cursor.close()
                return jsonify({"ok": False, "error": "Email already exists"}), 400

            use_hash = os.environ.get("AGN_USE_HASH", "false").lower() in ("1", "true", "yes")
            if use_hash:
                password_to_store = _sha256(password_raw)
                if len(password_to_store) > 15:
                    cursor.close()
                    return (
                        jsonify({
                            "ok": False,
                            "error": "hashed password length (64) exceeds employer.password column size. Set AGN_USE_HASH=0 or increase column size to VARCHAR(255).",
                        }),
                        400,
                    )
            else:
                # truncate to 15 chars to match legacy DB if necessary
                if len(password_raw) > 15:
                    password_to_store = password_raw[:15]
                else:
                    password_to_store = password_raw

            # Insert with default role 'user' and include optional contact fields (phone, location, referance)
            cursor.execute(
                "INSERT INTO employer (username, comapny_name, email, password, role, phone, location, referance) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                (username, company_name, email, password_to_store, "user", phone, location, referance),
            )
            inserted_id = cursor.lastrowid
            cursor.close()
            
            return jsonify({"ok": True, "employer_id": inserted_id})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500


@app.route("/api/employers", methods=["GET"])
def api_list_employers():
    """List all employers/companies from the employer table.
    
    Returns all columns except password for security.
    Frontend can filter by role if needed.
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Select useful columns (excluding password). Include phone, location and referance.
            cursor.execute("""
                SELECT employer_id, username, comapny_name, email, role, phone, location, referance
                FROM employer
                ORDER BY employer_id DESC
            """)
            
            rows = cursor.fetchall()
            result = rows_to_dicts(cursor, rows)
            cursor.close()
            
            return jsonify({"ok": True, "count": len(result), "rows": result})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500


@app.route("/api/hire-request", methods=["POST"])
def api_create_hire_request():
    """Create a new hire request.
    
    Accepts JSON with: employer_id, employee_id, message
    Inserts into hire_request table with status='pending'
    """
    try:
        data = request.get_json(silent=True) or {}
        employer_id = data.get("employer_id")
        employee_id = data.get("employee_id")
        message = (data.get("message") or "").strip()
        
        if not employer_id or not employee_id:
            return jsonify({"ok": False, "error": "employer_id and employee_id are required"}), 400
        
        if not message:
            return jsonify({"ok": False, "error": "message is required"}), 400
        
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Check if request already exists (unique constraint on employer_id, employee_id)
            cursor.execute("""
                SELECT request_id, status FROM hire_request 
                WHERE employer_id = %s AND employee_id = %s
            """, (employer_id, employee_id))
            existing = cursor.fetchone()
            
            if existing:
                cursor.close()
                return jsonify({
                    "ok": False, 
                    "error": f"A hire request already exists for this candidate (Status: {existing[1]})"
                }), 400
            
            # Insert new hire request
            cursor.execute("""
                INSERT INTO hire_request (employer_id, employee_id, message, status)
                VALUES (%s, %s, %s, 'pending')
            """, (employer_id, employee_id, message))
            
            request_id = cursor.lastrowid
            cursor.close()
            
            return jsonify({"ok": True, "request_id": request_id, "status": "pending"})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500


@app.route("/api/hire-requests/<int:employer_id>", methods=["GET"])
def api_get_employer_hire_requests(employer_id):
    """Get all hire requests for a specific employer.
    
    Returns hire requests with employee details joined from employees table.
    Ordered by request_date descending (newest first).
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Join with employees table to get candidate details
            cursor.execute("""
                SELECT 
                    hr.request_id,
                    hr.employer_id,
                    hr.employee_id,
                    hr.status,
                    hr.request_date,
                    hr.response_date,
                    hr.message,
                    e.name as employee_name,
                    e.field as employee_field,
                    e.location as employee_location,
                    e.experience as employee_experience,
                    e.email as employee_email
                FROM hire_request hr
                INNER JOIN employees e ON hr.employee_id = e.employee_id
                WHERE hr.employer_id = %s
                ORDER BY hr.request_date DESC
            """, (employer_id,))
            
            rows = cursor.fetchall()
            result = rows_to_dicts(cursor, rows)
            cursor.close()
            
            return jsonify({"ok": True, "count": len(result), "requests": result})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500


@app.route("/api/admin/hire-requests", methods=["GET"])
def api_get_all_hire_requests():
    """Get all hire requests for admin panel.
    
    Returns all hire requests with employer and employee details joined.
    Ordered by request_date descending (newest first).
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Join with both employees and employer tables to get full details
            cursor.execute("""
                SELECT 
                    hr.request_id,
                    hr.employer_id,
                    hr.employee_id,
                    hr.status,
                    hr.request_date,
                    hr.response_date,
                    hr.message,
                    e.name as employee_name,
                    e.field as employee_field,
                    e.location as employee_location,
                    e.experience as employee_experience,
                    e.email as employee_email,
                    emp.username as employer_username,
                    emp.comapny_name as employer_company,
                    emp.email as employer_email
                FROM hire_request hr
                INNER JOIN employees e ON hr.employee_id = e.employee_id
                INNER JOIN employer emp ON hr.employer_id = emp.employer_id
                ORDER BY hr.request_date DESC
            """)
            
            rows = cursor.fetchall()
            result = rows_to_dicts(cursor, rows)
            cursor.close()
            
            return jsonify({"ok": True, "count": len(result), "requests": result})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500


@app.route("/api/admin/hire-request/respond", methods=["POST"])
def api_respond_to_hire_request():
    """Admin responds to a hire request (accept or reject).
    
    Accepts JSON with: request_id, status ('accepted' or 'rejected'), response_message
    Updates the hire request status, response_date, and replaces message with response_message.
    """
    try:
        data = request.get_json(silent=True) or {}
        request_id = data.get("request_id")
        status = data.get("status")
        response_message = (data.get("response_message") or "").strip()
        
        if not request_id:
            return jsonify({"ok": False, "error": "request_id is required"}), 400
        
        if status not in ['accepted', 'rejected']:
            return jsonify({"ok": False, "error": "status must be 'accepted' or 'rejected'"}), 400
        
        if not response_message:
            return jsonify({"ok": False, "error": "response_message is required"}), 400
        
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Check if request exists and is pending
            cursor.execute("SELECT status FROM hire_request WHERE request_id = %s", (request_id,))
            existing = cursor.fetchone()
            
            if not existing:
                cursor.close()
                return jsonify({"ok": False, "error": "Hire request not found"}), 404
            
            if existing[0] != 'pending':
                cursor.close()
                return jsonify({"ok": False, "error": f"Request has already been {existing[0]}"}), 400
            
            # Update the request with response - replace message with response_message
            cursor.execute("""
                UPDATE hire_request 
                SET status = %s, response_date = CURRENT_TIMESTAMP, message = %s
                WHERE request_id = %s
            """, (status, response_message, request_id))
            
            cursor.close()
            
            return jsonify({"ok": True, "request_id": request_id, "status": status})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500


@app.route("/api/admin/dashboard/stats", methods=["GET"])
def api_get_dashboard_stats():
    """Get dashboard statistics for admin panel.
    
    Returns counts for employees, companies, hire requests, and CVs processed.
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Total Employees
            cursor.execute("SELECT COUNT(*) FROM employees")
            total_employees = cursor.fetchone()[0]
            
            # Active Companies (employers with role='user')
            cursor.execute("SELECT COUNT(*) FROM employer WHERE role = 'user'")
            active_companies = cursor.fetchone()[0]
            
            # Pending Hire Requests
            cursor.execute("SELECT COUNT(*) FROM hire_request WHERE status = 'pending'")
            pending_requests = cursor.fetchone()[0]
            
            # CVs Processed (employees with masked_cv)
            cursor.execute("SELECT COUNT(*) FROM employees WHERE masked_cv IS NOT NULL AND masked_cv != ''")
            cvs_processed = cursor.fetchone()[0]
            
            cursor.close()
            
            return jsonify({
                "ok": True,
                "stats": {
                    "total_employees": total_employees,
                    "active_companies": active_companies,
                    "pending_requests": pending_requests,
                    "cvs_processed": cvs_processed
                }
            })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500


@app.route("/api/admin/dashboard/recent-activity", methods=["GET"])
def api_get_recent_activity():
    """Get recent activity for admin dashboard.
    
    Returns the most recent employee, company, and pending hire request only.
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            activities = []
            
            # Most recent employee (last 1 only) - using created_at timestamp
            cursor.execute("""
                SELECT employee_id, name, field, created_at
                FROM employees
                ORDER BY created_at DESC, employee_id DESC
                LIMIT 1
            """)
            employee = cursor.fetchone()
            if employee:
                activities.append({
                    "type": "employee",
                    "id": employee[0],
                    "name": employee[1] or "Unknown",
                    "detail": employee[2] or "N/A",
                    "timestamp": employee[3].isoformat() if employee[3] else None
                })
            
            # Most recent company (last 1 only) - using created_at timestamp
            cursor.execute("""
                SELECT employer_id, username, comapny_name, email, created_at
                FROM employer
                WHERE role = 'user'
                ORDER BY created_at DESC, employer_id DESC
                LIMIT 1
            """)
            company = cursor.fetchone()
            if company:
                activities.append({
                    "type": "company",
                    "id": company[0],
                    "name": company[2] or company[1] or "Unknown Company",
                    "detail": company[1] or company[3] or "N/A",
                    "timestamp": company[4].isoformat() if company[4] else None
                })
            
            # Most recent PENDING hire request only (not accepted/rejected)
            cursor.execute("""
                SELECT hr.request_id, hr.request_date, e.name, e.field
                FROM hire_request hr
                INNER JOIN employees e ON hr.employee_id = e.employee_id
                WHERE hr.status = 'pending'
                ORDER BY hr.request_date DESC
                LIMIT 1
            """)
            request = cursor.fetchone()
            if request:
                activities.append({
                    "type": "hire_request",
                    "id": request[0],
                    "name": request[2] or "Unknown",
                    "detail": request[3] or "N/A",
                    "timestamp": request[1].isoformat() if request[1] else None
                })
            
            cursor.close()
            
            return jsonify({
                "ok": True,
                "activities": activities  # Return only the most recent of each type
            })
    except Exception as e:
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500


@app.route("/api/jobs", methods=["GET"])
def api_list_jobs():
    """List jobs available for the site.

    Returns:
      { ok: True, count: N, jobs: [ {job_id, name, experience, details, location, created_at}, ... ] }
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            # Select all columns so we can adapt to different schema names (job_id vs id etc.)
            cursor.execute("SELECT * FROM jobs")
            rows = cursor.fetchall()
            cols = [d[0] for d in cursor.description] if cursor.description else []
            result = rows_to_dicts(cursor, rows)
            cursor.close()

            # Normalize primary key to `job_id` for frontend compatibility
            if len(result) > 0:
                first = result[0]
                if "job_id" not in first:
                    # Try common alternatives
                    if "id" in first:
                        for r in result:
                            r["job_id"] = r.get("id")
                    else:
                        # fallback: pick the first column that looks like an integer and map it to job_id
                        candidate = None
                        for c in cols:
                            v = first.get(c)
                            if isinstance(v, int):
                                candidate = c
                                break
                        if candidate:
                            for r in result:
                                r["job_id"] = r.get(candidate)

            # Sort by job_id descending if available, otherwise return as-is
            try:
                result.sort(key=lambda x: x.get("job_id") or 0, reverse=True)
            except Exception:
                pass

            # If rows didn't include any primary key, assign a stable fallback id so frontend can rely on job_id
            if result and not any("job_id" in r and r.get("job_id") for r in result):
                for idx, r in enumerate(result, start=1):
                    r["job_id"] = idx

            print(f"[api_list_jobs] returning {len(result)} jobs")
            if len(result) > 0:
                print("[api_list_jobs] first job:", result[0])
            return jsonify({"ok": True, "count": len(result), "jobs": result})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500


@app.route("/api/jobs", methods=["POST"])
def api_create_job():
    """Create a new job.

    Security: Prefer passing admin_user/admin_pass in JSON to authenticate via check_admin_credentials.
    For compatibility with the existing frontend (which stores `agn_admin_authenticated` boolean in localStorage)
    this endpoint will also accept JSON { admin_user, admin_authenticated: '1' } as a lightweight gate.
    NOTE: This is a convenience mode and not cryptographically secure. Consider adding proper tokens/sessions.
    """
    try:
        data = request.get_json(silent=True) or {}
        admin_user = (data.get("admin_user") or "").strip()
        admin_pass = (data.get("admin_pass") or "").strip()
        admin_authenticated = str(data.get("admin_authenticated") or "").strip()

        # Require either valid admin creds OR the lightweight local authenticated flag
        is_admin = False
        is_employer = False
        if admin_user and admin_pass:
            if check_admin_credentials(admin_user, admin_pass):
                is_admin = True
            else:
                return jsonify({"ok": False, "error": "invalid admin credentials"}), 401
        else:
            # allow if frontend indicates admin_authenticated (convenience mode)
            if admin_user and admin_authenticated == "1":
                is_admin = True

        # Also allow employer posting when they provide employer_id + employer_authenticated == '1'
        employer_id = data.get("employer_id")
        employer_authenticated = str(data.get("employer_authenticated") or "").strip()
        if employer_id and employer_authenticated == "1":
            # lightweight employer authentication (frontend-set flag)
            is_employer = True

        if not (is_admin or is_employer):
            return jsonify({"ok": False, "error": "admin or employer authentication required"}), 401

        name = (data.get("name") or "").strip()
        experience = (data.get("experience") or "").strip()
        details = (data.get("details") or "").strip()
        location = (data.get("location") or "").strip()

        if not name:
            return jsonify({"ok": False, "error": "name is required"}), 400

        with get_db_connection() as conn:
            cursor = conn.cursor()
            # If employer posted this job, try to include employer_id column if present
            try:
                if is_employer:
                    cursor.execute(
                        "INSERT INTO jobs (name, experience, details, location, employer_id) VALUES (%s, %s, %s, %s, %s)",
                        (name, experience, details, location, employer_id),
                    )
                else:
                    cursor.execute(
                        "INSERT INTO jobs (name, experience, details, location) VALUES (%s, %s, %s, %s)",
                        (name, experience, details, location),
                    )
            except Exception:
                # Fallback: try inserting without employer_id if the column doesn't exist
                cursor.execute(
                    "INSERT INTO jobs (name, experience, details, location) VALUES (%s, %s, %s, %s)",
                    (name, experience, details, location),
                )
            job_id = cursor.lastrowid
            cursor.close()
            print(f"[api_create_job] created job_id={job_id} name={name} by {'employer' if is_employer else 'admin'})")

        return jsonify({"ok": True, "job_id": job_id})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500


@app.route("/api/jobs/<int:job_id>", methods=["DELETE"])
def api_delete_job(job_id):
    """Delete a job (admin only).

    Accepts JSON with admin_user/admin_pass or admin_user + admin_authenticated flag (legacy convenience).
    """
    try:
        data = request.get_json(silent=True) or {}
        admin_user = (data.get("admin_user") or "").strip()
        admin_pass = (data.get("admin_pass") or "").strip()
        admin_authenticated = str(data.get("admin_authenticated") or "").strip()

        if admin_user and admin_pass:
            if not check_admin_credentials(admin_user, admin_pass):
                return jsonify({"ok": False, "error": "invalid admin credentials"}), 401
        else:
            if not (admin_user and admin_authenticated == "1"):
                return jsonify({"ok": False, "error": "admin authentication required"}), 401

        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT job_id FROM jobs WHERE job_id = %s", (job_id,))
            if not cursor.fetchone():
                cursor.close()
                return jsonify({"ok": False, "error": "Job not found"}), 404
            cursor.execute("DELETE FROM jobs WHERE job_id = %s", (job_id,))
            cursor.close()
            print(f"[api_delete_job] deleted job_id={job_id}")

        return jsonify({"ok": True})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500



def _handle_cv_mask_and_cloud_upload(local_src_path: str):
    """
    Given a local source file path, run the masker (processor.process_file) to produce a masked file,
    upload both original + masked to cloudinary and return dict with urls + cloud ids.
    
    Steps:
    1. Upload original CV to Cloudinary (agn_cv/originals folder)
    2. Create masked version using processor.process_file()
    3. Upload masked CV to Cloudinary (agn_cv/masked folder)
    4. Return both URLs
    """
    print(f"[_handle_cv_mask_and_cloud_upload] Starting process for: {local_src_path}")
    
    # Validate source file exists and has content
    if not os.path.exists(local_src_path):
        raise Exception(f"Source file does not exist: {local_src_path}")
    
    file_size = os.path.getsize(local_src_path)
    if file_size == 0:
        raise Exception(f"Source file is empty: {local_src_path}")
    
    print(f"[_handle_cv_mask_and_cloud_upload] Source file validated: {file_size} bytes")
    
    # Upload original
    print("[_handle_cv_mask_and_cloud_upload] Uploading original to Cloudinary...")
    orig_upload = upload_file(local_src_path, folder="agn_cv/originals")
    
    # Validate upload was successful
    if not orig_upload or orig_upload.get('status') != 'ok':
        error_msg = orig_upload.get('error', 'Unknown error') if orig_upload else 'Upload returned None'
        raise Exception(f"Failed to upload original CV to Cloudinary: {error_msg}")
    
    secure_url = orig_upload.get('secure_url')
    if not secure_url:
        raise Exception(f"Cloudinary upload succeeded but returned no secure_url: {orig_upload}")
    
    print(f"[_handle_cv_mask_and_cloud_upload] Original uploaded successfully: {secure_url}")

    # prepare masked temp file
    ext = os.path.splitext(local_src_path)[1] or ".pdf"
    tmp_out = tempfile.NamedTemporaryFile(delete=False, suffix=ext)
    tmp_out.close()
    masked_local = tmp_out.name
    
    print(f"[_handle_cv_mask_and_cloud_upload] Creating masked version at: {masked_local}")
    # mask in-place (calls your existing pdf/word maskers)
    process_file(local_src_path, masked_local)
    print("[_handle_cv_mask_and_cloud_upload] Masking complete, uploading masked CV...")

    # upload masked
    masked_upload = upload_file(masked_local, folder="agn_cv/masked")
    
    # Validate masked upload
    if not masked_upload or masked_upload.get('status') != 'ok':
        error_msg = masked_upload.get('error', 'Unknown error') if masked_upload else 'Upload returned None'
        raise Exception(f"Failed to upload masked CV to Cloudinary: {error_msg}")
    
    masked_secure_url = masked_upload.get('secure_url')
    if not masked_secure_url:
        raise Exception(f"Cloudinary masked upload succeeded but returned no secure_url: {masked_upload}")
    
    print(f"[_handle_cv_mask_and_cloud_upload] Masked uploaded successfully: {masked_secure_url}")

    # cleanup local masked file
    try:
        if os.path.exists(masked_local):
            os.unlink(masked_local)
            print(f"[_handle_cv_mask_and_cloud_upload] Cleaned up masked temp file: {masked_local}")
    except Exception:
        pass

    return {
        "original": {"secure_url": orig_upload.get("secure_url"), "public_id": orig_upload.get("public_id")},
        "masked": {"secure_url": masked_upload.get("secure_url"), "public_id": masked_upload.get("public_id")},
    }


def _insert_employee_row(fields: Dict[str, Any], original_url: str, masked_url: str):
    """
    Insert a new employee record into the employees table.
    Returns lastrowid.
    """
    print(f"[_insert_employee_row] Inserting employee: {fields.get('name')} ({fields.get('email')})")
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        insert_query = """
            INSERT INTO employees
            (name, age, email, mobile_no, location, nearest_route, cnic_no, educational_profile,
             recent_completed_education, field, experience, experience_detail, cv, masked_cv)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        age_value = None
        if fields.get("age"):
            age_str = str(fields.get("age"))
            if age_str.isdigit():
                age_value = int(age_str)
        
        values = (
            fields.get("name"),
            age_value,
            fields.get("email"),
            fields.get("mobile_no"),
            fields.get("location"),
            fields.get("nearest_route"),
            fields.get("cnic_no"),
            fields.get("educational_profile"),
            fields.get("recent_completed_education"),
            fields.get("field") or fields.get("applying_for") or "",
            fields.get("experience"),
            fields.get("experience_detail"),
            original_url,
            masked_url,
        )
        
        cursor.execute(insert_query, values)
        emp_id = cursor.lastrowid
        cursor.close()
        print(f"[_insert_employee_row] Employee inserted successfully with ID: {emp_id}")
        return emp_id

@app.route("/", methods=["GET"])
def home():
    print("server is running")
    return jsonify({"ok": True, "service": "full_api"})

@app.route("/insert_employee", methods=["POST"])
def insert_employee():
    """
    Insert new employee with CV processing.
    
    Flow:
    1. Receive CV file and employee details from frontend
    2. Save CV temporarily
    3. Process CV through masking module (processor.process_file)
    4. Upload both original and masked CV to Cloudinary
    5. Insert employee record with both CV URLs to database
    
    Accepts:
    - FormData with 'cv' file + employee fields
    - JSON with 'cv_url' + employee fields
    
    Returns:
    - employee_id, cv_url (original), masked_cv_url (masked)
    """
    try:
        print("[insert_employee] Request received")
        
        # Prefer form fields, but accept JSON body as a fallback
        data = request.get_json(silent=True) or {}

        fields = {}
        expected = [
            "name",
            "age",
            "email",
            "mobile_no",
            "location",
            "nearest_route",
            "cnic_no",
            "educational_profile",
            "recent_completed_education",
            "applying_for",
            "experience",
            "experience_detail",
        ]
        for k in expected:
            # prefer form data, then JSON, else empty string
            fields[k] = request.form.get(k) or data.get(k) or ""

        print(f"[insert_employee] Fields: name={fields.get('name')}, email={fields.get('email')}")
        
        file = request.files.get("cv")
        cv_url = request.form.get("cv_url") or data.get("cv_url")

        if not file and not cv_url:
            print("[insert_employee] ERROR: Missing CV file or cv_url")
            return jsonify({"ok": False, "error": "Missing CV file or cv_url"}), 400

        # Help static type checkers and ensure we have a string when using cv_url below
        if cv_url is not None:
            cv_url = str(cv_url)

        temp_original = None
        uploaded_info = None

        if file:
            filename = secure_filename(file.filename or "upload_cv")
            print(f"[insert_employee] Processing file upload: {filename}")
            
            if not allowed_file(filename):
                print(f"[insert_employee] ERROR: Unsupported file type: {filename}")
                return jsonify({"ok": False, "error": f"Unsupported file type for {filename}"}), 400
            
            # Save uploaded file temporarily
            temp_original = save_temp_file(file, filename)
            print(f"[insert_employee] File saved to temp: {temp_original}")
            
            # Validate file size (3MB limit)
            file_size = os.path.getsize(temp_original)
            if file_size > 3 * 1024 * 1024:  # 3MB in bytes
                print(f"[insert_employee] ERROR: File too large: {file_size} bytes")
                try:
                    os.unlink(temp_original)
                except Exception:
                    pass
                return jsonify({
                    "ok": False, 
                    "error": "File size exceeds 3MB limit. Please compress your CV or use a smaller file."
                }), 400
            
            # Validate that PDFs are text-based (reject image-only PDFs like Canva exports)
            if filename.lower().endswith('.pdf'):
                if is_image_only_pdf(temp_original):
                    print(f"[insert_employee] ERROR: Image-only PDF rejected: {filename}")
                    try:
                        os.unlink(temp_original)
                    except Exception:
                        pass
                    return jsonify({
                        "ok": False, 
                        "error": "Image-only PDFs (like Canva exports) are not supported. Please upload a text-based PDF or Word document instead."
                    }), 400
            
            # Process: upload original + mask + upload masked
            print("[insert_employee] Starting CV masking and upload process...")
            uploaded_info = _handle_cv_mask_and_cloud_upload(temp_original)
            print(f"[insert_employee] Upload complete. Original: {uploaded_info.get('original', {}).get('secure_url')}")
            
            # cleanup original local copy
            try:
                if os.path.exists(temp_original):
                    os.unlink(temp_original)
                    print(f"[insert_employee] Cleaned up temp file: {temp_original}")
            except Exception:
                pass
        else:
            # cv_url is guaranteed to be a string here (checked above)
            assert cv_url is not None, "cv_url should not be None at this point"
            print(f"[insert_employee] Processing CV from URL: {cv_url}")
            
            # try cloudinary fetch (preferred). If fetch fails, download locally then upload.
            try:
                print("[insert_employee] Attempting Cloudinary fetch...")
                orig_upload = fetch_and_upload_url(cv_url, folder="agn_cv/originals")
                # make sure we got a secure_url back
                secure_url = orig_upload.get("secure_url") if orig_upload else None
                if not secure_url:
                    raise Exception("cloudinary fetch returned no secure_url")
                
                print(f"[insert_employee] Cloudinary fetch successful: {secure_url}")
                # download the cloudinary file back to local to mask (cloudinary URL is public)
                temp_original = download_remote_to_temp(secure_url)
                uploaded_info = _handle_cv_mask_and_cloud_upload(temp_original)
                try:
                    if os.path.exists(temp_original):
                        os.unlink(temp_original)
                        print(f"[insert_employee] Cleaned up temp file after fetch: {temp_original}")
                except Exception:
                    pass
            except Exception as e:
                # fallback: download remote directly and then process
                print(f"[insert_employee] Cloudinary fetch failed: {e}, trying direct download...")
                temp_original = download_remote_to_temp(cv_url)
                print(f"[insert_employee] Direct download successful, processing...")
                uploaded_info = _handle_cv_mask_and_cloud_upload(temp_original)
                try:
                    if os.path.exists(temp_original):
                        os.unlink(temp_original)
                        print(f"[insert_employee] Cleaned up temp file: {temp_original}")
                except Exception:
                    pass

        original_url = uploaded_info.get("original", {}).get("secure_url")
        masked_url = uploaded_info.get("masked", {}).get("secure_url")
        if not original_url or not masked_url:
            print(f"[insert_employee] ERROR: Upload/masking failed - original_url: {original_url}, masked_url: {masked_url}")
            raise Exception("Upload/masking failed: missing urls")

        print(f"[insert_employee] Inserting employee to database...")
        emp_id = _insert_employee_row(fields, str(original_url), str(masked_url))
        print(f"[insert_employee] SUCCESS: Employee created with ID: {emp_id}")

        return jsonify({"ok": True, "employee_id": emp_id, "cv_url": original_url, "masked_cv_url": masked_url})
    except Exception as e:
        print(f"[insert_employee] EXCEPTION: {str(e)}")
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500


@app.route("/api/employees", methods=["GET"])
def list_employees():
    """
    Query params (optional):
      name, email, mobile_no, role, location, experience, limit
    Returns JSON array of rows (columns returned are whatever exists in employees table).
    """
    q = request.args
    filters = {}
    for k in ("name", "email", "mobile_no", "role", "location", "experience"):
        v = q.get(k)
        if v:
            filters[k] = v

    limit = int(q.get("limit", 100))

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            # Build where clauses similar to your CLI script: space-agnostic / case-insensitive
            # NOTE: Use %% to escape literal % in SQL when using PyMySQL parameterized queries
            where_clauses = []
            params = []
            if "mobile_no" in filters:
                where_clauses.append("mobile_no LIKE %s")
                params.append("%" + filters["mobile_no"] + "%")
            if "name" in filters:
                where_clauses.append("REPLACE(LOWER(name),' ','') LIKE CONCAT('%%', REPLACE(LOWER(%s),' ',''), '%%')")
                params.append(filters["name"])
            if "email" in filters:
                where_clauses.append("REPLACE(LOWER(email),' ','') LIKE CONCAT('%%', REPLACE(LOWER(%s),' ',''), '%%')")
                params.append(filters["email"])
            if "role" in filters:
                # match 'field' column only
                where_clauses.append("REPLACE(LOWER(field),' ','') LIKE CONCAT('%%', REPLACE(LOWER(%s),' ',''), '%%')")
                params.append(filters["role"])
            if "location" in filters:
                where_clauses.append("REPLACE(LOWER(location),' ','') LIKE CONCAT('%%', REPLACE(LOWER(%s),' ',''), '%%')")
                params.append(filters["location"])
            if "experience" in filters:
                where_clauses.append("REPLACE(LOWER(experience),' ','') LIKE CONCAT('%%', REPLACE(LOWER(%s),' ',''), '%%')")
                params.append(filters["experience"])

            base = "SELECT * FROM employees"
            if where_clauses:
                sql = base + " WHERE " + " AND ".join(where_clauses) + " LIMIT %s"
                params.append(limit)
            else:
                sql = base + " LIMIT %s"
                params = [limit]

            # Debug: print SQL and params to help troubleshoot matching issues
            try:
                print("[debug] list_employees SQL:", sql)
                print("[debug] params:", params)
            except Exception:
                pass
            cursor.execute(sql, tuple(params))
            rows = cursor.fetchall()
            result = rows_to_dicts(cursor, rows)

            # If nothing matched but caller asked for a role, try a simpler fallback
            # using a plain case-insensitive LIKE that preserves spaces. This can
            # catch entries that the REPLACE-based matching may miss for odd data.
            if len(result) == 0 and "role" in filters:
                try:
                    # simpler fallback: LOWER(field) LIKE %role%
                    fallback_sql = base + " WHERE LOWER(field) LIKE CONCAT('%%', LOWER(%s), '%%') LIMIT %s"
                    fallback_params = (filters["role"], limit)
                    try:
                        print("[debug] fallback list_employees SQL:", fallback_sql)
                        print("[debug] fallback params:", fallback_params)
                    except Exception:
                        pass
                    cursor.execute(fallback_sql, fallback_params)
                    rows = cursor.fetchall()
                    result = rows_to_dicts(cursor, rows)
                except Exception:
                    # if fallback fails, ignore and return the original empty result
                    pass

            cursor.close()
            return jsonify({"ok": True, "count": len(result), "rows": result})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500


@app.route("/api/employee/<int:emp_id>", methods=["GET"])
def get_employee(emp_id):
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM employees WHERE employee_id = %s LIMIT 1", (emp_id,))
            row = cursor.fetchone()
            if not row:
                cursor.close()
                return jsonify({"ok": False, "error": "Not found"}), 404
            obj = rows_to_dicts(cursor, [row])[0]
            cursor.close()
            return jsonify({"ok": True, "row": obj})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500


@app.route("/api/employee/<int:emp_id>/update_cv", methods=["POST"])
def update_employee_cv(emp_id):
    """
    Replace CV for an existing employee; accepts file upload (cv) or cv_url (JSON/form).
    Masks the new CV and updates cv & masked_cv columns in DB.
    """
    try:
        # accept form data or JSON body safely
        data = request.get_json(silent=True) or {}
        file = request.files.get("cv")
        cv_url = request.form.get("cv_url") or data.get("cv_url")

        if not file and not cv_url:
            return jsonify({"ok": False, "error": "Missing cv file or cv_url"}), 400

        # normalize cv_url for type checkers
        if cv_url is not None:
            cv_url = str(cv_url)

        temp_original = None
        uploaded_info = None

        if file:
            filename = secure_filename(file.filename or "upload_cv")
            if not allowed_file(filename):
                return jsonify({"ok": False, "error": f"Unsupported file type for {filename}"}), 400
            temp_original = save_temp_file(file, filename)
            uploaded_info = _handle_cv_mask_and_cloud_upload(temp_original)
            try:
                if os.path.exists(temp_original):
                    os.unlink(temp_original)
            except Exception:
                pass
        else:
            try:
                orig_upload = fetch_and_upload_url(cv_url, folder="agn_cv/originals")
                secure_url = orig_upload.get("secure_url") if orig_upload else None
                if not secure_url:
                    raise Exception("cloudinary fetch returned no secure_url")
                temp_original = download_remote_to_temp(secure_url)
                uploaded_info = _handle_cv_mask_and_cloud_upload(temp_original)
                try:
                    if os.path.exists(temp_original):
                        os.unlink(temp_original)
                except Exception:
                    pass
            except Exception:
                temp_original = download_remote_to_temp(cv_url)
                uploaded_info = _handle_cv_mask_and_cloud_upload(temp_original)
                try:
                    if os.path.exists(temp_original):
                        os.unlink(temp_original)
                except Exception:
                    pass

        original_url = uploaded_info.get("original", {}).get("secure_url")
        masked_url = uploaded_info.get("masked", {}).get("secure_url")
        if not original_url or not masked_url:
            raise Exception("Upload/masking failed: missing urls")

        # update DB
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("UPDATE employees SET cv = %s, masked_cv = %s WHERE employee_id = %s", (original_url, masked_url, emp_id))
            cursor.close()

        return jsonify({"ok": True, "employee_id": emp_id, "cv_url": original_url, "masked_cv_url": masked_url})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500


@app.route("/api/employee/<int:emp_id>", methods=["DELETE"])
def delete_employee(emp_id):
    """Delete an employee by ID."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Check if employee exists
            cursor.execute("SELECT employee_id FROM employees WHERE employee_id = %s", (emp_id,))
            if not cursor.fetchone():
                cursor.close()
                return jsonify({"ok": False, "error": "Employee not found"}), 404
            
            # Delete the employee
            cursor.execute("DELETE FROM employees WHERE employee_id = %s", (emp_id,))
            cursor.close()
        
        return jsonify({"ok": True, "message": "Employee deleted successfully"})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500


@app.route("/api/employer/<int:employer_id>", methods=["DELETE"])
def delete_employer(employer_id):
    """Delete an employer/company by ID."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Check if employer exists and is not an admin
            cursor.execute("SELECT employer_id, role FROM employer WHERE employer_id = %s", (employer_id,))
            row = cursor.fetchone()
            if not row:
                cursor.close()
                return jsonify({"ok": False, "error": "Company not found"}), 404
            
            # Prevent deletion of admin accounts
            if row[1] and row[1].lower() == 'admin':
                cursor.close()
                return jsonify({"ok": False, "error": "Cannot delete admin accounts"}), 403
            
            # Delete the employer
            cursor.execute("DELETE FROM employer WHERE employer_id = %s", (employer_id,))
            cursor.close()
        
        return jsonify({"ok": True, "message": "Company deleted successfully"})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500
        try:
            conn.close()
        except Exception:
            pass
        
        return jsonify({"ok": True, "message": "Company deleted successfully"})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"ok": False, "error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("CV_SERVICE_PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=True)
