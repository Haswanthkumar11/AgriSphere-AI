"""
AgriSphere AI — Search Service (Module 5 Service 5)
Multi-filter equipment search with category filtering & price sorting.
"""
from sqlalchemy.orm import Session
from ...repositories import equipment_repository
from .equipment_service import _format_equipment_dict


def search_equipment(
    db: Session,
    category: str | None = None,
    district: str | None = None,
    village: str | None = None,
    operator_available: bool | None = None,
    available_only: bool = True,
    sort_by: str | None = None,
) -> list[dict]:
    items = equipment_repository.list_equipment(
        db, category, district, village, operator_available, available_only, sort_by
    )
    return [_format_equipment_dict(item, db) for item in items]
