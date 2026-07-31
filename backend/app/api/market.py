from fastapi import APIRouter

from ..core.responses import success_response
from ..services import market_service

router = APIRouter(prefix="/api/v1", tags=["market"])


@router.get("/prices")
def get_prices():
    result = market_service.get_prices()
    return success_response(data=result)


@router.get("/weather")
def get_weather():
    result = market_service.get_weather()
    return success_response(data=result)
