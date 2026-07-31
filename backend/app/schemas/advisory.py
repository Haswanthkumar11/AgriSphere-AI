from pydantic import BaseModel


class VoiceAlertRequest(BaseModel):
    farmer_phone: str
    language_code: str = "te"
    alert_type: str
    disease_name: str | None = None


class VoiceAlertResult(BaseModel):
    status: str
    message_id: str
    message_text: str
    language_code: str
    audio_url: str | None = None
    simulated: bool
    note: str


class AlertHistoryItem(BaseModel):
    id: str
    alert_type: str
    message_text: str
    status: str
    created_at: str
