import math

import numpy as np

from app.models.simulation import QualityPoint, RangeValue, SimulationRequest, SimulationResponse
from app.services.product_repository import ProductProfile, get_product
from app.services.route_repository import RouteProfile, get_route


INITIAL_QUALITY = 100
QUALITY_FLOOR = 24
SHELF_LIFE_THRESHOLD = 62
LOW_RISK_THRESHOLD = 42
MEDIUM_RISK_THRESHOLD = 68
UNCERTAINTY_WIDTH = 4.5


def simulate_postharvest(request: SimulationRequest) -> SimulationResponse:
    product = get_product(request.product)
    route = get_route(request.route_id)
    days = _simulation_days(product, request, route)
    logistics_stress = _logistics_stress(product, request, route)

    irradiated_series = _quality_series(product, request, route, days, use_dose=True)
    non_irradiated_series = _quality_series(product, request, route, days, use_dose=False)
    curve = [
        QualityPoint(
            day=point["day"],
            irradiated=point["quality"],
            irradiated_low=max(round(point["quality"] - UNCERTAINTY_WIDTH, 1), QUALITY_FLOOR),
            irradiated_high=min(round(point["quality"] + UNCERTAINTY_WIDTH, 1), INITIAL_QUALITY),
            non_irradiated=non_irradiated_series[index]["quality"],
            cold_chain_event=point["cold_chain_event"],
            delay_event=point["delay_event"],
            thermal_event=point["thermal_event"],
            storage_event=point["storage_event"],
        )
        for index, point in enumerate(irradiated_series)
    ]

    total_operational_hours = request.transport_hours + request.delay_hours + request.extended_storage_hours
    transport_days = max(total_operational_hours / 24, 1)
    remaining_quality = _quality_at(irradiated_series, transport_days)
    non_irradiated_quality = _quality_at(non_irradiated_series, transport_days)
    risk_pressure = _risk_pressure(product, request, logistics_stress, transport_days)
    risk_level = _risk_level(risk_pressure)
    shelf_life = _shelf_life_range(irradiated_series)
    loss_percentage = 100 - remaining_quality
    irradiated_loss_value = request.lot_value_usd * loss_percentage / 100
    non_irradiated_loss_value = request.lot_value_usd * (100 - non_irradiated_quality) / 100
    savings = max(non_irradiated_loss_value - irradiated_loss_value, 0)

    recommendations = _recommendations(product, request, route, risk_level, logistics_stress)
    cold_chain_alert = None
    if request.cold_chain_failure:
        cold_chain_alert = "cold_chain_failure_active"
        recommendations.insert(0, "restore_cold_chain")
    elif request.delay_hours or request.thermal_exposure_hours or request.extended_storage_hours:
        cold_chain_alert = "logistics_event_active"

    return SimulationResponse(
        product=request.product,
        route=route.name,
        risk_level=risk_level,
        risk_pressure=_range(risk_pressure, width=8, unit="index"),
        remaining_quality=_range(remaining_quality, width=UNCERTAINTY_WIDTH, unit="%"),
        estimated_shelf_life_range=shelf_life,
        estimated_loss_percentage=_range(loss_percentage, width=5, unit="%"),
        estimated_loss_value=_range(irradiated_loss_value, width=max(50, request.lot_value_usd * 0.025), unit="USD"),
        potential_savings_value=_range(savings, width=max(40, request.lot_value_usd * 0.02), unit="USD"),
        logistics_stress=_range(logistics_stress * 100, width=7, unit="index"),
        microbial_reduction_index=_range(_microbial_reduction_index(product, request.dose), width=6, unit="index"),
        confidence=_confidence(request, logistics_stress),
        recommendations=recommendations,
        quality_curve=curve,
        cold_chain_alert=cold_chain_alert,
        digital_twin_summary="digital_twin_batch_transport",
        model_notes=[
            "composite_quality_index",
            "dynamic_k_logistics_stress",
            "relative_risk_not_industrial_prediction",
            "literature_inspired_parameters",
            "ranges_include_operational_uncertainty",
        ],
    )


