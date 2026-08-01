"""AgriSphere AI — Demo data seeding (hackathon convenience only)."""
from sqlalchemy.orm import Session

from ..core.config import settings
from ..models.farmer import Farmer
from ..models.equipment import Equipment
from ..repositories.disease_kb_repository import seed_disease_knowledge_base
from ..repositories.harvest_kb_repository import seed_harvest_knowledge_base


def seed_demo_data(db: Session) -> None:
    if db.query(Farmer).filter(Farmer.id == settings.DEMO_FARMER_ID).count() == 0:
        db.add(Farmer(
            id=settings.DEMO_FARMER_ID, name="Ramesh Kumar", phone="+919876543210",
            region=settings.DEMO_REGION, crop_type="Tomato", land_size_acres=3.5,
        ))
        db.commit()

    if db.query(Farmer).filter(Farmer.id == "usr_farmer_b").count() == 0:
        db.add(Farmer(
            id="usr_farmer_b", name="Suresh Kumar", phone="+919876543211",
            region="Guntur, Andhra Pradesh", crop_type="Paddy", land_size_acres=2.5,
        ))
        db.commit()


    if db.query(Equipment).count() == 0:
        db.add_all([
            Equipment(name="Mahindra 575 DI Tractor", category="tractor", owner_id=settings.DEMO_FARMER_ID,
                      price_per_day=750, village="Amaravati", district="Guntur", is_verified=True, operator_available=True),
            Equipment(name="Kubota Combine Harvester", category="harvester", owner_id=settings.DEMO_FARMER_ID,
                      price_per_day=2200, village="Tenali", district="Guntur", is_verified=True, operator_available=True),
            Equipment(name="Diesel Water Pump Set", category="irrigation", owner_id=settings.DEMO_FARMER_ID,
                      price_per_day=350, village="Mangalagiri", district="Guntur", is_verified=True, operator_available=False),
            Equipment(name="Tata Ace Mini Truck (Transport)", category="trailer", owner_id=settings.DEMO_FARMER_ID,
                      price_per_day=900, village="Amaravati", district="Guntur", is_verified=True, operator_available=True),
            Equipment(name="Rotavator 6 Feet Attachment", category="rotavator", owner_id=settings.DEMO_FARMER_ID,
                      price_per_day=500, village="Tenali", district="Guntur", is_verified=True, operator_available=False),
        ])
        db.commit()

    seed_disease_knowledge_base(db)
    seed_harvest_knowledge_base(db)

    db.commit()
