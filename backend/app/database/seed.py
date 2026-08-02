"""
AgriSphere AI — Seed Database (Hackathon Identity Seeding)
Seeds the 3 primary hackathon accounts:
1. Haswanth (Admin)   - 8310557227 / password123
2. Sandya   (Officer) - 9121679411 / password123
3. Bhaskar  (Farmer)  - 7989612530 / password123
"""
from sqlalchemy.orm import Session
from ..core.security import hash_password
from ..models.user import User
from ..models.user_profile import UserProfile
from ..models.farmer import Farmer
from ..repositories.disease_kb_repository import seed_disease_knowledge_base
from ..repositories.harvest_kb_repository import seed_harvest_knowledge_base


def seed_demo_data(db: Session) -> None:
    demo_password_hash = hash_password("password123")

    seed_accounts = [
        {"name": "Haswanth", "phone": "8310557227", "role": "admin",   "crop": "Tomato", "land": 5.0, "state": "Andhra Pradesh", "district": "Tirupati"},
        {"name": "Sandya",   "phone": "9121679411", "role": "officer", "crop": "Paddy",  "land": 2.5, "state": "Andhra Pradesh", "district": "Guntur"},
        {"name": "Bhaskar",  "phone": "7989612530", "role": "farmer",  "crop": "Paddy",  "land": 3.5, "state": "Andhra Pradesh", "district": "West Godavari"},
    ]

    for acc in seed_accounts:
        user = db.query(User).filter(User.phone == acc["phone"]).first()
        if not user:
            user = User(phone=acc["phone"], password_hash=demo_password_hash, is_active=True)
            db.add(user)
            db.flush()

            profile = UserProfile(user_id=user.id, full_name=acc["name"], role=acc["role"], status="active")
            db.add(profile)
            db.flush()

            if acc["role"] == "farmer":
                farmer_domain = Farmer(
                    user_id=user.id,
                    crop_type=acc["crop"],
                    land_size=acc["land"],
                    state=acc["state"],
                    district=acc["district"],
                    language="en",
                )
                db.add(farmer_domain)
            db.commit()
        else:
            # Update existing Bhaskar farmer record to West Godavari
            if acc["name"] == "Bhaskar":
                farmer_rec = db.query(Farmer).filter(Farmer.user_id == user.id).first()
                if farmer_rec:
                    farmer_rec.state = "Andhra Pradesh"
                    farmer_rec.district = "West Godavari"
                    farmer_rec.crop_type = "Paddy"
                    db.commit()

    seed_disease_knowledge_base(db)
    seed_harvest_knowledge_base(db)
    db.commit()
