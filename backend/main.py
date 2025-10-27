"""Top-level CLI for AGN backend panels

Provides:
- Admin panel (requires admin login)
- Employer panel (requires employer login)
- Employee insert panel (requires employer login)

This script attempts to be compatible with the existing helper modules in this
directory. It verifies credentials against the `admin` and `employer` tables
using flexible comparison (plain or SHA-256 hash) so it works whether your DB
stores plaintext or hashed passwords.

Security note: storing plaintext passwords is not recommended. Use salted
hashing (bcrypt/argon2) for production and enlarge password columns accordingly.
"""
from __future__ import annotations

import hashlib
import os
import sys
from typing import Optional

import mysql.connector

# Import the existing panels
try:
    from admin_panal_view import admin_panel, get_db_connection as get_db_conn_from_admin
except Exception:
    # Fallback: try local import name differences
    from admin_panal_view import admin_panel, get_db_connection as get_db_conn_from_admin  # type: ignore

try:
    from insert_employee_form import insert_employee_pannel
except Exception:
    insert_employee_pannel = None  # type: ignore

try:
    from insert_employeer_signup import insert_employeer_signup
except Exception:
    insert_employeer_signup = None  # type: ignore

try:
    from employer_view import search_employees_by_field
except Exception:
    search_employees_by_field = None  # type: ignore
try:
    # admin_panal_view exposes a helper to inspect table columns; reuse it if available
    from admin_panal_view import get_table_columns as get_table_columns_from_admin
except Exception:
    get_table_columns_from_admin = None  # type: ignore


