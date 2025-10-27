import mysql.connector
import os


def search_employees_by_field():
    """Prompt the user for a field and search term, then print matching employee name and masked_cv.

    Only allow searching specific columns to avoid SQL injection via column names.
    The query uses a parameterized LIKE for the search term.
    """
    allowed_fields = {
        'name',
        'email',
        'location',
        'nearest_route',
        'educational_profile',
        'applying_for',
        'experience',
    }

    # include the actual column name 'field' if present in your table (some rows show 'field')
    allowed_fields.add('field')

    print("Search employees by column. Allowed columns:", ", ".join(sorted(allowed_fields)))
    print("Example: to find people whose role is 'Software Engineer', choose column 'field' (or 'applying_for') and then enter 'Software Engineer' as the search term.")

    # ask repeatedly for a valid column name
    while True:
        field = 'field'
        if not field:
            print("Please enter a column name (or 'q' to quit).")
            continue
        if field.lower() == 'q':
            print("Aborted by user.")
            return
        if field in allowed_fields:
            break
        print("Invalid column. Choose one of:", ", ".join(sorted(allowed_fields)))

    term = input("Enter search term (will be used with LIKE): ").strip()
    if not term:
        print("Empty search term — aborting.")
        return

    # DB credentials (use env if available)
    db_host = os.environ.get('AGN_DB_HOST', 'gateway01.eu-central-1.prod.aws.tidbcloud.com')
    db_user = os.environ.get('AGN_DB_USER', '4YoWi5wpZWfFZMg.root')
    db_pass = os.environ.get('AGN_DB_PASS', 'rM9HHqklqdSdDSfi')
    db_name = os.environ.get('AGN_DB_NAME', 'agn')

    conn = None
    cur = None
    try:
        conn = mysql.connector.connect(host=db_host, user=db_user, password=db_pass, database=db_name)
        cur = conn.cursor()

        # Use REPLACE and LOWER to ignore spaces and case (matches your requested pattern)
        sql = (
            f"SELECT name, masked_cv FROM employees "
            f"WHERE REPLACE(LOWER({field}), ' ', '') "
            f"LIKE CONCAT('%', REPLACE(LOWER(%s), ' ', ''), '%')"
        )
        cur.execute(sql, (term,))
        rows = cur.fetchall()
        if not rows:
            print("No matching employees found.")
            return

        print(f"Found {len(rows)} result(s):")
        for name, masked_cv in rows:
            print(f"- {name}: {masked_cv}")

    except mysql.connector.Error as e:
        print("Database error:", e)
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





