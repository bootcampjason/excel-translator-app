import os

PLANS = {
    "free": {
        "charLimit": 10000,
        "priceId": None
    },
    "starter": {
        "charLimit": 50000,
        "priceId": os.getenv("STRIPE_STARTER_PRICE_ID")
    },
    "pro": {
        "charLimit": 200000,
        "priceId": os.getenv("STRIPE_PRO_PRICE_ID")
    }
}
