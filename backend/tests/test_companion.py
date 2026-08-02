"""
AgriSphere AI — Backend Test Suite for AgriSphere Companion Agentic Service
Tests:
- POST /api/v1/companion/chat
- Intent classification
- Tool registry context building
- Standardized JSON envelope
"""

import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


class TestCompanionService(unittest.TestCase):

    def test_companion_weather_chat(self):
        """Test POST /api/v1/companion/chat for weather intent."""
        response = client.post(
            "/api/v1/companion/chat",
            json={
                "message": "Will it rain tomorrow in Tirupati?",
                "crop_type": "Paddy",
                "city": "Tirupati",
                "user_id": "usr_demo",
                "language": "en",
            },
        )
        self.assertEqual(response.status_code, 200)
        json_data = response.json()
        self.assertTrue(json_data.get("success"))
        data = json_data.get("data", {})
        self.assertEqual(data.get("intent"), "weather")
        self.assertIn("actions", data)
        self.assertIn("pipeline_steps", data)
        self.assertIn("voice", data)

    def test_companion_crop_scan_chat(self):
        """Test POST /api/v1/companion/chat for crop scan intent."""
        response = client.post(
            "/api/v1/companion/chat",
            json={
                "message": "Diagnose leaf spots on my Tomato crop",
                "crop_type": "Tomato",
                "city": "Tirupati",
                "user_id": "usr_demo",
                "language": "en",
            },
        )
        self.assertEqual(response.status_code, 200)
        json_data = response.json()
        self.assertTrue(json_data.get("success"))
        data = json_data.get("data", {})
        self.assertEqual(data.get("intent"), "crop_scan")
        self.assertIn("actions", data)
        self.assertIn("/scan", data["actions"][0]["route"])

    def test_companion_empty_message_validation(self):
        """Test POST /api/v1/companion/chat rejects empty message."""
        response = client.post(
            "/api/v1/companion/chat",
            json={"message": "   "},
        )
        self.assertEqual(response.status_code, 400)


if __name__ == "__main__":
    unittest.main()
