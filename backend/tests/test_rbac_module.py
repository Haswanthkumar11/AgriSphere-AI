"""
AgriSphere AI — Comprehensive RBAC & Security Test Suite
Tests authentication, JWT claims, registration role defaults, and role-based endpoint protection.
"""
import unittest
import time
from fastapi.testclient import TestClient
from app.main import app
from app.database.session import init_db, get_db
from app.repositories import farmer_repository
from app.core.security import create_access_token

client = TestClient(app)


class TestRBACModule(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        db = next(get_db())
        admin_user = farmer_repository.get_by_phone(db, "+919999999999")
        if not admin_user:
            admin_user = farmer_repository.create(db, name="Admin Test User", phone="+919999999999", role="admin")
        else:
            farmer_repository.update_role(db, admin_user.id, "admin")

        officer_user = farmer_repository.get_by_phone(db, "+919876543333")
        if not officer_user:
            officer_user = farmer_repository.create(db, name="Officer Test User", phone="+919876543333", role="officer")
        else:
            farmer_repository.update_role(db, officer_user.id, "officer")

        owner_user = farmer_repository.get_by_phone(db, "+919876543222")
        if not owner_user:
            owner_user = farmer_repository.create(db, name="Owner Test User", phone="+919876543222", role="owner")
        else:
            farmer_repository.update_role(db, owner_user.id, "owner")

        cls.admin_token = create_access_token(admin_user.id, admin_user.phone, role="admin")
        cls.officer_token = create_access_token(officer_user.id, officer_user.phone, role="officer")
        cls.owner_token = create_access_token(owner_user.id, owner_user.phone, role="owner")
        cls.farmer_token = create_access_token("usr_demo", "+919876543210", role="farmer")

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
