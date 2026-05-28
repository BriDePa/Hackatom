import type { SimulationResponse } from "../types/simulation";

export const fallbackSimulation: SimulationResponse = {
  product: "tomato",
  risk_level: "MEDIUM",
  remaining_quality: { min: 66, max: 72, unit: "%" },
  estimated_shelf_life_range: { min: 16, max: 21, unit: "days" },
  estimated_loss_percentage: { min: 28, max: 34, unit: "%" },
  confidence: "MEDIUM",
  recommendations: ["scenario_within_operational_window", "adjust_humidity"],
  cold_chain_alert: null,
  model_notes: [
    "simplified_exponential_decay",
    "relative_risk_not_industrial_prediction",
    "ranges_include_operational_uncertainty",
  ],
  quality_curve: Array.from({ length: 28 }, (_, day) => ({
    day,
    irradiated: Math.max(100 * Math.exp(-0.026 * day), 30),
    non_irradiated: Math.max(100 * Math.exp(-0.042 * day), 30),
  })),
};
