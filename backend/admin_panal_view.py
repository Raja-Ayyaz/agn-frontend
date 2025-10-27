"""AGN Admin Panel — Employee Search

This admin CLI is defensive: it inspects the `employees` table at runtime and only
references columns that actually exist. That prevents errors like:

    Database error: 1054 (42S22): Unknown column 'applying_for' in 'field list'

Features:
- Multi-filter search (mobile_no, field/applying_for, experience, name, email, location)
- Fuzzy matches using REPLACE(LOWER(...),' ','') LIKE ... so searches are case- and space-insensitive
- Automatic export to ./exports/employees_<timestamp>.csv with a promptable default

Notes:
- This script does not assume CVs or masked_cv are present; it will include only
  the columns that exist in your DB schema.
"""

import os
import sys
import csv
import datetime
from typing import Dict, List, Tuple

import mysql.connector


DEFAULT_EXPORT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'exports'))


def get_db_connection():
    host = os.environ.get('AGN_DB_HOST', 'gateway01.eu-central-1.prod.aws.tidbcloud.com')
    user = os.environ.get('AGN_DB_USER', '4YoWi5wpZWfFZMg.root')
    password = os.environ.get('AGN_DB_PASS', 'rM9HHqklqdSdDSfi')
    database = os.environ.get('AGN_DB_NAME', 'agn')
    return mysql.connector.connect(host=host, user=user, password=password, database=database)


def _ensure_export_dir(path: str):
    os.makedirs(path, exist_ok=True)


def get_table_columns(conn, table_name: str = 'employees') -> List[str]:
    """Return a list of column names for the given table."""
    cur = conn.cursor()
    try:
        cur.execute(f"SHOW COLUMNS FROM {table_name}")
        cols = [row[0] for row in cur.fetchall()]
        return cols
    finally:
        try:
            cur.close()
        except Exception:
            pass


def prompt_filters(available_cols: List[str]) -> Dict[str, str]:
    """Prompt user for filter inputs. Only prompt for sensible fields; empty means skip."""
    print("Enter filter values (press Enter to skip a filter).")
    f: Dict[str, str] = {}

    f['mobile_no'] = input("Phone (mobile_no) contains: ").strip()

    # field vs applying_for: ask for role/field regardless of exact column name
    f['role'] = input("Field / Role (e.g. Software Engineer): ").strip()

    f['experience'] = input("Experience contains (e.g. '2 years' or 'senior'): ").strip()
    f['name'] = input("Name contains: ").strip()
    f['email'] = input("Email contains: ").strip()
    f['location'] = input("Location contains: ").strip()

    # Remove empty entries
    return {k: v for k, v in f.items() if v}


def build_query(filters: Dict[str, str], available_cols: List[str]) -> Tuple[str, List[str]]:
    """Build a parameterized SELECT and params based on available columns and provided filters.

    - Only include columns that exist.
    - For text filters we use REPLACE(LOWER(col),' ','') LIKE CONCAT('%', REPLACE(LOWER(%s),' ',''), '%')
      so search is case- and space-insensitive.
    """
    # Preferred result columns and fallback behavior.
    preferred_cols = [
        'employee_id', 'name', 'age', 'email', 'mobile_no', 'location', 'nearest_route',
        'cnic_no', 'educational_profile', 'recent_completed_education', 'field', 'applying_for',
        'experience', 'experience_detail', 'cv', 'masked_cv'
    ]

    # Only keep columns that exist in the DB
    select_cols = [c for c in preferred_cols if c in available_cols]
    if not select_cols:
        # As a last resort, select everything
        select_clause = '*'
    else:
        # If both 'field' and 'applying_for' exist, prefer 'field' then include applying_for too.
        select_clause = ', '.join(select_cols)

    base = f"SELECT {select_clause} FROM employees"

    where_clauses: List[str] = []
    params: List[str] = []

    def fuzzy_col_clause(col_name: str, value: str):
        where_clauses.append(f"REPLACE(LOWER({col_name}), ' ', '') LIKE CONCAT('%', REPLACE(LOWER(%s), ' ', ''), '%')")
        params.append(value)

    # mobile_no: only use if column exists
    if 'mobile_no' in available_cols and filters.get('mobile_no'):
        # allow searching partial numbers while ignoring spaces
        where_clauses.append("REPLACE(REPLACE(REPLACE(mobile_no, ' ', ''), '+', ''), '-', '') LIKE CONCAT('%', REPLACE(REPLACE(REPLACE(%s, ' ', ''), '+', ''), '-', ''), '%')")
        params.append(filters['mobile_no'])

    # role - map to whichever column exists
    if filters.get('role'):
        if 'field' in available_cols:
            fuzzy_col_clause('field', filters['role'])
        elif 'applying_for' in available_cols:
            fuzzy_col_clause('applying_for', filters['role'])
        else:
            # no role-like column in DB; ignore role filter but inform user later
            pass

    for col in ('experience', 'name', 'email', 'location'):
        if filters.get(col) and col in available_cols:
            fuzzy_col_clause(col, filters[col])

    if where_clauses:
        query = base + ' WHERE ' + ' AND '.join(where_clauses) + ' LIMIT 1000'
    else:
        query = base + ' LIMIT 1000'

    return query, params


