from flask import Blueprint, request, jsonify
from services.firestore_client import db

usage_bp = Blueprint("usage", __name__)

@usage_bp.route("/usage", methods=["GET"])
def get_usage():
    uid = request.headers.get("X-User-Id")
    if not uid:
        return jsonify({"error": "Missing user ID"}), 400

    user_ref = db.collection("users").document(uid)
    user_doc = user_ref.get()

    if not user_doc.exists:
        return jsonify({"error": "User not found"}), 404

    user_data = user_doc.to_dict()
    plan = user_data.get("currentPlan", "unavailable")
    char_used = user_data.get("charUsed", 0)
    char_limit = user_data.get("charLimit", 0)

    return jsonify({
        "plan": plan,
        "charUsed": char_used,
        "charLimit": char_limit
    })
