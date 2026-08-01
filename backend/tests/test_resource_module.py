"""
AgriSphere AI — Resource Hub & Notification Unit & Integration Tests (Module 5)
"""
import unittest
from datetime import date, timedelta
from fastapi.testclient import TestClient
from app.main import app
from app.database.session import SessionLocal, init_db
from app.models.farmer import Farmer

client = TestClient(app)


class TestResourceModule(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        db = SessionLocal()
        # Ensure test farmers exist for FK constraints
        if not db.query(Farmer).filter(Farmer.id == "usr_demo").first():
            db.add(Farmer(id="usr_demo", name="Test Owner", phone="+919999988881", role="farmer"))
        if not db.query(Farmer).filter(Farmer.id == "usr_farmer_b").first():
            db.add(Farmer(id="usr_farmer_b", name="Test Requester", phone="+919999988882", role="farmer"))
        db.commit()
        db.close()

    def test_01_create_equipment(self):
        payload = {
            "name": "Mahindra 575 DI Tractor",
            "category": "tractor",
            "brand": "Mahindra",
            "model": "2025",
            "description": "High performance 45 HP tractor for ploughing.",
            "price_per_day": 750.0,
            "village": "Amaravati",
            "district": "Guntur",
            "operator_available": True,
            "is_verified": True,
            "owner_id": "usr_demo",
        }
        res = client.post("/api/v1/resources/equipment", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()["data"]
        self.assertTrue("id" in data)
        self.assertEqual(data["name"], "Mahindra 575 DI Tractor")
        self.assertTrue(data["is_verified"])
        self.assertTrue("whatsapp_link" in data)
        TestResourceModule.equipment_id = data["id"]

    def test_02_list_and_search_equipment(self):
        res = client.get("/api/v1/resources/equipment?category=tractor&sort_by=lowest_price")
        self.assertEqual(res.status_code, 200)
        items = res.json()["data"]
        self.assertTrue(len(items) > 0)

    def test_03_submit_booking_request(self):
        eq_id = getattr(TestResourceModule, "equipment_id", None)
        if not eq_id:
            return

        from_d = date.today() + timedelta(days=1)
        to_d = date.today() + timedelta(days=3)

        payload = {
            "equipment_id": eq_id,
            "from_date": from_d.isoformat(),
            "to_date": to_d.isoformat(),
            "purpose": "Harvesting",
            "land_size_acres": 2.5,
            "operator_required": True,
            "special_requirements": "Need cultivator attachment",
            "village": "Amaravati",
            "requester_id": "usr_farmer_b",
        }
        res = client.post("/api/v1/resources/book", json=payload)
        self.assertEqual(res.status_code, 200)
        bkg = res.json()["data"]
        self.assertTrue("booking_code" in bkg)
        self.assertEqual(bkg["status"], "PENDING")
        self.assertTrue("confirmation_card" in bkg)

        TestResourceModule.booking_id = bkg["id"]

    def test_04_double_booking_prevention(self):
        eq_id = getattr(TestResourceModule, "equipment_id", None)
        if not eq_id:
            return

        from_d = date.today() + timedelta(days=2)
        to_d = date.today() + timedelta(days=4)

        payload = {
            "equipment_id": eq_id,
            "from_date": from_d.isoformat(),
            "to_date": to_d.isoformat(),
            "purpose": "Sowing",
        }
        res = client.post("/api/v1/resources/book", json=payload)
        self.assertEqual(res.status_code, 400)
        msg = (res.json().get("detail") or res.json().get("message") or "").lower()
        self.assertTrue("already booked" in msg)

    def test_05_accept_booking_and_notifications(self):
        bkg_id = getattr(TestResourceModule, "booking_id", None)
        if not bkg_id:
            return

        res = client.put(f"/api/v1/resources/bookings/{bkg_id}/accept")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["data"]["status"], "ACCEPTED")

        # Check notifications for farmer_b
        res_notif = client.get("/api/v1/resources/notifications?user_id=usr_farmer_b")
        self.assertEqual(res_notif.status_code, 200)
        notifs = res_notif.json()["data"]["notifications"]
        self.assertTrue(len(notifs) > 0)
        self.assertTrue("accepted" in notifs[0]["title"].lower())

    def test_06_owner_dashboard_operational_metrics(self):
        res = client.get("/api/v1/resources/owner/dashboard?owner_id=usr_demo")
        self.assertEqual(res.status_code, 200)
        metrics = res.json()["data"]["operational_metrics"]
        self.assertTrue("total_listings" in metrics)
        self.assertTrue("pending_requests" in metrics)
        self.assertTrue("accepted_bookings" in metrics)
        self.assertTrue("completed_rentals" in metrics)


if __name__ == "__main__":
    unittest.main()
