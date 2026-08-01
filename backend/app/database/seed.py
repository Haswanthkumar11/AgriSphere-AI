"""AgriSphere AI — Knowledge Base Initialization (Production)."""
from sqlalchemy.orm import Session
from ..repositories.disease_kb_repository import seed_disease_knowledge_base
from ..repositories.harvest_kb_repository import seed_harvest_knowledge_base


def seed_demo_data(db: Session) -> None:
    """Production initialization: seeds static ICAR and AGMARK knowledge bases only."""
    seed_disease_knowledge_base(db)
    seed_harvest_knowledge_base(db)
    db.commit()
