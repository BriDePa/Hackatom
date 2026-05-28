from typing import Literal

from pydantic import BaseModel, Field


ProductId = Literal["tomato", "strawberry", "potato"]
LogisticsProfileId = Literal["optimal_cold_chain", "export_stress", "ambient_long_distance"]
TransportType = Literal["refrigerated_truck", "ambient_truck", "mixed_cargo", "air_cargo"]
RiskLevel = Literal["LOW", "MEDIUM", "HIGH"]


class SimulationRequest(BaseModel):
    product: ProductId
    route_id: LogisticsProfileId = "optimal_cold_chain"
    dose: float = Field(ge=0, le=5, description="Gamma irradiation dose in kGy")
    temperature: float = Field(ge=-2, le=35, description="Storage or transit temperature in Celsius")
    humidity: float = Field(ge=40, le=100, description="Relative humidity percentage")
    transport_hours: int = Field(ge=1, le=240)
    transport_type: TransportType = "refrigerated_truck"
    refrigerated_storage: bool = True
    cold_chain_failure: bool = False
    cold_chain_failure_hours: int = Field(default=6, ge=1, le=48)
    delay_hours: int = Field(default=0, ge=0, le=96)
    thermal_exposure_hours: int = Field(default=0, ge=0, le=48)
    extended_storage_hours: int = Field(default=0, ge=0, le=168)
    lot_value_usd: float = Field(default=2500, ge=100, le=100000)


class QualityPoint(BaseModel):
    day: int
    irradiated: float
    irradiated_low: float
    irradiated_high: float
    non_irradiated: float
    cold_chain_event: bool
    delay_event: bool
    thermal_event: bool
    storage_event: bool


class RangeValue(BaseModel):
    min: float
    max: float
    unit: str


class SimulationResponse(BaseModel):
    product: str
    route: str
    risk_level: RiskLevel
    risk_pressure: RangeValue
    remaining_quality: RangeValue
    estimated_shelf_life_range: RangeValue
    estimated_loss_percentage: RangeValue
    estimated_loss_value: RangeValue
    potential_savings_value: RangeValue
    logistics_stress: RangeValue
    microbial_reduction_index: RangeValue
    confidence: Literal["LOW", "MEDIUM", "HIGH"]
    recommendations: list[str]
    quality_curve: list[QualityPoint]
    cold_chain_alert: str | None = None
    digital_twin_summary: str
    model_notes: list[str]
