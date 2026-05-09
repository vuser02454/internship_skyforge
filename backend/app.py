import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv
import razorpay

# ---------------------------------------------------
# Load environment variables
# ---------------------------------------------------
load_dotenv()

# ---------------------------------------------------
# Flask App Setup
# ---------------------------------------------------
app = Flask(__name__)

# Allow frontend connection
CORS(app)

# ---------------------------------------------------
# Supabase Configuration
# ---------------------------------------------------
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# Validate environment variables
if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    raise Exception("Missing Supabase credentials in .env file")

# Create Supabase client
supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_SERVICE_KEY
)

# ---------------------------------------------------
# Razorpay Configuration
# ---------------------------------------------------
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_dummykey123")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "dummysecret123")

razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# ---------------------------------------------------
# Root Route
# ---------------------------------------------------
@app.route("/")
def home():
    return jsonify({
        "message": "TaskForge Backend Running Successfully"
    })


# ---------------------------------------------------
# Health Check Route
# ---------------------------------------------------
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "message": "Flask API is running"
    }), 200


# ---------------------------------------------------
# Get All Users (Admin Route)
# ---------------------------------------------------
@app.route("/api/admin/users", methods=["GET"])
def get_all_users():

    try:
        # Fetch users from Supabase Auth
        response = supabase.auth.admin.list_users()

        users_data = []

        # Convert users into JSON serializable format
        for user in response.users:

            users_data.append({
                "id": user.id,
                "email": user.email,
                "created_at": user.created_at,
                "email_confirmed_at": user.email_confirmed_at,
                "last_sign_in_at": user.last_sign_in_at
            })

        return jsonify({
            "count": len(users_data),
            "users": users_data
        }), 200

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


# ---------------------------------------------------
# Create Razorpay Order
# ---------------------------------------------------
@app.route("/api/payments/create-order", methods=["POST"])
def create_payment_order():
    try:
        data = request.json
        amount = int(data.get("amount", 0)) * 100 # Razorpay takes amount in paise (1 INR = 100 Paise)
        currency = "INR"
        task_id = data.get("task_id", "receipt_1")
        
        # Developer Mock Mode if no keys are provided
        if RAZORPAY_KEY_ID == "rzp_test_dummykey123":
            import time
            return jsonify({
                "id": f"order_mock_{int(time.time())}",
                "amount": amount,
                "currency": currency,
                "receipt": task_id,
                "status": "created",
                "mock": True
            }), 200

        razorpay_order = razorpay_client.order.create(dict(
            amount=amount,
            currency=currency,
            receipt=task_id,
            payment_capture='1'
        ))
        
        # In a real app, you might save this order_id to the database first
        return jsonify(razorpay_order), 200

    except Exception as e:
        print("Razorpay Order Error:", str(e))
        return jsonify({"error": str(e)}), 500

# ---------------------------------------------------
# Verify Payment Signature
# ---------------------------------------------------
@app.route("/api/payments/verify", methods=["POST"])
def verify_payment():
    try:
        data = request.json
        razorpay_payment_id = data.get("razorpay_payment_id")
        razorpay_order_id = data.get("razorpay_order_id")
        razorpay_signature = data.get("razorpay_signature")
        task_id = data.get("task_id")

        # Developer Mock Mode Bypass
        if razorpay_order_id.startswith("order_mock_"):
            supabase.table("tasks").update({
                "status": "completed",
                "completed_at": "now()"
            }).eq("id", task_id).execute()
            return jsonify({"status": "success", "message": "Mock payment verified"}), 200

        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }
        
        # Verify the signature
        razorpay_client.utility.verify_payment_signature(params_dict)

        # Update Supabase Task to 'completed' / payment released
        supabase.table("tasks").update({
            "status": "completed"
        }).eq("id", task_id).execute()

        return jsonify({"status": "success", "message": "Payment verified and funds released"}), 200

    except razorpay.errors.SignatureVerificationError:
        return jsonify({"status": "error", "message": "Signature verification failed"}), 400
    except Exception as e:
        print("Razorpay Verify Error:", str(e))
        return jsonify({"error": str(e)}), 500


# ---------------------------------------------------
# Run Flask App
# ---------------------------------------------------
if __name__ == "__main__":
    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )