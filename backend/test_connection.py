from app.core.config import settings
from sqlalchemy import create_engine, text

print("=" * 80)
print("Using database:")
print(settings.DATABASE_URL)
print("=" * 80)

engine = create_engine(settings.DATABASE_URL)

try:
    with engine.connect() as conn:
        print("✅ Connected Successfully!")
        print("Current Database:", conn.execute(text("SELECT current_database();")).scalar())
        print("PostgreSQL Version:")
        print(conn.execute(text("SELECT version();")).scalar())

except Exception as e:
    print("❌ Connection Failed")
    print(type(e).__name__)
    print(e)