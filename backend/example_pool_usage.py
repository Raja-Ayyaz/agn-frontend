"""
Example: How to use database connection pooling in your API

This file demonstrates the recommended patterns for using the connection pool
in your Flask API endpoints.
"""

from flask import Flask, jsonify, request
from db_conn import get_db_connection, get_pool_status

app = Flask(__name__)

# ============================================================================
# EXAMPLE 1: Simple SELECT Query
# ============================================================================

@app.route('/api/employee/<int:emp_id>')
def get_employee(emp_id):
    """Get a single employee by ID"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT id, name, email, mobile_no FROM employees WHERE id = %s",
                (emp_id,)
            )
            row = cursor.fetchone()
            cursor.close()
            
            if row:
                return jsonify({
                    'id': row[0],
                    'name': row[1],
                    'email': row[2],
                    'mobile_no': row[3]
                })
            return jsonify({'error': 'Employee not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================================
# EXAMPLE 2: INSERT Query
# ============================================================================

@app.route('/api/employee/create', methods=['POST'])
def create_employee():
    """Create a new employee"""
    data = request.get_json()
    
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            query = """
                INSERT INTO employees (name, email, mobile_no, location)
                VALUES (%s, %s, %s, %s)
            """
            
            cursor.execute(query, (
                data['name'],
                data['email'],
                data['mobile_no'],
                data.get('location', '')
            ))
            
            employee_id = cursor.lastrowid
            cursor.close()
            # Auto-commits when exiting the context manager
            
            return jsonify({
                'success': True,
                'employee_id': employee_id
            }), 201
            
    except Exception as e:
        # Auto-rollback happens in the context manager
        return jsonify({'error': str(e)}), 500


# ============================================================================
# EXAMPLE 3: UPDATE Query
# ============================================================================

@app.route('/api/employee/<int:emp_id>/update', methods=['PUT'])
def update_employee(emp_id):
    """Update employee information"""
    data = request.get_json()
    
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Build dynamic update query
            updates = []
            values = []
            
            if 'name' in data:
                updates.append("name = %s")
                values.append(data['name'])
            if 'email' in data:
                updates.append("email = %s")
                values.append(data['email'])
            if 'mobile_no' in data:
                updates.append("mobile_no = %s")
                values.append(data['mobile_no'])
            
            if not updates:
                return jsonify({'error': 'No fields to update'}), 400
            
            values.append(emp_id)
            query = f"UPDATE employees SET {', '.join(updates)} WHERE id = %s"
            
            cursor.execute(query, values)
            affected = cursor.rowcount
            cursor.close()
            
            return jsonify({
                'success': True,
                'rows_affected': affected
            })
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================================
# EXAMPLE 4: Multiple Queries in Transaction
# ============================================================================

@app.route('/api/employee/<int:emp_id>/transfer', methods=['POST'])
def transfer_employee(emp_id):
    """Transfer employee to new department (transactional)"""
    data = request.get_json()
    new_dept = data.get('department_id')
    
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Get current department
            cursor.execute(
                "SELECT department_id FROM employees WHERE id = %s",
                (emp_id,)
            )
            result = cursor.fetchone()
            if not result:
                return jsonify({'error': 'Employee not found'}), 404
            
            old_dept = result[0]
            
            # Update employee department
            cursor.execute(
                "UPDATE employees SET department_id = %s WHERE id = %s",
                (new_dept, emp_id)
            )
            
            # Log the transfer
            cursor.execute(
                """
                INSERT INTO employee_history 
                (employee_id, old_department_id, new_department_id, changed_at)
                VALUES (%s, %s, %s, NOW())
                """,
                (emp_id, old_dept, new_dept)
            )
            
            cursor.close()
            # Both queries commit together or rollback together
            
            return jsonify({'success': True})
            
    except Exception as e:
        # Automatic rollback on error
        return jsonify({'error': str(e)}), 500


# ============================================================================
# EXAMPLE 5: Bulk Operations
# ============================================================================

@app.route('/api/employees/bulk-create', methods=['POST'])
def bulk_create_employees():
    """Create multiple employees efficiently"""
    employees = request.get_json()
    
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            query = """
                INSERT INTO employees (name, email, mobile_no)
                VALUES (%s, %s, %s)
            """
            
            # Prepare data tuples
            data = [
                (emp['name'], emp['email'], emp['mobile_no'])
                for emp in employees
            ]
            
            cursor.executemany(query, data)
            rows_inserted = cursor.rowcount
            cursor.close()
            
            return jsonify({
                'success': True,
                'rows_inserted': rows_inserted
            }), 201
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================================
# EXAMPLE 6: Search with Pagination
# ============================================================================

@app.route('/api/employees/search')
def search_employees():
    """Search employees with pagination"""
    name_query = request.args.get('name', '')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))
    offset = (page - 1) * per_page
    
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Count total results
            cursor.execute(
                "SELECT COUNT(*) FROM employees WHERE name LIKE %s",
                (f'%{name_query}%',)
            )
            total = cursor.fetchone()[0]
            
            # Get paginated results
            cursor.execute(
                """
                SELECT id, name, email, mobile_no 
                FROM employees 
                WHERE name LIKE %s
                ORDER BY name
                LIMIT %s OFFSET %s
                """,
                (f'%{name_query}%', per_page, offset)
            )
            
            rows = cursor.fetchall()
            cursor.close()
            
            employees = [
                {
                    'id': row[0],
                    'name': row[1],
                    'email': row[2],
                    'mobile_no': row[3]
                }
                for row in rows
            ]
            
            return jsonify({
                'employees': employees,
                'total': total,
                'page': page,
                'per_page': per_page,
                'total_pages': (total + per_page - 1) // per_page
            })
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================================
# EXAMPLE 7: Pool Monitoring Endpoint
# ============================================================================

@app.route('/api/pool-status')
def pool_status():
    """Get current pool status (for monitoring)"""
    status = get_pool_status()
    return jsonify(status)


# ============================================================================
# EXAMPLE 8: Health Check with Database Ping
# ============================================================================

@app.route('/api/health')
def health_check():
    """Health check endpoint that verifies database connectivity"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT 1")
            cursor.fetchone()
            cursor.close()
            
            return jsonify({
                'status': 'healthy',
                'database': 'connected'
            })
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'database': 'disconnected',
            'error': str(e)
        }), 503


if __name__ == '__main__':
    print("Starting Flask app with connection pooling...")
    app.run(debug=True, port=8000)
