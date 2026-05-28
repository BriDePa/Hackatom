import json
from functools import lru_cache
from pathlib import Path

from pydantic import BaseModel


DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "routes.json"


class RouteProfile(BaseModel):
    id: str
    name: str
    duration_hours: int
    average_temperature: float
    refrigeration: bool
    delay_risk: float
    thermal_stability: float
    logistics_stress: float


@lru_cache
def load_routes() -> dict[str, RouteProfile]:
    with DATA_PATH.open(encoding="utf-8") as file:
        rows = json.load(file)
    return {row["id"]: RouteProfile(**row) for row in rows}


def get_route(route_id: str) -> RouteProfile:
    return load_routes()[route_id]
