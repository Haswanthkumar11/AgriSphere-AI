from pydantic import BaseModel


class GradeMetrics(BaseModel):
    avg_grain_length_mm: float
    moisture_damage_percent: float
    foreign_matter_percent: float


class GradeResult(BaseModel):
    crop: str
    quality_score: float
    metrics: GradeMetrics
    grain_count: int
    recommended_floor_price_per_quintal: float
    note: str | None = None
