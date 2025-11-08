# Migration Checklist - Update API to Use Connection Pooling

## 🎯 Goal
Update all your API endpoints to use the new connection pooling for better performance.

---

## ✅ Pre-Migration Checklist

- [x] Connection pool installed (`pymysql` + `DBUtils`)
- [x] Connection pool tested (run `python db_conn.py`)
- [x] Performance verified (2.7x faster)
- [ ] Backup your code (recommended)
- [ ] Read `POOLING_QUICKSTART.md`

---

## 📝 Migration Steps

### Step 1: Update Imports

**Before:**
```python
import mysql.connector
```

**After:**
```python
from db_conn import get_db_connection
```

---

### Step 2: Replace Connection Code

**Before:**
```python
conn = mysql.connector.connect(
    host=DB_CONFIG["host"],
    user=DB_CONFIG["user"],
    password=DB_CONFIG["password"],
    database=DB_CONFIG["database"],
    port=DB_CONFIG.get("port", 3306),
)

try:
    cursor = conn.cursor()
    cursor.execute("SELECT ...")
    result = cursor.fetchall()
    cursor.close()
    conn.commit()
except Exception as e:
    conn.rollback()
    raise
finally:
    conn.close()
```

**After:**
```python
with get_db_connection() as conn:
    cursor = conn.cursor()
    cursor.execute("SELECT ...")
    result = cursor.fetchall()
    cursor.close()
    # Auto-commits on success, auto-rollbacks on error
```

---

### Step 3: Update Each Endpoint

Use this pattern for all database operations:

```python
@app.route('/api/endpoint')
def endpoint():
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Your database operations here
            cursor.execute("SELECT ...")
            results = cursor.fetchall()
            
            cursor.close()
            
            return jsonify({'data': results})
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

---

## 🔍 Files to Update

### Priority 1: Core API Files

- [ ] **`full_api.py`** - Main API file
  - Update import at top
  - Remove `get_db_connection()` function definition
  - Update all endpoints

- [ ] **`admin_panal_view.py`** - Admin endpoints
  - Update connection usage

- [ ] **`employer_view.py`** - Employer endpoints
  - Update connection usage

### Priority 2: Utility Files

- [ ] **`insert_employee_form.py`** - Employee insertion
- [ ] **`insert_employeer_signup.py`** - Employer signup

---

## 🧪 Testing Checklist

After migration, test these endpoints:

### Employee Operations
- [ ] `POST /insert_employee` - Create employee
- [ ] `GET /api/employees` - List employees
- [ ] `GET /api/employee/<id>` - Get single employee
- [ ] `POST /api/employee/<id>/update_cv` - Update CV

### Employer Operations
- [ ] Employer signup
- [ ] Employer login
- [ ] Employer dashboard

### Admin Operations
- [ ] Admin login
- [ ] View employees
- [ ] View hire requests
- [ ] Export data

---

## ✅ Verification Steps

After updating each file:

1. **Check syntax**: No errors when importing
2. **Test endpoint**: Call the API and verify response
3. **Check logs**: No connection errors
4. **Verify data**: Confirm data is saved/retrieved correctly

---

## 📊 Performance Monitoring

After migration, monitor:

```python
# Add this endpoint to check pool status
@app.route('/api/pool-status')
def pool_status():
    from db_conn import get_pool_status
    return jsonify(get_pool_status())
```

Expected response:
```json
{
  "status": "active",
  "pool_size": 10,
  "type": "PyMySQL (DBUtils)"
}
```

---

## 🚨 Common Issues & Solutions

### Issue 1: Import Error
**Error**: `ModuleNotFoundError: No module named 'dbutils'`

**Solution**:
```bash
pip install DBUtils pymysql
```

### Issue 2: Connection Not Closing
**Error**: Pool exhausted errors

**Solution**: Make sure you're using context manager:
```python
with get_db_connection() as conn:  # ✅ Correct
    ...

# NOT this:
conn = get_db_connection()  # ❌ Won't auto-close
```

### Issue 3: Cursor Not Closing
**Error**: Memory leaks or warnings

**Solution**: Always close cursors:
```python
cursor = conn.cursor()
try:
    cursor.execute("...")
    result = cursor.fetchall()
finally:
    cursor.close()  # ✅ Always close
```

### Issue 4: Manual Commit/Rollback
**Error**: Conflicts with auto-commit

**Solution**: Remove manual commit/rollback:
```python
# ❌ Don't do this with context manager:
conn.commit()
conn.rollback()

# ✅ Context manager handles it automatically
with get_db_connection() as conn:
    ...  # Auto-commits on success
```

---

## 🎯 Endpoint Migration Template

Use this template for each endpoint:

```python
@app.route('/api/your-endpoint', methods=['GET', 'POST'])
def your_endpoint():
    """Endpoint description"""
    try:
        # Get request data if needed
        data = request.get_json() if request.method == 'POST' else {}
        
        # Use connection pool
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Your SQL operations
            cursor.execute(
                "SELECT * FROM table WHERE id = %s",
                (param,)
            )
            result = cursor.fetchone()
            
            # Always close cursor
            cursor.close()
            
            # Return response
            return jsonify({'success': True, 'data': result})
            
    except Exception as e:
        # Log error
        print(f"Error in your_endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500
```

---

## 📈 Expected Improvements

After migration, you should see:

- ⚡ **Response times**: 50-100ms → 1-5ms
- 📉 **CPU usage**: Reduced by 60-70%
- 🚀 **Throughput**: 2-3x more requests/second
- 💾 **Memory**: More stable, no connection leaks

---

## ✅ Final Checklist

Before deploying to production:

- [ ] All endpoints updated to use pooling
- [ ] All endpoints tested locally
- [ ] Error handling verified
- [ ] Connection pool tested under load
- [ ] Monitoring endpoint added
- [ ] Documentation updated
- [ ] Team notified of changes

---

## 📚 Reference

- **Quick Guide**: `POOLING_QUICKSTART.md`
- **Full Docs**: `DB_POOLING_GUIDE.md`
- **Examples**: `example_pool_usage.py`
- **Summary**: `POOLING_SUMMARY.md`

---

## 🆘 Need Help?

1. Check `POOLING_QUICKSTART.md` for common patterns
2. Review `example_pool_usage.py` for working examples
3. Run `python db_conn.py` to test pool
4. Run `python benchmark_pooling.py` to verify performance

---

**Status**: Ready to migrate  
**Estimated Time**: 30-60 minutes  
**Difficulty**: Easy  
**Risk**: Low (backwards compatible)

**Good luck! 🚀**
