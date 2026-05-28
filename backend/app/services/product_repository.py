import json
from functools import lru_cache
from pathlib import Path

import pandas as pd
from pydantic import BaseModel


CSV_DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "products.csv"
JSON_DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "products.json"


class ProductProfile(BaseModel):
    id: str
    name: dict[str, str]
    base_shelf_life_days: int
    optimal_temperature: float
    optimal_humidity: float
    respiration_factor: float
    microbial_sensitivity: float
    irradiation_sensitivity: float
    base_k: float
    economic_value_per_kg: float
    transport_sensitivity: float
    literature_basis: list[str]


@lru_cache
def load_products() -> dict[str, ProductProfile]:
    pd.read_csv(CSV_DATA_PATH)
    with JSON_DATA_PATH.open(encoding="utf-8") as file:
        rows = json.load(file)
    return {row["id"]: ProductProfile(**row) for row in rows}


def get_product(product_id: str) -> ProductProfile:
    return load_products()[product_id]
