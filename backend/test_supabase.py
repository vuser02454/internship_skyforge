import os
from dotenv import load_dotenv
from supabase import create_client

# -----------------------------------
# Load environment variables
# -----------------------------------
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# -----------------------------------
# Validate environment variables
# -----------------------------------
if not SUPABASE_URL:
    raise Exception("❌ SUPABASE_URL missing")

if not SUPABASE_SERVICE_KEY:
    raise Exception("❌ SUPABASE_SERVICE_KEY missing")

print(f"✅ URL Loaded: {SUPABASE_URL}")

# -----------------------------------
# Create Supabase Client
# -----------------------------------
supabase = create_client(
    SUPABASE_URL,
    SUPABASE_SERVICE_KEY
)

# -----------------------------------
# Fetch users
# -----------------------------------
try:

    response = supabase.auth.admin.list_users()

    print("\n✅ Users fetched successfully\n")

    print("Response Type:", type(response))

    print(f"Total Users: {len(response)}\n")

    for user in response:

        print("-----------------------------------")

        # Handle dict or object safely
        user_id = user.get("id") if isinstance(user, dict) else getattr(user, "id", None)
        email = user.get("email") if isinstance(user, dict) else getattr(user, "email", None)

        print(f"User ID : {user_id}")
        print(f"Email   : {email}")

        print("-----------------------------------\n")

except Exception as e:

    print("\n❌ Error while fetching users")
    print("Error:", str(e))