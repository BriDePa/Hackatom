from typing import Literal

from pydantic import BaseModel, Field


RiskLevel = Literal["LOW", "MEDIUM", "HIGH"]


class SimulationRequest(BaseModel):
    product: Literal["tomato", "strawberry"]
    dose: float = Field(ge=0, le=5, description="Gamma irradiation dose in kGy")
    temperature: float = Field(ge=-2, le=35, description="Storage or transit temperature in Celsius")
    humidity: float = Field(ge=40, le=100, description="Relative humidity percentage")
    transport_hours: int = Field(ge=1, le=240)
    cold_chain_failure: bool = False


class QualityPoint(BaseModel):
    day: int
    irradiated: float
    non_irradiated: float


class RangeValue(BaseModel):
    min: float
    max: float
    unit: str


class SimulationResponse(BaseModel):
    product: str
    risk_level: RiskLevel
    remaining_quality: RangeValue
    estimated_shelf_life_range: RangeValue
    estimated_loss_percentage: RangeValue
    confidence: Literal["LOW", "MEDIUM", "HIGH"]
    recommendations: list[str]
    quality_curve: list[QualityPoint]
    cold_chain_alert: str | None = None
    model_notes: list[str]
