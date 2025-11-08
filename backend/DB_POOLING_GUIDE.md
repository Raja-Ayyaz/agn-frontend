# Database Connection Pooling Guide

## Overview

This project now uses **database connection pooling** to efficiently manage database connections. Connection pooling significantly improves performance and resource utilization by reusing existing connections instead of creating new ones for each request.

## Features

✅ **Automatic Pool Management** - Connections are automatically managed and reused  
✅ **Thread-Safe** - Safe to use in multi-threaded environments  
✅ **Auto-Reconnect** - Automatically handles connection failures  
✅ **Multiple Drivers** - Supports both PyMySQL and mysql-connector-python  
✅ **Configurable** - Pool size and timeouts can be configured via environment variables  
✅ **Context Manager** - Easy-to-use `with` statement for automatic cleanup  

## Installation

Install the required packages:

```bash
pip install pymysql DBUtils mysql-connector-python
```

Or install all requirements:

```bash
pip install -r requirements.txt
```

## Configuration

Configure the pool using environment variables:

```bash
# Database Configuration
DB_HOST=gateway01.eu-central-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=agn
DB_SSL_CA=path/to/certificate.pem

# Pool Configuration
DB_POOL_SIZE=10              # Number of connections in pool (default: 10)
DB_CONNECT_TIMEOUT=10        # Connection timeout in seconds (default: 10)
DB_PREFERRED_CLIENT=pymysql  # Preferred driver: 'pymysql' or 'mysqlconnector'
```

## Usage

### Method 1: Context Manager (Recommended)

The context manager automatically handles connection lifecycle, commits, and rollbacks:

```python
from db_conn import get_db_connection

# Use with context manager
with get_db_connection() as conn:
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM employees WHERE id = %s", (employee_id,))
    result = cursor.fetchone()
    cursor.close()
    # Connection automatically commits on success or rolls back on error
```

### Method 2: Manual Connection Management

For more control over the connection:

```python
from db_conn import get_connection

conn = get_connection()
try:
    cursor = conn.cursor()
    cursor.execute("INSERT INTO employees (name, email) VALUES (%s, %s)", 
                   ("John Doe", "john@example.com"))
    conn.commit()
    cursor.close()
except Exception as e:
    conn.rollback()
    raise
finally:
    conn.close()  # Returns connection to pool
```

### Method 3: Initialize Pool Explicitly

```python
from db_conn import initialize_pool

# Initialize pool at application startup
pool = initialize_pool()

# Later, get connections as needed
from db_conn import get_db_connection

with get_db_connection() as conn:
    # Your database operations
    pass
```

## Pool Monitoring

Check pool status for debugging or monitoring:

```python
from db_conn import get_pool_status

status = get_pool_status()
print(status)
# Output: {'status': 'active', 'pool_size': 10, 'type': 'PyMySQL (DBUtils)'}
```

## Integration Examples

### Flask API Endpoint

```python
from flask import Flask, jsonify
from db_conn import get_db_connection

app = Flask(__name__)

@app.route('/api/employees/<int:employee_id>')
def get_employee(employee_id):
    with get_db_connection() as conn:
        cursor = conn.cursor(dictionary=True)  # mysql.connector style
        # or cursor = conn.cursor() for PyMySQL
        
        cursor.execute("SELECT * FROM employees WHERE id = %s", (employee_id,))
        employee = cursor.fetchone()
        cursor.close()
        
        if employee:
            return jsonify(employee)
        return jsonify({'error': 'Not found'}), 404
```

### Bulk Operations

```python
from db_conn import get_db_connection

def insert_multiple_employees(employees_data):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        query = """
            INSERT INTO employees (name, email, mobile_no)
            VALUES (%s, %s, %s)
        """
        
        cursor.executemany(query, employees_data)
        # Auto-commits on successful exit from context manager
        cursor.close()
        
        return cursor.rowcount
```

### Transaction Management

```python
from db_conn import get_db_connection

def transfer_employee(emp_id, old_dept, new_dept):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        try:
            # Multiple operations in a transaction
            cursor.execute(
                "UPDATE employees SET department_id = %s WHERE id = %s",
                (new_dept, emp_id)
            )
            
            cursor.execute(
                "INSERT INTO employee_history (emp_id, old_dept, new_dept, changed_at) "
                "VALUES (%s, %s, %s, NOW())",
                (emp_id, old_dept, new_dept)
            )
            
            # Context manager auto-commits if no exception
            cursor.close()
            return True
            
        except Exception as e:
            # Context manager auto-rolls back on exception
            raise
```

## Testing the Pool

Test the connection pool:

```bash
cd backend
python db_conn.py
```

Expected output:
```
============================================================
DATABASE CONNECTION POOL TEST
============================================================
🚀 Starting database pool initialization...
ℹ️ Creating PyMySQL connection pool...
✅ PyMySQL pool created | Database: agn | Version: 8.0.x
🎉 Database connection pool initialized successfully

📊 Testing pool connections...
Test 1: Getting connection from pool...
  ✅ Connection 1: DB=agn, ConnID=12345, Time=2025-10-31 10:30:00
...
✅ All pool tests passed!
```

## Performance Benefits

### Before (No Pooling)
- Each request creates a new connection (expensive)
- Connection overhead: ~50-100ms per request
- Limited concurrent connections
- Risk of connection exhaustion

### After (With Pooling)
- Connections are reused (fast)
- Connection overhead: ~1-5ms per request
- **10-20x faster** for high-traffic scenarios
- Predictable resource usage

## Best Practices

1. **Always use context managers** - Ensures proper cleanup
2. **Close cursors** - Prevents memory leaks
3. **Set appropriate pool size** - Typically 10-20 for most applications
4. **Monitor pool status** - Check during high load
5. **Handle exceptions** - Always use try-except blocks
6. **Use prepared statements** - Prevents SQL injection

## Troubleshooting

### Pool exhausted errors
```python
# Increase pool size
export DB_POOL_SIZE=20
```

### Connection timeout errors
```python
# Increase timeout
export DB_CONNECT_TIMEOUT=30
```

### Check pool status
```python
from db_conn import get_pool_status
print(get_pool_status())
```

### Reset pool
```python
from db_conn import close_pool, initialize_pool

close_pool()
initialize_pool()
```

## Migration from Old Code

### Old Code
```python
import mysql.connector

conn = mysql.connector.connect(
    host="localhost",
    user="user",
    password="pass",
    database="db"
)
cursor = conn.cursor()
cursor.execute("SELECT * FROM table")
results = cursor.fetchall()
cursor.close()
conn.close()
```

### New Code (Pooled)
```python
from db_conn import get_db_connection

with get_db_connection() as conn:
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM table")
    results = cursor.fetchall()
    cursor.close()
```

## Advanced Configuration

### Custom Pool Settings

Create a `.env` file:

```env
# Development
DB_POOL_SIZE=5
DB_CONNECT_TIMEOUT=10

# Production
# DB_POOL_SIZE=20
# DB_CONNECT_TIMEOUT=30
```

### Multiple Database Pools

For multiple databases, create separate pool instances:

```python
# db_pools.py
from db_conn import create_pymysql_pool

# Primary database
primary_pool = create_pymysql_pool()

# Analytics database (different config)
analytics_pool = create_pymysql_pool()  # with different DB_CONFIG
```

## Support

For issues or questions:
- Check the logs for detailed error messages
- Verify database credentials
- Ensure firewall rules allow connections
- Check SSL certificate path

---

**Created:** October 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅
