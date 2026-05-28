from fastapi import APIRouter

from app.models.simulation import SimulationRequest, SimulationResponse
from app.services.product_repository import load_products
from app.services.simulation_engine import simulate_postharvest


router = APIRouter()


@router.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/products")
async def products() -> list[dict[str, str]]:
    return [
        {
            "id": product.id,
            "name_es": product.name_es,
            "name_en": product.name_en,
            "name_ru": product.name_ru,
        }
        for product in load_products().values()
    ]


@router.post("/simulate", response_model=SimulationResponse)
async def simulate(request: SimulationRequest) -> SimulationResponse:
    return simulate_postharvest(request)
