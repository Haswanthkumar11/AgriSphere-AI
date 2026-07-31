"""
AgriSphere AI — Post-Harvest Intelligence Unit & Integration Tests (Module 4)
"""
import os
import sys
import io
import unittest
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from app.main import app
from app.database.session import init_db

client = TestClient(app)


def create_dummy_grain_image_bytes() -> bytes:
    img = Image.new("RGB", (300, 300), color=(200, 180, 140))
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG")
    return buffer.getvalue()


class TestHarvestModule(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        cls.img_bytes = create_dummy_grain_image_bytes()

    def test_01_analyze_grain_post(self):
        response = client.post(
            "/api/v1/harvest/analyze",
            files={"file": ("test_grain.jpg", self.img_bytes, "image/jpeg")},
            data={"crop_type": "Paddy", "model_key": "opencv", "user_id": "usr_demo"},
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()["data"]
        self.assertTrue("session_id" in data)
        self.assertTrue("passport_id" in data)
        self.assertTrue(data["passport_id"].startswith("GRN-"))
        self.assertEqual(data["crop_type"], "Paddy")
        self.assertTrue("grade" in data["quality"])
        self.assertTrue("risk_label" in data["storage"])
        self.assertTrue("recommendation_label" in data["market"])

        TestHarvestModule.session_id = data["session_id"]
        TestHarvestModule.passport_id = data["passport_id"]

    def test_02_get_harvest_history(self):
        res = client.get("/api/v1/harvest/history?user_id=usr_demo")
        self.assertEqual(res.status_code, 200)
        history = res.json()["data"]
        self.assertTrue(len(history) > 0)

    def test_03_get_harvest_session(self):
        sid = getattr(TestHarvestModule, "session_id", None)
        if sid:
            res = client.get(f"/api/v1/harvest/session/{sid}")
            self.assertEqual(res.status_code, 200)
            self.assertEqual(res.json()["data"]["session_id"], sid)

    def test_04_get_printable_passport(self):
        pid = getattr(TestHarvestModule, "passport_id", None)
        if pid:
            res = client.get(f"/api/v1/harvest/passport/{pid}")
            self.assertEqual(res.status_code, 200)
            self.assertEqual(res.json()["data"]["passport_id"], pid)

    def test_05_get_storage_and_market_advice(self):
        sid = getattr(TestHarvestModule, "session_id", None)
        if sid:
            res_s = client.get(f"/api/v1/harvest/storage/{sid}")
            self.assertEqual(res_s.status_code, 200)

            res_m = client.get(f"/api/v1/harvest/market/{sid}")
            self.assertEqual(res_m.status_code, 200)

    def test_06_get_harvest_knowledge_base(self):
        res = client.get("/api/v1/harvest/knowledge-base")
        self.assertEqual(res.status_code, 200)
        kb = res.json()["data"]
        self.assertTrue(len(kb) > 0)


if __name__ == "__main__":
    unittest.main()
