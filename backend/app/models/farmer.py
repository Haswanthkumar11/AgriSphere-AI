import datetime
from sqlalchemy import Column, String, Float, DateTime

from ..database.base import Base
from ..utils.id_generator import gen_id


class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(String, primary_key=True, default=lambda: gen_id("usr"))
    name = Column(String, nullable=False)
    phone = Column(String, unique=True, nullable=False)
    region = Column(String, default="Tirupati, Andhra Pradesh")
    crop_type = Column(String, default="Tomato")
    land_size_acres = Column(Float, default=1.0)
    language = Column(String, default="en")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
