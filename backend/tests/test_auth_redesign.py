"""
AgriSphere AI — Unit & Integration Tests for 3-Table RescueLens RBAC Architecture
"""
import unittest
import time
from fastapi.testclient import TestClient
from app.main import app
from app.database.session import init_db

client = TestClient(app)


class TestAuthRedesign(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()

    def test_01_seed_accounts_exist_and_login(self):
        # 1. Haswanth (Admin)
        res_admin = client.post("/api/v1/auth/login", json={"phone": "8310557227", "password": "password123"})
        self.assertEqual(res_admin.status_code, 200)
        data_admin = res_admin.json()["data"]
        self.assertEqual(data_admin["user"]["role"], "admin")
        self.assertTrue("access_token" in data_admin)

        # 2. Sandya (Officer)
        res_officer = client.post("/api/v1/auth/login", json={"phone": "9121679411", "password": "password123"})
        self.assertEqual(res_officer.status_code, 200)
        data_officer = res_officer.json()["data"]
        self.assertEqual(data_officer["user"]["role"], "officer")

        # 3. Nikhil (Farmer)
        res_farmer = client.post("/api/v1/auth/login", json={"phone": "7989612530", "password": "password123"})
        self.assertEqual(res_farmer.status_code, 200)
        data_farmer = res_farmer.json()["data"]
        self.assertEqual(data_farmer["user"]["role"], "farmer")

    def test_02_farmer_self_registration(self):
        phone = f"987{int(time.time())}"
        payload = {
            "name": "Ramesh Farmer",
            "phone": phone,
            "password": "password123",
            "crop_type": "Tomato",
            "land_size_acres": 2.5,
        }
        res = client.post("/api/v1/auth/register", json=payload)
        self.assertEqual(res.status_code, 201)
        data = res.json()["data"]
        self.assertEqual(data["role"], "farmer")

        # Login newly registered farmer
        res_login = client.post("/api/v1/auth/login", json={"phone": phone, "password": "password123"})
        self.assertEqual(res_login.status_code, 200)
        self.assertEqual(res_login.json()["data"]["user"]["role"], "farmer")

    def test_03_admin_user_provisioning(self):
        phone = f"944{int(time.time())}"
        payload = {
            "name": "Dr. V. Prasad",
            "phone": phone,
            "role": "officer",
            "password": "CustomPassword123!",
        }
        res = client.post("/api/v1/auth/provision", json=payload)
        self.assertEqual(res.status_code, 201)
        data = res.json()["data"]
        self.assertEqual(data["role"], "officer")

        # Login provisioned officer with explicit password
        res_login = client.post("/api/v1/auth/login", json={"phone": phone, "password": "CustomPassword123!"})
        self.assertEqual(res_login.status_code, 200)
        self.assertEqual(res_login.json()["data"]["user"]["role"], "officer")


if __name__ == "__main__":
    unittest.main()
