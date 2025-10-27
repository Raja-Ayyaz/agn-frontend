import os
import traceback

print("🚀 Starting connection test...")

DB_CONFIG = {
    'host': os.environ.get('DB_HOST', 'gateway01.eu-central-1.prod.aws.tidbcloud.com'),
    'port': int(os.environ.get('DB_PORT', 4000)),
    'user': os.environ.get('DB_USER', '4YoWi5wpZWfFZMg.root'),
    'password': os.environ.get('DB_PASSWORD', 'rM9HHqklqdSdDSfi'),
    'database': os.environ.get('DB_NAME', 'agn'),
    'ssl_ca': os.environ.get('DB_SSL_CA', r'D:\\\\AGN website\\\\backend\\\\isrgrootx1.pem'),
}

def try_pymysql_connect(cfg, timeout=10):
    try:
        import pymysql
        print('ℹ️ Using PyMySQL (pure-Python) to connect...')
        # PyMySQL expects ssl argument as dict when using a CA
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
    print('ℹ️ DB config:', {k: (v if k!='password' else '***') for k, v in DB_CONFIG.items()})
    # Allow choosing preferred client via env var. Values: 'pymysql' or 'mysqlconnector'.
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
