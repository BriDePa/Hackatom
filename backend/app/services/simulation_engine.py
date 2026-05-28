import math

import numpy as np

from app.models.simulation import QualityPoint, RangeValue, SimulationRequest, SimulationResponse
from app.services.product_repository import ProductProfile, get_product


LOW_RISK_THRESHOLD = 72
MEDIUM_RISK_THRESHOLD = 48
QUALITY_FLOOR = 30
INITIAL_QUALITY = 100
COLD_CHAIN_MULTIPLIER = 1.32
TRANSPORT_PRESSURE_FACTOR = 0.00035


def simulate_postharvest(request: SimulationRequest) -> SimulationResponse:
    product = get_product(request.product)
    irradiated_k = _dynamic_k(product, request, use_dose=True)
    non_irradiated_k = _dynamic_k(product, request, use_dose=False)
    days = _simulation_days(product, request.transport_hours)

    curve = [
        QualityPoint(
            day=int(day),
            irradiated=_bounded_quality(irradiated_k, day),
            non_irradiated=_bounded_quality(non_irradiated_k, day),
        )
        for day in range(days + 1)
    ]

    transport_days = max(request.transport_hours / 24, 1)
    remaining_quality = _bounded_quality(irradiated_k, transport_days)
    risk_level = _risk_level(remaining_quality)
    shelf_life = _shelf_life_range(irradiated_k)
    loss = _range(100 - remaining_quality, width=4, unit="%")

    recommendations = _recommendations(product, request, risk_level)
    cold_chain_alert = None
    if request.cold_chain_failure:
        cold_chain_alert = "cold_chain_failure_active"
        recommendations.insert(0, "restore_cold_chain")

    return SimulationResponse(
        product=request.product,
        risk_level=risk_level,
        remaining_quality=_range(remaining_quality, width=3, unit="%"),
        estimated_shelf_life_range=shelf_life,
        estimated_loss_percentage=loss,
        confidence="MEDIUM",
        recommendations=recommendations,
        quality_curve=curve,
        cold_chain_alert=cold_chain_alert,
        model_notes=[
            "simplified_exponential_decay",
            "relative_risk_not_industrial_prediction",
            "ranges_include_operational_uncertainty",
        ],
    )


def _dynamic_k(product: ProductProfile, request: SimulationRequest, use_dose: bool) -> float:
    dose = request.dose if use_dose else 0
    transport_pressure = request.transport_hours * TRANSPORT_PRESSURE_FACTOR / 24
    k = product.k0 + product.a * request.temperature + product.b * request.humidity - product.c * dose
    k += transport_pressure
    if request.cold_chain_failure:
        k *= COLD_CHAIN_MULTIPLIER
        k += 0.012
    return max(k, 0.004)


def _bounded_quality(k: float, day: float) -> float:
    quality = INITIAL_QUALITY * float(np.exp(-k * day))
    return round(max(min(quality, INITIAL_QUALITY), QUALITY_FLOOR), 1)


def _risk_level(quality: float) -> str:
    if quality >= LOW_RISK_THRESHOLD:
        return "LOW"
    if quality >= MEDIUM_RISK_THRESHOLD:
        return "MEDIUM"
    return "HIGH"


def _shelf_life_range(k: float) -> RangeValue:
    threshold_quality = 62
    center = math.log(INITIAL_QUALITY / threshold_quality) / k
    return _range(center, width=max(2, center * 0.12), unit="days")


def _range(center: float, width: float, unit: str) -> RangeValue:
    low = max(center - width / 2, 0)
    high = max(center + width / 2, low)
    return RangeValue(min=round(low, 1), max=round(high, 1), unit=unit)


def _simulation_days(product: ProductProfile, transport_hours: int) -> int:
    transport_days = math.ceil(transport_hours / 24)
    return max(product.baseline_shelf_days + 8, transport_days + 6)


def _recommendations(product: ProductProfile, request: SimulationRequest, risk_level: str) -> list[str]:
    recommendations: list[str] = []
    if request.temperature > product.safe_temperature + 4:
        recommendations.append("reduce_temperature")
    if abs(request.humidity - product.ideal_humidity) > 10:
        recommendations.append("adjust_humidity")
    if request.dose < 0.8:
        recommendations.append("evaluate_higher_dose")
    if request.transport_hours > 72:
        recommendations.append("shorten_transport_window")
    if risk_level == "HIGH":
        recommendations.append("prioritize_fast_distribution")
    if not recommendations:
        recommendations.append("scenario_within_operational_window")
    return recommendations