def _quality_series(
    product: ProductProfile,
    request: SimulationRequest,
    route: RouteProfile,
    days: int,
    use_dose: bool,
) -> list[dict[str, float | int | bool]]:
    quality = INITIAL_QUALITY
    points: list[dict[str, float | int | bool]] = []

    for day in range(days + 1):
        cold_chain_event = _is_cold_chain_failure_active(request, day)
        delay_event = _is_delay_active(request, day)
        thermal_event = _is_thermal_exposure_active(request, day)
        storage_event = _is_extended_storage_active(request, day)
        if day > 0:
            k = _dynamic_k(product, request, route, day - 1, use_dose)
            quality *= float(np.exp(-k))
        points.append(
            {
                "day": day,
                "quality": round(max(min(quality, INITIAL_QUALITY), QUALITY_FLOOR), 1),
                "cold_chain_event": cold_chain_event,
                "delay_event": delay_event,
                "thermal_event": thermal_event,
                "storage_event": storage_event,
            }
        )
    return points


def _dynamic_k(
    product: ProductProfile,
    request: SimulationRequest,
    route: RouteProfile,
    day: float,
    use_dose: bool,
) -> float:
    dose = request.dose if use_dose else 0
    logistics_stress = _logistics_stress(product, request, route)
    temperature_pressure = request.temperature / 100 * product.respiration_factor
    humidity_pressure = request.humidity / 1000 * product.microbial_sensitivity
    irradiation_protection = dose * 0.018 * product.irradiation_sensitivity
    logistics_pressure = logistics_stress / 10 * product.transport_sensitivity
    k = product.base_k + temperature_pressure + humidity_pressure - irradiation_protection + logistics_pressure

    if _is_cold_chain_failure_active(request, day):
        k += 0.035 + product.microbial_sensitivity * 0.018
    if _is_delay_active(request, day):
        k += 0.012 + product.transport_sensitivity * 0.006
    if _is_thermal_exposure_active(request, day):
        k += 0.022 + product.respiration_factor * 0.012
    if _is_extended_storage_active(request, day):
        k += 0.01 + product.microbial_sensitivity * 0.006
    return max(k, 0.006)


def _logistics_stress(product: ProductProfile, request: SimulationRequest, route: RouteProfile) -> float:
    total_transport_hours = request.transport_hours + request.delay_hours + request.extended_storage_hours
    delay_pressure = min(total_transport_hours / max(route.duration_hours, 1), 2.5) - 1
    delay_pressure = max(delay_pressure, 0) * 0.28
    refrigeration_penalty = 0 if route.refrigeration and request.refrigerated_storage else 0.18
    transport_penalty = _transport_stress_penalty(request.transport_type)
    event_pressure = min(
        request.delay_hours * 0.004
        + request.thermal_exposure_hours * 0.01
        + request.extended_storage_hours * 0.0025,
        0.28,
    )
    temperature_gap = max(request.temperature - product.optimal_temperature, 0) / 35
    thermal_instability = (1 - route.thermal_stability) * 0.18
    return min(
        route.logistics_stress
        + route.delay_risk * 0.24
        + delay_pressure
        + refrigeration_penalty
        + transport_penalty
        + event_pressure
        + temperature_gap
        + thermal_instability,
        1,
    )


def _risk_pressure(
    product: ProductProfile,
    request: SimulationRequest,
    logistics_stress: float,
    transport_days: float,
) -> float:
    temperature_term = 1.25 * max(request.temperature - product.optimal_temperature, 0)
    time_term = 5.5 * transport_days
    logistics_term = 48 * logistics_stress
    dose_term = 8.5 * request.dose
    cold_chain_term = 14 if request.cold_chain_failure else 0
    event_term = request.delay_hours * 0.28 + request.thermal_exposure_hours * 0.75 + request.extended_storage_hours * 0.12
    return max(temperature_term + time_term + logistics_term + cold_chain_term + event_term - dose_term, 0)


def _risk_level(risk_pressure: float) -> str:
    if risk_pressure < LOW_RISK_THRESHOLD:
        return "LOW"
    if risk_pressure < MEDIUM_RISK_THRESHOLD:
        return "MEDIUM"
    return "HIGH"


