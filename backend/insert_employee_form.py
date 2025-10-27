import mysql.connector
import os
import sys
import re


def insert_employee_pannel():
    connection = None
    cursor = None
    try:
        # Helper to ensure user enters either a string (non-empty) or the literal 'no'
        def get_text_or_no(prompt: str, allow_empty: bool = False) -> str:
            while True:
                val = input(prompt).strip()
                if not val and allow_empty:
                    return ""
                if val.lower() == "no":
                    return "no"
                # reject numeric-only inputs (we expect textual)
                if any(ch.isalpha() for ch in val):
                    return val
                print("Please enter text (letters) or 'no' — numbers only are not allowed for this field.")

        def get_email_or_no(prompt: str) -> str:
            rx = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
            while True:
                val = input(prompt).strip()
                if not val:
                    print("Input required — please enter an email address or 'no'.")
                    continue
                if val.lower() == 'no':
                    return 'no'
                if rx.match(val):
                    return val
                print("Invalid email format — enter a valid email like user@example.com or 'no'.")

        def get_digits_or_no(prompt: str, min_len: int = 5, max_len: int = 30) -> str:
            """Prompt for digits (phone/CNIC) or literal 'no'."""
            while True:
                val = input(prompt).strip()
                if not val:
                    print("Input required — please enter digits or 'no'.")
                    continue
                if val.lower() == 'no':
                    return 'no'
                # allow digits, spaces, + and - commonly found in phone numbers
                cleaned = val.replace(' ', '').replace('+', '').replace('-', '')
                if cleaned.isdigit() and min_len <= len(cleaned) <= max_len:
                    return val
                print(f"Invalid numeric input — please enter digits (length {min_len}-{max_len}) or 'no'.")

        # Collect inputs first (avoid inline assignment inside tuple)
        name = input("Enter name: ").strip()
        age_raw = input("Enter age: ").strip()
        try:
            age = int(age_raw) if age_raw else None
        except ValueError:
            print("Invalid age entered. Please enter a number.")
            return

        email = get_email_or_no("Enter email (or 'no'): ")
        mobile_no = get_digits_or_no("Enter mobile number (digits or 'no'): ")
        location = get_text_or_no("Enter location (text or 'no'): ")
        nearest_route = get_text_or_no("Enter nearest route (text or 'no'): ")
        cnic_no = get_digits_or_no("Enter CNIC number (digits or 'no'): ", min_len=10, max_len=20)
        educational_profile = get_text_or_no("Enter educational profile (text or 'no'): ")
        recent_completed_education = get_text_or_no("Enter recent completed education (text or 'no'): ")
        field= get_text_or_no("Enter applying for (text or 'no'): ")
        experience = get_text_or_no("Enter experience (text or 'no'): ")
        experience_detail = get_text_or_no("Enter experience detail (text or 'no'): ")
        cv_link = get_text_or_no("Enter CV link (or 'no'): ")
        masked_cv_link = get_text_or_no("Enter the masked CV link (or 'no'): ")

        # Connect to your database
        connection = mysql.connector.connect(
            host="gateway01.eu-central-1.prod.aws.tidbcloud.com",  # Change if using external server
            user="4YoWi5wpZWfFZMg.root",
            password="rM9HHqklqdSdDSfi",
            database="agn",
        )

        cursor = connection.cursor()

        # Insert query — ensure column list and VALUES placeholders match the values tuple
        query = """
        INSERT INTO employees
        (name, age, email, mobile_no, location, nearest_route, cnic_no, educational_profile,
         recent_completed_education, field, experience, experience_detail, cv, masked_cv)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        values = (
            name,
            age,
            email,
            mobile_no,
            location,
            nearest_route,
            cnic_no,
            educational_profile,
            recent_completed_education,
            field,
            experience,
            experience_detail,
            cv_link,
            masked_cv_link,
        )

        # Execute and commit
        cursor.execute(query, values)
        connection.commit()

        print("✅ Data inserted successfully!")

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



