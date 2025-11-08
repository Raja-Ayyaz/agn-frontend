import sys
from db_conn import get_db_connection

print("Testing database query...")

try:
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Check total count
        cursor.execute("SELECT COUNT(*) FROM employees")
        count = cursor.fetchone()[0]
        print(f"\nTotal employees in database: {count}")
        
        # Get sample data
        cursor.execute("SELECT employee_id, name, field, experience FROM employees LIMIT 5")
        rows = cursor.fetchall()
        print("\nSample employees:")
        for row in rows:
            print(f"  ID: {row[0]}, Name: {row[1]}, Field: {row[2]}, Experience: {row[3]}")
        
        # Test the actual search query that's failing
        print("\n\nTesting search for 'Software Engineer':")
        test_role = "Software Engineer"
        sql = "SELECT * FROM employees WHERE REPLACE(LOWER(field),' ','') LIKE CONCAT('%%', REPLACE(LOWER(%s),' ',''), '%%') LIMIT 100"
        print(f"SQL: {sql}")
        print(f"Param: {test_role}")
        cursor.execute(sql, (test_role,))
        results = cursor.fetchall()
        print(f"Results: {len(results)} rows")
        
        # Also try the fallback query
        print("\nTrying fallback query:")
        fallback_sql = "SELECT * FROM employees WHERE LOWER(field) LIKE CONCAT('%%', LOWER(%s), '%%') LIMIT 100"
        print(f"SQL: {fallback_sql}")
        cursor.execute(fallback_sql, (test_role,))
        results2 = cursor.fetchall()
        print(f"Results: {len(results2)} rows")
        if results2:
            print("\nMatched employees:")
            for r in results2[:3]:
                print(f"  ID: {r[0]}, Name: {r[1]}, Field: {r[2]}")
        
        cursor.close()
        
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
