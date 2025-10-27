import mysql.connector
import os
import sys
import re
import hashlib


def _hash_password(password: str) -> str:
    """Return a hex SHA-256 hash of the given password string.

    Note: For production use, prefer a salted hashing algorithm like bcrypt.
    """
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def _is_valid_email(email: str) -> bool:
    # Basic email validation
    return bool(re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email))


def insert_employeer_signup():
    connection = None
    cursor = None
    try:
        # New table format: employer(username, comapny_name, email, password)
        print("Preparing to register employer (table: employer).")
        username = input("Enter username: ").strip()
        comapny_name = input("Enter company name: ").strip()
        email = input("Enter email: ").strip()
        if email and not _is_valid_email(email):
            print("Warning: the email entered doesn't look valid. Proceeding anyway.")
        password_raw = input("Enter password (will be stored according to AGN_USE_HASH): ")
        if not password_raw:
            print("Password empty — aborting to avoid inserting empty credentials.")
            return

        # Decide whether to hash the password before storing.
        # If AGN_USE_HASH is "1", "true" or "yes" (case-insensitive), we will hash.
        use_hash = os.environ.get("AGN_USE_HASH", "false").lower() in ("1", "true", "yes")
        if use_hash:
            password_to_store = _hash_password(password_raw)
            # SHA-256 hex length is 64 characters; the DDL's VARCHAR(15) cannot hold this.
            if len(password_to_store) > 15:
                print("Error: hashed password length (64) exceeds the database column size (15).")
                print("Please alter the `employer.password` column to VARCHAR(255) or disable hashing by setting AGN_USE_HASH=0.")
                return
        else:
            # If not hashing, ensure password fits into VARCHAR(15) (truncate with warning)
            if len(password_raw) > 15:
                print("Warning: password longer than 15 characters will be truncated to fit the database column.")
                password_to_store = password_raw[:15]
            else:
                password_to_store = password_raw

        # DB connection config (use env vars first)
        db_host = os.environ.get("AGN_DB_HOST", "gateway01.eu-central-1.prod.aws.tidbcloud.com")
        db_user = os.environ.get("AGN_DB_USER", "4YoWi5wpZWfFZMg.root")
        db_pass = os.environ.get("AGN_DB_PASS", "rM9HHqklqdSdDSfi")
        db_name = os.environ.get("AGN_DB_NAME", "agn")

        # Connect to your database
        connection = mysql.connector.connect(
            host=db_host,
            user=db_user,
            password=db_pass,
            database=db_name,
        )

        cursor = connection.cursor()

        # Insert query for `employer` table
        query = """
        INSERT INTO employer
        (username, comapny_name, email, password)
        VALUES (%s, %s, %s, %s)
        """

        values = (
            username,
            comapny_name,
            email,
            password_to_store,
        )

        # Execute and commit
        cursor.execute(query, values)
        connection.commit()

        print("✅ Employer registered successfully!")

    except mysql.connector.Error as err:
        print(f"❌ Database Error: {err}")
    except Exception as exc:
        print(f"❌ Error: {exc}")
    finally:
        try:
            if cursor:
                cursor.close()
        except Exception:
            pass
        try:
            if connection and connection.is_connected():
                connection.close()
        except Exception:
            pass



    