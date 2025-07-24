from datetime import datetime, timezone

def default_user_schema(email=""):
    return {
        "email": email,
        "currentPlan": "free",
        "charUsed": 0,
        "charLimit": 10000,
        "lastLogonTimestamp": datetime.now(timezone.utc),
        "lastSignoutTimestamp": datetime.now(timezone.utc),
        "transactions": [],
    }

def new_transaction_schema(transaction_id, amount):
    return {
        "transactionId": transaction_id,
        "timestamp": datetime.now(timezone.utc),
        "amount": amount,
    }

# Example usage:
{
  "email": "jane.doe@example.com",
  "currentPlan": "pro",
  "charUsed": 7321,
  "charLimit": 50000,
  "lastLogonTimestamp": "2025-07-22T17:42:11.829Z",
  "lastSignoutTimestamp": "2025-07-22T18:00:00.000Z",
  "transactions": [
    {
      "transactionId": "txn_abc123456789",
      "timestamp": "2025-07-20T13:22:45.613Z",
      "amount": 20
    }
  ]
}