from pydantic import BaseModel


class ScanResult(BaseModel):
    scan_id: str
    disease_label: str
    healthy: bool
    confidence: float
    remedy: str
    model: str


class ScanHistoryItem(BaseModel):
    scan_id: str
    disease_label: str
    confidence: float
    healthy: bool
    created_at: str
