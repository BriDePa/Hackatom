from functools import lru_cache
from pathlib import Path

import pandas as pd
from pydantic import BaseModel


DATA_PATH = Path(__file__).resolve().parents[2] / "data" / "products.csv"


class ProductProfile(BaseModel):
    id: str
    name_es: str
    name_en: str
    name_ru: str
    k0: float
    a: float
    b: float
    c: float
    baseline_shelf_days: int
    safe_temperature: float
    ideal_humidity: float


@lru_cache
def load_products() -> dict[str, ProductProfile]:
    frame = pd.read_csv(DATA_PATH)
    return {
        row["id"]: ProductProfile(**row.to_dict())
        for _, row in frame.iterrows()
    }


def get_product(product_id: str) -> ProductProfile:
    return load_products()[product_id]
