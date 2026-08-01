"""
AgriSphere AI — Comprehensive Authentication Redesign Test Suite
Verifies bcrypt password hashing, 201 Created registration, 409 Conflict duplicate rejection,
401 Unauthorized login rejection, zero auto-user creation on login, and JWT/RBAC compatibility.
"""
import unittest
import time
from fastapi.testclient import TestClient
from app.main import app
from app.database.session import init_db, get_db
from app.repositories import farmer_repository
from app.core.security import verify_password, decode_access_token

client = TestClient(app)


class TestAuthRedesign(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        cls.test_phone = f"+919{int(time.time())}"
        cls.test_password = "SecurePassword123"

    def test_01_register_user_success(self):
        """Registering a new account returns 201 Created and stores bcrypt password_hash."""
        payload = {
            "name": "Auth Test Farmer",
            "phone": self.test_phone,
            "password": self.test_password,
            "role": "admin",  # Attacker attempts to register as admin
        }
        res = client.post("/api/v1/auth/register", json=payload)
        self.assertEqual(res.status_code, 201)
        data = res.json()["data"]
        self.assertEqual(data["phone"], self.test_phone)
        self.assertEqual(data["role"], "farmer")  # Must be forced to farmer

        # Verify password_hash stored in DB
        db = next(get_db())
        farmer = farmer_repository.get_by_phone(db, self.test_phone)
        self.assertIsNotNone(farmer)
        self.assertIsNotNone(farmer.password_hash)
        self.assertTrue(farmer.password_hash.startswith("$2b$"))
        self.assertTrue(verify_password(self.test_password, farmer.password_hash))

    def test_02_register_duplicate_phone_rejected_409(self):
        """Attempting to register an existing phone returns 409 Conflict."""
        payload = {
            "name": "Duplicate Farmer",
            "phone": self.test_phone,
            "password": "AnotherPassword123",
        }
        res = client.post("/api/v1/auth/register", json=payload)
        self.assertEqual(res.status_code, 409)

    def test_03_login_success(self):
        """Logging in with correct credentials returns 200 OK and JWT."""
        payload = {
            "phone": self.test_phone,
            "password": self.test_password,
        }
        res = client.post("/api/v1/auth/login", json=payload)
        self.assertEqual(res.status_code, 200)
        body = res.json()["data"]
        self.assertIn("access_token", body)
        self.assertEqual(body["token_type"], "bearer")
        self.assertEqual(body["user"]["phone"], self.test_phone)

        # Verify JWT claims
        token_payload = decode_access_token(body["access_token"])
        self.assertEqual(token_payload["phone"], self.test_phone)
        self.assertEqual(token_payload["role"], "farmer")

    def test_04_login_wrong_password_rejected_401(self):
        """Logging in with wrong password returns 401 Unauthorized."""
        payload = {
            "phone": self.test_phone,
            "password": "WrongPassword999",
        }
        res = client.post("/api/v1/auth/login", json=payload)
        self.assertEqual(res.status_code, 401)
        msg = res.json().get("message") or res.json().get("detail") or ""
        self.assertIn("invalid phone or password", msg.lower())

    def test_05_login_unknown_phone_rejected_401_no_auto_create(self):
        """Logging in with non-existent phone returns 401 Unauthorized and DOES NOT create a user."""
        unknown_phone = f"+918{int(time.time())}"
        payload = {
            "phone": unknown_phone,
            "password": "SomePassword123",
        }
        res = client.post("/api/v1/auth/login", json=payload)
        self.assertEqual(res.status_code, 401)

        # Verify user was NOT created
        db = next(get_db())
        farmer = farmer_repository.get_by_phone(db, unknown_phone)
        self.assertIsNone(farmer)

    def test_06_get_current_user_profile(self):
        """Protected GET /api/v1/auth/me returns profile of authenticated user."""
        login_res = client.post("/api/v1/auth/login", json={"phone": self.test_phone, "password": self.test_password})
        token = login_res.json()["data"]["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        res = client.get("/api/v1/auth/me", headers=headers)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["data"]["phone"], self.test_phone)


if __name__ == "__main__":
    unittest.main()
