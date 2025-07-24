from flask import Blueprint, request, jsonify
from services.firestore_client import db
from firebase_admin import firestore
import stripe
import os
from datetime import datetime, timezone
from schemas.user_schema import new_transaction_schema
from constants.plans import PLANS

payment_bp = Blueprint("payment", __name__)

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
BASE_URL = os.environ.get("BASE_URL", "http://localhost:3000")
STRIPE_STARTER_PRICE_ID = os.getenv("STRIPE_STARTER_PRICE_ID")
STRIPE_PRO_PRICE_ID = os.getenv("STRIPE_PRO_PRICE_ID")


@payment_bp.route("/create-checkout-session", methods=["POST"])
def create_checkout_session():
    try:
        data = request.get_json()
        uid = data.get("uid")
        plan = data.get("plan").lower()

        if not uid or not plan:
            return jsonify({"error": "Missing uid or plan"}), 400

        price_id = PLANS[plan]["priceId"]

        if not price_id:
            raise RuntimeError(f"[ERROR] No price ID set for plan: {plan}")

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            line_items=[{"price": price_id, "quantity": 1}],
            success_url=f"{BASE_URL}/payment-success",
            cancel_url=f"{BASE_URL}/payment-cancel",
            metadata={"uid": uid, "plan": plan},
            locale="auto",
        )

        return jsonify({"url": session.url})

    except stripe.error.StripeError as e:
        print(f"[STRIPE ERROR] {e}")
        return jsonify({"error": "A payment error occurred. Please try again."}), 500

    except Exception as e:
        print(f"[SERVER ERROR] Unexpected error during checkout session creation: {e}")
        return (
            jsonify({"error": "An unexpected error occurred. Please try again."}),
            500,
        )


@payment_bp.route("/stripe-webhook", methods=["POST"])
def stripe_webhook():
    
    print('[INFO] Stripe webhook received')

    payload = request.data
    sig_header = request.headers.get("Stripe-Signature")
    webhook_secret = os.environ.get("STRIPE_WEBHOOK_SECRET")
    
    print(f"[WEBHOOK] Received payload: {payload[:100]}...")  # Log first 100 chars
    print(f"[WEBHOOK] Signature header: {sig_header}")
    print(f"[WEBHOOK] Webhook secret: {webhook_secret}")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
    except stripe.error.SignatureVerificationError:
        print("[WEBHOOK ERROR] Signature verification failed.")
        return jsonify({"error": "Invalid signature"}), 400
    except Exception as e:
        print(f"[WEBHOOK ERROR] {e}")
        return jsonify({"error": "Webhook error"}), 400

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        uid = session["metadata"].get("uid")
        plan = session["metadata"].get("plan").lower()
        amount_paid = session.get("amount_total", 0) // 100  # cents to USD
        print(
            f"[WEBHOOK] Payment success for uid={uid}, plan={plan} amount=${amount_paid}"
        )

        # Update Firestore user document
        if uid and plan:
            user_ref = db.collection("users").document(uid)

            try:
                user_doc = user_ref.get()
                if user_doc.exists:
                    user_data = user_doc.to_dict()
                    current_limit = user_data.get("charLimit", 0)
                    additional_limit = PLANS[plan]["charLimit"]
                    
                    user_ref.update({
                        "currentPlan": plan,
                        "charLimit": current_limit + additional_limit,
                        "lastReset": firestore.SERVER_TIMESTAMP,
                        "transactions": firestore.ArrayUnion([
                            new_transaction_schema(session.id, amount_paid)
                        ])
                    })
                    
                    print("[WEBHOOK] User document updated.")
                    
            except Exception as e:
                print(f"[WEBHOOK ERROR] Failed to update user doc: {e}")

    return jsonify({"received": True}), 200
