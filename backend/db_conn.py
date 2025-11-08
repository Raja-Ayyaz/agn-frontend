"""
Database Connection Pool Manager
Provides efficient connection pooling for MySQL/TiDB database connections.
"""
import os
import traceback
from contextlib import contextmanager
from typing import Optional
import threading

# Load environment variables from .env file
try:
    from dotenv import load_dotenv
    load_dotenv()  # Load .env file from current directory
except ImportError:
    pass  # dotenv not installed, will use system environment variables

print("🚀 Starting database pool initialization...")

DB_CONFIG = {
    'host': os.environ.get('DB_HOST') or os.environ.get('HOST', 'gateway01.eu-central-1.prod.aws.tidbcloud.com'),
    'port': int(os.environ.get('DB_PORT') or os.environ.get('PORT', 4000)),
    'user': os.environ.get('DB_USER') or os.environ.get('USER', '4YoWi5wpZWfFZMg.root'),
    'password': os.environ.get('DB_PASSWORD') or os.environ.get('PASSWORD', 'rM9HHqklqdSdDSfi'),
    'database': os.environ.get('DB_NAME', 'agn'),
    'ssl_ca': os.environ.get('DB_SSL_CA', ''),  # Empty string = no SSL cert required
}

# Connection pool configuration
POOL_CONFIG = {
    'pool_name': 'agn_pool',
    'pool_size': int(os.environ.get('DB_POOL_SIZE', 10)),  # Default 10 connections
    'pool_reset_session': True,
    'autocommit': False,
    'connect_timeout': int(os.environ.get('DB_CONNECT_TIMEOUT', 10)),
}

# Global connection pool instance
_connection_pool = None
_pool_lock = threading.Lock()


def create_pymysql_pool():
    """Create a connection pool using PyMySQLwith DBUtils."""
    try:
        import pymysql
        from dbutils.pooled_db import PooledDB
        
        print('ℹ️ Creating PyMySQL connection pool...')
        
        # TiDB Cloud requires SSL - configure based on certificate availability
        ssl_args = None
        ssl_ca_path = DB_CONFIG.get('ssl_ca', '').strip()
        
        if ssl_ca_path and os.path.isfile(ssl_ca_path):
            # If SSL certificate file exists, use it
            print(f'🔒 Using SSL certificate: {ssl_ca_path}')
            ssl_args = {'ca': ssl_ca_path}
        else:
            # TiDB Cloud requires SSL but we can connect without cert verification
            print('🔒 Using SSL without certificate file')
            ssl_args = {'ssl_disabled': False}
        
        pool = PooledDB(
            creator=pymysql,
            maxconnections=POOL_CONFIG['pool_size'],
            mincached=2,
            maxcached=5,
            maxshared=3,
            blocking=True,
            maxusage=None,
            setsession=[],
            ping=1,  # Ping MySQL server before queries
            host=DB_CONFIG['host'],
            port=DB_CONFIG['port'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            database=DB_CONFIG['database'],
            ssl=ssl_args,
            connect_timeout=POOL_CONFIG['connect_timeout'],
            autocommit=POOL_CONFIG['autocommit'],
        )
        
        # Test the pool
        conn = pool.connection()
        with conn.cursor() as cur:
            cur.execute('SELECT DATABASE(), VERSION()')
            row = cur.fetchone()
            print(f'✅ PyMySQL pool created | Database: {row[0]} | Version: {row[1]}')
        conn.close()
        
        return pool
    except ImportError:
        print('❌ PyMySQL or DBUtils not installed. Install with: pip install pymysql dbutils')
        return None
    except Exception as e:
        print('❌ PyMySQL pool creation failed:')
        print(repr(e))
        traceback.print_exc()
        return None


def create_mysql_connector_pool():
    """Create a connection pool using mysql-connector-python."""
    try:
        import mysql.connector.pooling
        
        print('ℹ️ Creating mysql.connector connection pool...')
        
        pool_config = {
            'pool_name': POOL_CONFIG['pool_name'],
            'pool_size': POOL_CONFIG['pool_size'],
            'pool_reset_session': POOL_CONFIG['pool_reset_session'],
            'host': DB_CONFIG['host'],
            'port': DB_CONFIG['port'],
            'user': DB_CONFIG['user'],
            'password': DB_CONFIG['password'],
            'database': DB_CONFIG['database'],
            'autocommit': POOL_CONFIG['autocommit'],
            'connect_timeout': POOL_CONFIG['connect_timeout'],
        }
        
        # Configure SSL based on certificate availability
        ssl_ca_path = DB_CONFIG.get('ssl_ca', '').strip()
        if ssl_ca_path and os.path.isfile(ssl_ca_path):
            print(f'🔒 Using SSL certificate: {ssl_ca_path}')
            pool_config['ssl_ca'] = ssl_ca_path
            pool_config['ssl_disabled'] = False
        else:
            print('🔒 Using SSL without certificate file')
            pool_config['ssl_disabled'] = False
        
        pool = mysql.connector.pooling.MySQLConnectionPool(**pool_config)
        
        # Test the pool
        conn = pool.get_connection()
        if conn.is_connected():
            cur = conn.cursor()
            cur.execute('SELECT DATABASE(), VERSION()')
            row = cur.fetchone()
            print(f'✅ mysql.connector pool created | Database: {row[0]} | Version: {row[1]}')
            cur.close()
            conn.close()
            return pool
        else:
            print('❌ mysql.connector pool test connection failed')
            return None
            
    except ImportError:
        print('❌ mysql-connector-python not installed. Install with: pip install mysql-connector-python')
        return None
    except Exception as e:
        print('❌ mysql.connector pool creation failed:')
        print(repr(e))
        traceback.print_exc()
        return None


def initialize_pool():
    """Initialize the global connection pool."""
    global _connection_pool
    
    with _pool_lock:
        if _connection_pool is not None:
            print('ℹ️ Connection pool already initialized')
            return _connection_pool
        
        print('ℹ️ DB config:', {k: (v if k != 'password' else '***') for k, v in DB_CONFIG.items()})
        print(f'ℹ️ Pool config: size={POOL_CONFIG["pool_size"]}, timeout={POOL_CONFIG["connect_timeout"]}s')
        
        # Try PyMySQL first (recommended for cloud databases)
        preferred = os.environ.get('DB_PREFERRED_CLIENT', '').lower()
        
        if preferred == 'mysqlconnector':
            _connection_pool = create_mysql_connector_pool()
            if _connection_pool is None:
                print('ℹ️ Falling back to PyMySQL pool...')
                _connection_pool = create_pymysql_pool()
        else:
            # Default: try PyMySQL first
            _connection_pool = create_pymysql_pool()
            if _connection_pool is None:
                print('ℹ️ Falling back to mysql.connector pool...')
                _connection_pool = create_mysql_connector_pool()
        
        if _connection_pool is None:
            raise RuntimeError('❌ Failed to create database connection pool with any driver')
        
        print('🎉 Database connection pool initialized successfully')
        return _connection_pool


def get_connection():
    """
    Get a connection from the pool.
    
    Returns:
        Database connection object
        
    Raises:
        RuntimeError: If pool is not initialized
    """
    global _connection_pool
    
    if _connection_pool is None:
        initialize_pool()
    
    try:
        # For DBUtils PooledDB (PyMySQL)
        if hasattr(_connection_pool, 'connection'):
            return _connection_pool.connection()
        # For mysql.connector pooling
        elif hasattr(_connection_pool, 'get_connection'):
            return _connection_pool.get_connection()
        else:
            raise RuntimeError('Unknown pool type')
    except Exception as e:
        print(f'❌ Failed to get connection from pool: {repr(e)}')
        traceback.print_exc()
        raise


@contextmanager
def get_db_connection():
    """
    Context manager for database connections.
    
    Usage:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM table")
            results = cursor.fetchall()
            conn.commit()
    """
    conn = None
    try:
        conn = get_connection()
        yield conn
        if not POOL_CONFIG['autocommit']:
            conn.commit()
    except Exception as e:
        if conn and not POOL_CONFIG['autocommit']:
            conn.rollback()
        print(f'❌ Database operation failed: {repr(e)}')
        raise
    finally:
        if conn:
            conn.close()


def get_pool_status():
    """Get current connection pool status (for monitoring/debugging)."""
    global _connection_pool
    
    if _connection_pool is None:
        return {'status': 'not_initialized'}
    
    status = {
        'status': 'active',
        'pool_size': POOL_CONFIG['pool_size'],
    }
    
    # Try to get additional info if available
    try:
        if hasattr(_connection_pool, '_maxconnections'):
            # DBUtils PooledDB
            status['type'] = 'PyMySQL (DBUtils)'
            status['max_connections'] = _connection_pool._maxconnections
        elif hasattr(_connection_pool, 'pool_name'):
            # mysql.connector pooling
            status['type'] = 'mysql.connector'
            status['pool_name'] = _connection_pool.pool_name
    except:
        pass
    
    return status


def close_pool():
    """Close all connections in the pool (for cleanup/shutdown)."""
    global _connection_pool
    
    with _pool_lock:
        if _connection_pool is not None:
            try:
                # DBUtils doesn't have a standard close method, connections close on their own
                # mysql.connector pools don't have a close_all method either
                print('ℹ️ Closing connection pool...')
                _connection_pool = None
                print('✅ Connection pool closed')
            except Exception as e:
                print(f'⚠️ Error closing pool: {repr(e)}')


# Legacy compatibility functions for existing code
def try_pymysql_connect(cfg, timeout=10):
    """Legacy test function - kept for backwards compatibility."""
    try:
        import pymysql
        print('ℹ️ Using PyMySQL (pure-Python) to connect...')
        ssl_args = None
        if cfg.get('ssl_ca'):
            ssl_args = {'ca': cfg['ssl_ca']}

        conn = pymysql.connect(host=cfg['host'], port=cfg['port'], user=cfg['user'],
                               password=cfg['password'], database=cfg['database'],
                               ssl=ssl_args, connect_timeout=timeout)
        print('✅ PyMySQL connected, server:', conn.get_server_info())
        with conn.cursor() as cur:
            cur.execute('SELECT DATABASE()')
            row = cur.fetchone()
            print('🎯 Using database:', row[0])
        conn.close()
        return True
    except Exception as e:
        print('❌ PyMySQL connection failed:')
        print(repr(e))
        traceback.print_exc()
        return False


def try_mysql_connector(cfg, timeout=10):
    """Legacy test function - kept for backwards compatibility."""
    try:
        import mysql.connector
        print('ℹ️ Using mysql.connector to connect...')
        conn = mysql.connector.connect(host=cfg['host'], port=cfg['port'], user=cfg['user'],
                                       password=cfg['password'], database=cfg['database'],
                                       ssl_ca=cfg.get('ssl_ca'), ssl_disabled=False,
                                       connection_timeout=timeout)
        if conn.is_connected():
            print('✅ mysql.connector connected')
            cur = conn.cursor()
            cur.execute('SELECT DATABASE()')
            row = cur.fetchone()
            print('🎯 Using database:', row[0])
            conn.close()
            return True
        else:
            print('❌ mysql.connector did not report is_connected()')
            return False
    except Exception as e:
        print('❌ mysql.connector connection failed:')
        print(repr(e))
        traceback.print_exc()
        return False


if __name__ == '__main__':
    print('='*60)
    print('DATABASE CONNECTION POOL TEST')
    print('='*60)
    
    try:
        # Initialize the pool
        pool = initialize_pool()
        
        # Test getting connections
        print('\n📊 Testing pool connections...')
        connections = []
        
        for i in range(3):
            print(f'\nTest {i+1}: Getting connection from pool...')
            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute('SELECT DATABASE(), CONNECTION_ID(), NOW()')
                row = cursor.fetchone()
                print(f'  ✅ Connection {i+1}: DB={row[0]}, ConnID={row[1]}, Time={row[2]}')
                cursor.close()
        
        # Show pool status
        print('\n📈 Pool Status:')
        status = get_pool_status()
        for key, value in status.items():
            print(f'  {key}: {value}')
        
        print('\n✅ All pool tests passed!')
        
    except Exception as e:
        print(f'\n❌ Pool test failed: {repr(e)}')
        traceback.print_exc()
    
    print('\n' + '='*60)
    print('Testing legacy connection methods...')
    print('='*60)
    
    # Legacy compatibility test
    preferred = os.environ.get('DB_PREFERRED_CLIENT', '').lower()
    if preferred == 'mysqlconnector':
        print('ℹ️ Preferred client: mysql.connector')
        if try_mysql_connector(DB_CONFIG, timeout=10):
            print('🎉 Connected with mysql.connector')
        else:
            print('ℹ️ mysql.connector failed; trying PyMySQL as fallback')
            if try_pymysql_connect(DB_CONFIG, timeout=10):
                print('🎉 Connected with PyMySQL')
            else:
                print('❌ All connection attempts failed')
    else:
        # default: try PyMySQL first (safer), then fall back to mysql.connector
        if try_pymysql_connect(DB_CONFIG, timeout=10):
            print('🎉 Connected with PyMySQL')
        else:
            print('ℹ️ Falling back to mysql.connector')
            if try_mysql_connector(DB_CONFIG, timeout=10):
                print('🎉 Connected with mysql.connector')
            else:
                print('❌ All connection attempts failed')
