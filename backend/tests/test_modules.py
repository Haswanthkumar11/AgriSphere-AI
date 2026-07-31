"""
AgriSphere AI — Backend Test Suite (Modules 1, 2, and 3 Regression Check)
"""
import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from app.main import app
from app.database.session import init_db

client = TestClient(app)


class TestAgriSphereModules(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()

    def test_health_check(self):
        response = client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "ok")

    def test_module_1_prices_and_weather(self):
        res_prices = client.get("/api/v1/prices")
        self.assertEqual(res_prices.status_code, 200)

        res_weather = client.get("/api/v1/weather")
        self.assertEqual(res_weather.status_code, 200)

    def test_module_2_weather_service(self):
        res_curr = client.get("/api/v1/weather")
        self.assertEqual(res_curr.status_code, 200)

    def test_module_3_crop_intelligence_knowledge_base(self):
        res_kb = client.get("/api/v1/crop/knowledge-base")
        self.assertEqual(res_kb.status_code, 200)
        self.assertTrue("data" in res_kb.json())

        res_card = client.get("/api/v1/crop/knowledge-base/tomato_early_blight")
        self.assertEqual(res_card.status_code, 200)
        self.assertEqual(res_card.json()["data"]["disease_name"], "Early Blight")


if __name__ == "__main__":
    unittest.main()