def pretty_print_results(rows: List[Tuple], cols: List[str]):
    if not rows:
        print("No records to show.")
        return
    widths = [len(c) for c in cols]
    for r in rows:
        for i, v in enumerate(r):
            s = str(v) if v is not None else ''
            if len(s) > widths[i]:
                widths[i] = len(s)

    header = ' | '.join(c.ljust(widths[i]) for i, c in enumerate(cols))
    sep = '-+-'.join('-' * widths[i] for i in range(len(cols)))
    print(header)
    print(sep)
    for r in rows:
        print(' | '.join((str(v) if v is not None else '').ljust(widths[i]) for i, v in enumerate(r)))


def export_to_csv(rows: List[Tuple], cols: List[str], path: str):
    with open(path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(cols)
        for r in rows:
            writer.writerow([v if v is not None else '' for v in r])
    print(f"Exported {len(rows)} rows to {path}")


def admin_panel():
    print('AGN Admin Panel — Employee Search')

    # Determine available columns once (so we don't reference missing ones)
    conn = None
    try:
        conn = get_db_connection()
        available_cols = get_table_columns(conn, 'employees')
    except mysql.connector.Error as e:
        print('Database error when inspecting schema:', e)
        return
    finally:
        try:
            if conn and conn.is_connected():
                conn.close()
        except Exception:
            pass

    print('Detected columns:', ', '.join(available_cols))

    while True:
        print('\nOptions:\n 1) Search with filters\n 2) Show all (first 200)\n 3) Quit')
        choice = input('Choose an option (1/2/3): ').strip()
        if choice == '3' or choice.lower() == 'q':
            print('Exiting.')
            return

        if choice == '2':
            filters = {}
        elif choice == '1':
            filters = prompt_filters(available_cols)
            if not filters:
                print('No filters provided — this will list up to 1000 records. Proceed? (y/n)')
                if input().strip().lower() not in ('y', 'yes'):
                    continue
        else:
            print('Invalid option')
            continue

        # Build and run query
        query, params = build_query(filters, available_cols)
        conn = None
        cur = None
        try:
            conn = get_db_connection()
            cur = conn.cursor()
            cur.execute(query, tuple(params))
            rows = cur.fetchall()
            cols = [d[0] for d in cur.description] if cur.description else []
            pretty_print_results(rows, cols)

            if rows:
                # default export location with prompt
                default_dir = DEFAULT_EXPORT_DIR
                _ensure_export_dir(default_dir)
                ts = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
                default_path = os.path.join(default_dir, f'employees_{ts}.csv')

                print(f"Would you like to export results to CSV? Default: {default_path}")
                if input('(Y/n): ').strip().lower() not in ('n', 'no'):
                    path = input(f"Press Enter to use default, or enter full path to save CSV: ").strip()
                    if not path:
                        path = default_path
                    export_to_csv(rows, cols, path)

        except mysql.connector.Error as e:
            # Most likely a missing column or other schema mismatch. Show error and suggest schema check.
            print('Database error:', e)
            print('If the error mentions a missing column, make sure your employees table has the expected columns, or update the schema/this script to match.')
        except Exception as ex:
            print('Error:', ex)
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


if __name__ == '__main__':
    try:
        admin_panel()
    except KeyboardInterrupt:
        print('\nCancelled by user.')
        sys.exit(0)
"""Admin panel CLI for searching and exporting employee records.

Features:
- Prompt for multiple optional filters (phone/mobile_no, field/applying_for, experience, name, email, location)
- Build a safe parameterized query using REPLACE/LOWER for fuzzy matches (ignores spaces and case)
- Display results (name, email, mobile_no, field/applying_for, experience, cv_link, masked_cv)
- Automatically export results to ./exports/employees_<timestamp>.csv (no path prompt)

This file expects the `employees` table to have columns named at least: name, email, mobile_no,
applying_for or field, experience, cv (link), masked_cv, location.
"""

import os
import sys
import re
import csv
import datetime
import mysql.connector


DEFAULT_EXPORT_DIR = os.path.join(os.path.dirname(__file__), "..", "exports")


def _ensure_export_dir(path: str):
    os.makedirs(path, exist_ok=True)


def _clean_like_param(value: str) -> str:
    # used as parameter for the REPLACE/LOWER pattern; caller will pass to SQL
    return value


def build_filters():
    """Prompt the admin for filter values and return a list of SQL clauses and params."""
    print("Enter filter values (press Enter to skip a filter).")
    # We'll support both 'field' and 'applying_for' column names depending on your schema
    filters = {}
    filters['mobile_no'] = input("Mobile number (digits, partial allowed): ").strip()
    filters['field'] = input("Field / role (e.g. Software Engineer): ").strip()
    filters['applying_for'] = input("Applying for (alternate column): ").strip()
    filters['experience'] = input("Experience (e.g. '2 years' or 'senior'): ").strip()
    filters['name'] = input("Name (partial ok): ").strip()
    filters['email'] = input("Email (partial or full): ").strip()
    filters['location'] = input("Location (partial ok): ").strip()
    return filters


def build_where_clause(filters: dict):
    clauses = []
    params = []

    # helper to create REPLACE/LOWER LIKE clause
    def fuzzy(col, val):
        clauses.append(f"REPLACE(LOWER({col}), ' ', '') LIKE CONCAT('%', REPLACE(LOWER(%s), ' ', ''), '%')")
        params.append(val)

    # mobile_no: strip non-digits and use LIKE on cleaned value as well as raw
    if filters.get('mobile_no'):
        v = filters['mobile_no']
        # allow searching partial numbers
        # use REPLACE to ignore spaces, + and - by replacing them in SQL is not portable; we'll parameterize raw like
        clauses.append("REPLACE(REPLACE(REPLACE(mobile_no, ' ', ''), '+', ''), '-', '') LIKE CONCAT('%', REPLACE(REPLACE(REPLACE(%s, ' ', ''), '+', ''), '-', ''), '%')")
        params.append(v)

    # field / applying_for (either may exist)
    if filters.get('field'):
        fuzzy('field', filters['field'])
    if filters.get('applying_for'):
        fuzzy('applying_for', filters['applying_for'])

    if filters.get('experience'):
        fuzzy('experience', filters['experience'])

    if filters.get('name'):
        fuzzy('name', filters['name'])

    if filters.get('email'):
        fuzzy('email', filters['email'])

    if filters.get('location'):
        fuzzy('location', filters['location'])

    where_clause = " AND ".join(clauses) if clauses else ""
    if where_clause:
        where_clause = "WHERE " + where_clause
    return where_clause, params


def run_search_and_export():
    filters = build_filters()
    where_clause, params = build_where_clause(filters)

    # DB config (env vars preferred)
    db_host = os.environ.get('AGN_DB_HOST', 'gateway01.eu-central-1.prod.aws.tidbcloud.com')
    db_user = os.environ.get('AGN_DB_USER', '4YoWi5wpZWfFZMg.root')
    db_pass = os.environ.get('AGN_DB_PASS', 'rM9HHqklqdSdDSfi')
    db_name = os.environ.get('AGN_DB_NAME', 'agn')

    conn = None
    cur = None
    try:
        conn = mysql.connector.connect(host=db_host, user=db_user, password=db_pass, database=db_name)
        cur = conn.cursor()

        sql = (
            "SELECT name, email, mobile_no, COALESCE(field, applying_for) AS role, "
            "experience, cv AS cv_link, masked_cv, location FROM employees "
            f"{where_clause} LIMIT 1000"
        )

        cur.execute(sql, tuple(params))
        rows = cur.fetchall()

        if not rows:
            print("No results found for the given filters.")
            return

        # Print results in a simple table
        headers = [d[0] for d in cur.description]
        print("Found", len(rows), "rows. Displaying up to 1000 results")
        print(" | ".join(headers))
        print("-" * 80)
        for r in rows:
            print(" | ".join([str(x) if x is not None else "" for x in r]))

        # Export automatically to exports directory with timestamped filename
        export_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'exports'))
        _ensure_export_dir(export_dir)
        ts = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"employees_{ts}.csv"
        export_path = os.path.join(export_dir, filename)

        with open(export_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(headers)
            for r in rows:
                writer.writerow([x if x is not None else '' for x in r])

        print(f"Results exported to: {export_path}")

    except mysql.connector.Error as e:
        print("Database error:", e)
    except Exception as exc:
        print("Error:", exc)
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


if __name__ == '__main__':
    try:
        run_search_and_export()
    except KeyboardInterrupt:
        print('\nCancelled')
        sys.exit(0)
import os
import sys
import csv
import mysql.connector
from typing import Dict, List, Tuple


def get_db_connection():
    """Return a mysql.connector connection using environment or defaults."""
    host = os.environ.get("AGN_DB_HOST", "gateway01.eu-central-1.prod.aws.tidbcloud.com")
    user = os.environ.get("AGN_DB_USER", "4YoWi5wpZWfFZMg.root")
    password = os.environ.get("AGN_DB_PASS", "rM9HHqklqdSdDSfi")
    database = os.environ.get("AGN_DB_NAME", "agn")
    return mysql.connector.connect(host=host, user=user, password=password, database=database)


def prompt_filters() -> Dict[str, str]:
    """Interactively prompt the admin for filter values. Empty input means no filter for that field."""
    print("Enter filter values (press Enter to skip a filter).")
    filters = {}
    # Common searchable fields — keep in sync with your DB schema
    filters['mobile_no'] = input("Phone (mobile_no) contains: ").strip()
    filters['field'] = input("Field / Role (field) contains: ").strip()
    filters['experience'] = input("Experience contains: ").strip()
    filters['name'] = input("Name contains: ").strip()
    filters['email'] = input("Email contains: ").strip()
    filters['location'] = input("Location contains: ").strip()
    return {k: v for k, v in filters.items() if v}


def build_query(filters: Dict[str, str]) -> Tuple[str, List[str]]:
    """Build a parameterized SQL query and parameters from given filters.

    For textual filters we use REPLACE(LOWER(col),' ','') LIKE CONCAT('%', REPLACE(LOWER(%s),' ',''), '%')
    so that search ignores spaces and case (matches the pattern you provided).
    """
    base_cols = [
        'employee_id', 'name', 'age', 'email', 'mobile_no', 'location', 'nearest_route',
        'cnic_no', 'educational_profile', 'recent_completed_education', 'field', 'experience',
        'experience_detail', 'masked_cv'
    ]
    base = f"SELECT {', '.join(base_cols)} FROM employees"
    where_clauses = []
    params: List[str] = []

    for col, val in filters.items():
        # only allow expected columns to avoid injection
        if col not in ('mobile_no', 'field', 'experience', 'name', 'email', 'location'):
            continue
        # For phone numbers, allow like-match but don't remove digits — we still use REPLACE to ignore spaces
        clause = f"REPLACE(LOWER({col}), ' ', '') LIKE CONCAT('%', REPLACE(LOWER(%s), ' ', ''), '%')"
        where_clauses.append(clause)
        params.append(val)

    if where_clauses:
        query = base + " WHERE " + " AND ".join(where_clauses) + " LIMIT 1000"
    else:
        query = base + " LIMIT 1000"

    return query, params


def pretty_print_results(rows: List[Tuple], cols: List[str]):
    if not rows:
        print("No records to show.")
        return
    # compute column widths
    widths = [len(c) for c in cols]
    for r in rows:
        for i, v in enumerate(r):
            s = str(v) if v is not None else ''
            if len(s) > widths[i]:
                widths[i] = len(s)

    # header
    header = " | ".join(c.ljust(widths[i]) for i, c in enumerate(cols))
    sep = "-+-".join('-' * widths[i] for i in range(len(cols)))
    print(header)
    print(sep)
    for r in rows:
        line = " | ".join((str(v) if v is not None else '').ljust(widths[i]) for i, v in enumerate(r))
        print(line)


def export_to_csv(rows: List[Tuple], cols: List[str], path: str):
    with open(path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(cols)
        for r in rows:
            writer.writerow([v if v is not None else '' for v in r])
    print(f"Exported {len(rows)} rows to {path}")


def admin_panel():
    """Main interactive admin loop."""
    print("AGN Admin Panel — Employee Search")
    while True:
        print("\nOptions:\n 1) Search with filters\n 2) Show all (first 200)\n 3) Quit")
        choice = input("Choose an option (1/2/3): ").strip()
        if choice == '3' or choice.lower() == 'q':
            print("Exiting.")
            return
        if choice == '2':
            filters = {}
        elif choice == '1':
            filters = prompt_filters()
            if not filters:
                print("No filters provided — this will list up to 1000 records. Proceed? (y/n)")
                if input().strip().lower() not in ('y', 'yes'):
                    continue
        else:
            print("Invalid option")
            continue

        query, params = build_query(filters)
        conn = None
        cur = None
        try:
            conn = get_db_connection()
            cur = conn.cursor()
            cur.execute(query, tuple(params))
            rows = cur.fetchall()
            cols = [d[0] for d in cur.description] if cur.description else []
            pretty_print_results(rows, cols)

            if rows:
                if input("Export results to CSV? (y/N): ").strip().lower() in ('y', 'yes'):
                    path = input("Enter path to save CSV (e.g. /tmp/results.csv): ").strip()
                    if not path:
                        print("No path provided — skipping export.")
                    else:
                        export_to_csv(rows, cols, path)

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