def _quality_at(series: list[dict[str, float | int | bool]], day: float) -> float:
    index = min(max(round(day), 0), len(series) - 1)
    return float(series[index]["quality"])


def _shelf_life_range(series: list[dict[str, float | int | bool]]) -> RangeValue:
    shelf_life_day = len(series) - 1
    for point in series:
        if float(point["quality"]) <= SHELF_LIFE_THRESHOLD:
            shelf_life_day = int(point["day"])
            break
    return _range(float(shelf_life_day), width=max(2, shelf_life_day * 0.16), unit="days")


def _range(center: float, width: float, unit: str) -> RangeValue:
    low = max(center - width / 2, 0)
    high = max(center + width / 2, low)
    return RangeValue(min=round(low, 1), max=round(high, 1), unit=unit)


def _simulation_days(product: ProductProfile, request: SimulationRequest, route: RouteProfile) -> int:
    total_hours = request.transport_hours + request.delay_hours + request.extended_storage_hours
    transport_days = math.ceil(max(total_hours, route.duration_hours) / 24)
    return max(product.base_shelf_life_days + 10, transport_days + 8)


def _is_cold_chain_failure_active(request: SimulationRequest, day: float) -> bool:
    if not request.cold_chain_failure:
        return False
    failure_days = request.cold_chain_failure_hours / 24
    return 0 <= day < failure_days


def _is_delay_active(request: SimulationRequest, day: float) -> bool:
    if request.delay_hours <= 0:
        return False
    start_day = request.transport_hours / 24
    end_day = start_day + request.delay_hours / 24
    return start_day <= day < end_day


def _is_thermal_exposure_active(request: SimulationRequest, day: float) -> bool:
    if request.thermal_exposure_hours <= 0:
        return False
    exposure_days = request.thermal_exposure_hours / 24
    return 0 <= day < exposure_days


def _is_extended_storage_active(request: SimulationRequest, day: float) -> bool:
    if request.extended_storage_hours <= 0:
        return False
    transport_end_day = (request.transport_hours + request.delay_hours) / 24
    storage_end_day = transport_end_day + request.extended_storage_hours / 24
    return transport_end_day <= day < storage_end_day


def _transport_stress_penalty(transport_type: str) -> float:
    penalties = {
        "refrigerated_truck": 0.0,
        "air_cargo": 0.04,
        "mixed_cargo": 0.11,
        "ambient_truck": 0.16,
    }
    return penalties.get(transport_type, 0.08)


def _microbial_reduction_index(product: ProductProfile, dose: float) -> float:
    return min(18 + dose * product.irradiation_sensitivity * 18, 92)


def _confidence(request: SimulationRequest, logistics_stress: float) -> str:
    if request.cold_chain_failure or logistics_stress > 0.72:
        return "LOW"
    if request.transport_hours > 96 or request.temperature > 24:
        return "MEDIUM"
    return "MEDIUM"


def _recommendations(
    product: ProductProfile,
    request: SimulationRequest,
    route: RouteProfile,
    risk_level: str,
    logistics_stress: float,
) -> list[str]:
    recommendations: list[str] = []
    if request.temperature > product.optimal_temperature + 4:
        recommendations.append("reduce_temperature")
    if abs(request.humidity - product.optimal_humidity) > 10:
        recommendations.append("adjust_humidity")
    if request.dose < 0.8:
        recommendations.append("evaluate_higher_dose")
    if request.transport_hours > route.duration_hours * 1.35:
        recommendations.append("shorten_transport_window")
    if request.thermal_exposure_hours > 0:
        recommendations.append("reduce_thermal_exposure")
    if request.delay_hours > 0:
        recommendations.append("manage_transport_delay")
    if request.extended_storage_hours > 24:
        recommendations.append("limit_extended_storage")
    if logistics_stress > 0.62:
        recommendations.append("reduce_logistics_stress")
    if risk_level == "HIGH":
        recommendations.append("prioritize_fast_distribution")
    if not recommendations:
        recommendations.append("scenario_within_operational_window")
    return recommendations