def _sha256(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def get_db_connection():
    """Connect using environment vars or sensible defaults (matches other scripts)."""
    return get_db_conn_from_admin()


def check_admin_credentials(username: str, password: str) -> bool:
    """Return True if username/password match an entry in admin table.

    The function will accept either a plaintext match or a SHA-256 hex match
    so it works with several storage strategies.
    """
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT password FROM admin WHERE user_name = %s LIMIT 1", (username,))
        row = cur.fetchone()
        if not row:
            return False
        stored = row[0] or ""
        # direct match
        if password == stored:
            return True
        # sha256 match
        if _sha256(password) == stored:
            return True
        return False
    except mysql.connector.Error as e:
        print(f"Database error while checking admin credentials: {e}")
        return False
    finally:
        try:
            if cur:
                cur.close()
        except Exception:
            pass
        try:
            if conn and conn.is_connected():
                conn.close()
        except Exception:
            pass


def check_employer_credentials(username: str, password: str) -> Optional[int]:
    """Return employer_id (int) if credentials valid, otherwise None.

    Employer password column may be short (VARCHAR(15)). We therefore try several
    comparisons: exact plaintext, truncated plaintext (15 chars), and SHA-256.
    """
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT employer_id, password FROM employer WHERE username = %s LIMIT 1", (username,))
        row = cur.fetchone()
        if not row:
            return None
        employer_id, stored = row[0], (row[1] or "")
        # direct match
        if password == stored:
            return int(employer_id)
        # truncated plaintext (VARCHAR(15) common in this project)
        if len(password) > 15 and password[:15] == stored:
            return int(employer_id)
        # sha256 match
        if _sha256(password) == stored:
            return int(employer_id)
        return None
    except mysql.connector.Error as e:
        print(f"Database error while checking employer credentials: {e}")
        return None
    finally:
        try:
            if cur:
                cur.close()
        except Exception:
            pass
        try:
            if conn and conn.is_connected():
                conn.close()
        except Exception:
            pass


def admin_flow():
    print("Admin login required")
    username = input("Admin username: ").strip()
    password = input("Admin password: ").strip()
    if not check_admin_credentials(username, password):
        print("Invalid admin credentials.")
        return
    print("Login successful — opening Admin Panel.")
    try:
        admin_panel()
    except Exception as e:
        print(f"Admin panel error: {e}")


def employer_flow():
    print("Employer login required")
    username = input("Employer username: ").strip()
    password = input("Employer password: ").strip()
    employer_id = check_employer_credentials(username, password)
    if not employer_id:
        print("Invalid employer credentials.")
        return
    print(f"Employer {username} (id={employer_id}) logged in.")

    while True:
        print("\nEmployer Panel — options:\n 1) Search employees\n 2) Insert employee record\n 3) Logout")
        choice = input("Choose (1/2/3): ").strip()
        if choice == '3' or choice.lower() == 'q':
            print("Logging out employer.")
            return
        if choice == '1':
            if search_employees_by_field:
                try:
                    search_employees_by_field()
                except Exception as e:
                    print("Error running employer search:", e)
            else:
                print("Search feature not available (missing module).")
        elif choice == '2':
            if insert_employee_pannel:
                try:
                    insert_employee_pannel()
                except Exception as e:
                    print("Error inserting employee:", e)
            else:
                print("Employee insert feature not available (missing module).")
        else:
            print("Invalid choice")


def employee_flow():
    """Simple employee dashboard CLI.

    Allows an employee to view their record by email or mobile number and optionally
    update their CV link(s) if the `cv` or `masked_cv` columns exist.
    """
    print("Employee Dashboard — view or update your record")
    identifier = input("Enter your email or mobile number: ").strip()
    if not identifier:
        print("No identifier provided; returning.")
        return

    conn = None
    cur = None
    try:
        conn = get_db_connection()
        # inspect columns to see if update is supported
        available_cols = []
        if get_table_columns_from_admin:
            try:
                available_cols = get_table_columns_from_admin(conn, 'employees')
            except Exception:
                available_cols = []

        cur = conn.cursor()
        # allow search by exact email or mobile (partial match)
        sql = "SELECT * FROM employees WHERE email = %s OR mobile_no LIKE %s LIMIT 10"
        cur.execute(sql, (identifier, f"%{identifier}%"))
        rows = cur.fetchall()
        if not rows:
            print("No employee record found matching that identifier.")
            return

        cols = [d[0] for d in cur.description]
        print(f"Found {len(rows)} record(s). Showing up to 10 results:")
        for r in rows:
            for name, val in zip(cols, r):
                print(f"{name}: {val}")
            print('-' * 40)

        # If cv or masked_cv present, offer update for a single selected record
        updatable = [c for c in ('cv', 'masked_cv') if c in cols]
        if updatable:
            print("You may update the following fields:", ", ".join(updatable))
            if input("Would you like to update one of these fields? (y/N): ").strip().lower() in ('y', 'yes'):
                # ask which record (by employee_id if present)
                emp_id_idx = None
                if 'employee_id' in cols:
                    emp_id_idx = cols.index('employee_id')
                if emp_id_idx is None:
                    print("No employee_id column available — cannot safely target a single row for update.")
                    return
                # if only one row, use that id
                if len(rows) == 1:
                    target_id = rows[0][emp_id_idx]
                else:
                    print("Multiple records found. Please enter the employee_id of the record you want to update:")
                    for r in rows:
                        print(f" - {r[emp_id_idx]}")
                    target_id = input("employee_id: ").strip()
                    if not target_id:
                        print("No id provided — aborting update.")
                        return

                field_to_update = input(f"Which field to update ({', '.join(updatable)}): ").strip()
                if field_to_update not in updatable:
                    print("Invalid field chosen.")
                    return
                new_val = input(f"Enter new value for {field_to_update}: ").strip()
                if not new_val:
                    print("Empty value — aborting.")
                    return

                # perform update
                upd_sql = f"UPDATE employees SET {field_to_update} = %s WHERE employee_id = %s"
                cur.execute(upd_sql, (new_val, target_id))
                conn.commit()
                print("Update applied.")

    except mysql.connector.Error as e:
        print("Database error:", e)
    except Exception as ex:
        print("Error:", ex)
    finally:
        try:
            if cur:
                cur.close()
        except Exception:
            pass
        try:
            if conn and conn.is_connected():
                conn.close()
        except Exception:
            pass


def main_menu():
    print("AGN Backend — main menu")
    while True:
        print("\nChoose panel:\n 1) Admin Panel (login required)\n 2) Employer Panel (login required)\n 3) Employer Signup\n 4) Employee Dashboard\n 5) Quit")
        choice = input("Enter choice (1/2/3/4/5): ").strip()
        if choice == '5' or choice.lower() in ('q', 'quit'):
            print("Goodbye")
            return
        if choice == '1':
            admin_flow()
        elif choice == '2':
            employer_flow()
        elif choice == '3':
            if insert_employeer_signup:
                try:
                    insert_employeer_signup()
                except Exception as e:
                    print("Error running employer signup:", e)
            else:
                print("Signup feature not available (missing module).")
        elif choice == '4':
            # Employee dashboard (no auth required here by design)
            try:
                employee_flow()
            except Exception as e:
                print("Error in employee dashboard:", e)
        else:
            print("Invalid option — please choose 1, 2, 3, 4 or 5.")


if __name__ == '__main__':
    try:
        main_menu()
    except KeyboardInterrupt:
        print('\nInterrupted — exiting')
        sys.exit(0)
