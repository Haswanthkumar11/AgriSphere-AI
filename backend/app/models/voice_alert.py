import datetime
from sqlalchemy import Column, String, DateTime

from ..database.base import Base
from ..utils.id_generator import gen_id


class VoiceAlert(Base):
    __tablename__ = "voice_alerts"

    id = Column(String, primary_key=True, default=lambda: gen_id("msg"))
    farmer_phone = Column(String)
    language_code = Column(String)
    alert_type = Column(String)
    message_text = Column(String)
    status = Column(String, default="QUEUED")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
