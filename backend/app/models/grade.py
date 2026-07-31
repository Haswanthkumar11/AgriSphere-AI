import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime

from ..database.base import Base
from ..utils.id_generator import gen_id


class GradeRecord(Base):
    __tablename__ = "grades"

    id = Column(String, primary_key=True, default=lambda: gen_id("grd"))
    farmer_id = Column(String, default="usr_demo")
    crop = Column(String, default="Paddy Grain")
    quality_score = Column(Float)
    avg_grain_length_mm = Column(Float)
    moisture_damage_percent = Column(Float)
    foreign_matter_percent = Column(Float)
    grain_count = Column(Integer)
    recommended_price = Column(Float)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
