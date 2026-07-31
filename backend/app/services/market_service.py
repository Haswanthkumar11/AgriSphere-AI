"""Farm Intelligence business logic (Module 1) — prices + weather."""
from ..ai import market_engine


def get_prices() -> dict:
    return market_engine.forecast_prices()


def get_weather() -> dict:
    return market_engine.forecast_weather()
