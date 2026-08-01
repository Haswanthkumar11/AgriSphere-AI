"""
AgriSphere AI — Production Database Cleanup Script
===================================================
Executes production cleanup preserving ONLY account: phone = '8310557227'.
Promotes account to role = 'admin'.
Cleans all dummy marketplace equipment, bookings, notifications, AI crop scans,
harvest sessions, legacy scans, grades, and voice alerts.
"""
import os
import sys
import logging
from sqlalchemy import text, inspect

# Add backend root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database.session import SessionLocal, engine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("agrisphere.db_cleanup")


def execute_production_cleanup():
    db = SessionLocal()
    try:
        logger.info("Starting production database cleanup...")

        # Step 1: Promote target account to admin
        db.execute(text("UPDATE farmers SET role = 'admin' WHERE phone = '8310557227';"))

        # Step 2: Delete Level 1 Child AI Records (Crop Scan)
        db.execute(text("DELETE FROM disease_predictions;"))
        db.execute(text("DELETE FROM treatment_recommendations;"))
        db.execute(text("DELETE FROM crop_scans;"))
        db.execute(text("DELETE FROM ai_sessions;"))

        # Step 3: Delete Level 1 Child AI Records (Harvest Session)
        db.execute(text("DELETE FROM quality_assessments;"))
        db.execute(text("DELETE FROM storage_recommendations;"))
        db.execute(text("DELETE FROM market_assessments;"))
        db.execute(text("DELETE FROM grain_scans;"))
        db.execute(text("DELETE FROM harvest_sessions;"))

        # Step 4: Delete Legacy AI Scans, Grades & Voice Alerts
        db.execute(text("DELETE FROM scans;"))
        db.execute(text("DELETE FROM grades;"))
        db.execute(text("DELETE FROM voice_alerts;"))

        # Step 5: Delete Notifications & Bookings
        db.execute(text("DELETE FROM notifications;"))
        db.execute(text("DELETE FROM bookings;"))

        # Step 6: Delete Marketplace Equipment
        db.execute(text("DELETE FROM equipment;"))

        # Step 7: Delete Non-Admin Users (Preserve ONLY phone = '8310557227')
        db.execute(text("DELETE FROM farmers WHERE phone <> '8310557227';"))

        db.commit()
        logger.info("Production database cleanup committed successfully.")

        # Verification & Audit
        insp = inspect(engine)
        tables = insp.get_table_names()
        report = {}
        for t in tables:
            cnt = db.execute(text(f"SELECT COUNT(*) FROM {t};")).scalar()
            report[t] = cnt

        # Verify admin user
        admin_user = db.execute(
            text("SELECT id, name, phone, role FROM farmers WHERE phone = '8310557227';")
        ).fetchone()

        logger.info(f"Target Admin Account: {admin_user}")
        logger.info("Table Row Summary:")
        for tbl, count in report.items():
            logger.info(f"  • {tbl}: {count} rows")

        return report, admin_user

    except Exception as e:
        db.rollback()
        logger.error(f"Database cleanup failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    execute_production_cleanup()
