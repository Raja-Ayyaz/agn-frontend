import re

PHONE_REGEX_STR = r'''
    (?:
        (?:\+92|92|0)0?          # +92, 92, 0, or +920 / 920 (covers +92-0300 style)
        [\s\-\(\)]*
        3\d{2}                   # mobile code
        [\s\-\(\)]*
        \d{7}                    # 7-digit number
    )
'''
import re

PHONE_REGEX = re.compile(PHONE_REGEX_STR, re.VERBOSE)

tests = [
    "03005714594",
    "+923005714594",
    "92-3005714594",
    "92-03005714594",
    "+92-300-5714594",
    "+92-0300-5714594",   # ← your case
    "+92 300 5714594",
    "(0300)-5714594"
]

for t in tests:
    if PHONE_REGEX.search(t):
        print(f"✅ Matched: {t}")
    else:
        print(f"❌ Not matched: {t}")


EMAIL_REGEX_STR = r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+(?:\.[A-Za-z]{2,})?'

CNIC_REGEX_STR = r'\d{5}-\d{7}-\d'

PHONE_REGEX = re.compile(PHONE_REGEX_STR, re.VERBOSE)
EMAIL_REGEX = re.compile(EMAIL_REGEX_STR)
CNIC_REGEX = re.compile(CNIC_REGEX_STR)
