"""
AgriSphere AI — Comprehensive RBAC & Security Test Suite
Tests authentication, JWT claims, registration role defaults, and role-based endpoint protection.
"""
import unittest
import time
from fastapi.testclient import TestClient
from app.main import app
from app.database.session import init_db, SessionLocal
from app.models.user import User
from app.models.user_profile import UserProfile
from app.core.security import create_access_token, hash_password

client = TestClient(app)


class TestRBACModule(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        db = SessionLocal()
        
        # Ensure test admin user
        admin_u = db.query(User).filter(User.phone == "+919999999999").first()
        if not admin_u:
            admin_u = User(phone="+919999999999", password_hash=hash_password("password123"))
            db.add(admin_u)
            db.flush()
            db.add(UserProfile(user_id=admin_u.id, full_name="Admin Test User", role="admin"))
            db.commit()

        cls.admin_token = create_access_token(admin_u.id, admin_u.phone, role="admin")
        cls.farmer_token = create_access_token("usr_demo", "+919876543210", role="farmer")
        db.close()

    def test_01_registration_defaults_to_farmer(self):
        """Registration must always assign role='farmer' and ignore client 'role' overrides."""
        phone = f"+917{int(time.time())}"
        payload = {
            "phone": phone,
            "name": "Malicious User Attempting Admin",
            "password": "Password123!",
            "role": "admin",  # Attacker attempts to register as admin
        }
        res = client.post("/api/v1/auth/register", json=payload)
        self.assertEqual(res.status_code, 201)
        user_data = res.json()["data"]
        self.assertEqual(user_data["role"], "farmer")  # Must be forced to farmer

    def test_02_jwt_payload_structure(self):
        """JWT token must contain sub, phone, and role claims."""
        token = create_access_token("usr_test", "+919000000000", role="officer")
        from app.core.security import decode_access_token
        payload = decode_access_token(token)
        self.assertEqual(payload["sub"], "usr_test")
        self.assertEqual(payload["phone"], "+919000000000")
        self.assertEqual(payload["role"], "officer")

    def test_03_require_roles_helper(self):
        """Verify require_roles dependency logic."""
        from app.core.security import require_roles, CurrentUser
        dep = require_roles("admin")
        admin_usr = CurrentUser("u1", "p1", "admin")
        farmer_usr = CurrentUser("u2", "p2", "farmer")
        
        # Admin allowed
        self.assertEqual(dep(admin_usr).role, "admin")
        
        # Farmer rejected with 403
        from fastapi import HTTPException
        with self.assertRaises(HTTPException) as ctx:
            dep(farmer_usr)
        self.assertEqual(ctx.exception.status_code, 403)


if __name__ == "__main__":
    unittest.main()
