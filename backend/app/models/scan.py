import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime

from ..database.base import Base
from ..utils.id_generator import gen_id


class ScanRecord(Base):
    __tablename__ = "scans"

    id = Column(String, primary_key=True, default=lambda: gen_id("scan"))
    farmer_id = Column(String, default="usr_demo")
    disease_label = Column(String)
    confidence = Column(Float)
    healthy = Column(Boolean)
    remedy = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
