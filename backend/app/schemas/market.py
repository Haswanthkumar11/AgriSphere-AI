from pydantic import BaseModel


class PriceItem(BaseModel):
    crop: str
    icon: str
    price: float
    trend_percent: float
    mandi: str


class PriceListResponse(BaseModel):
    mandi: str
    updated_at: str
    prices: list[PriceItem]


class WeatherDay(BaseModel):
    date: str
    day_label: str
    temp_c: int
    icon: str
    heat_alert: bool


class WeatherAdvisory(BaseModel):
    title: str
    body: str


class NdviAlert(BaseModel):
    field: str
    change_percent: int
    message: str


class WeatherResponse(BaseModel):
    region: str
    days: list[WeatherDay]
    advisory: WeatherAdvisory
    ndvi_alert: NdviAlert
