import unittest
from unittest.mock import patch
from app import app

class CheckoutSessionTest(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    @patch("stripe.checkout.Session.create")
    def test_checkout_success(self, mock_create_session):
        mock_create_session.return_value = type("obj", (object,), {"url": "https://mock.stripe.checkout"})()

        response = self.client.post("/create-checkout-session", json={
            "uid": "test-user-123",
            "priceId": "price_abc123"
        })

        self.assertEqual(response.status_code, 200)
        self.assertIn("url", response.get_json())

    def test_checkout_missing_fields(self):
        response = self.client.post("/create-checkout-session", json={
            "uid": "test-user-123"
        })
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.get_json())

    @patch("stripe.checkout.Session.create", side_effect=Exception("Stripe failure"))
    def test_checkout_stripe_failure(self, mock_create_session):
        response = self.client.post("/create-checkout-session", json={
            "uid": "test-user-123",
            "priceId": "price_abc123"
        })
        self.assertEqual(response.status_code, 500)
        self.assertIn("error", response.get_json())

if __name__ == "__main__":
    unittest.main()
