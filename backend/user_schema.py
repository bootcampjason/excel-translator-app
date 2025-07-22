from datetime import datetime, timezone

def default_user_schema(email=""):
    return {
        "email": email,
        "charUsed": 0,
        "charLimit": 10000,
        "lastLogonTimestamp": datetime.now(timezone.utc),
        "transactions": [],
    }

def new_transaction_schema(transaction_id, amount):
    return {
        "transactionId": transaction_id,
        "timestamp": datetime.now(timezone.utc),
        "amount": amount,
    }
