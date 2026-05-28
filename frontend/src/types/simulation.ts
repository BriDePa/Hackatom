export interface SimulationInput {
  product: "tomato" | "strawberry" | "potato";
  route_id: "optimal_cold_chain" | "export_stress" | "ambient_long_distance";
  dose: number;
  temperature: number;
  humidity: number;
  transport_hours: number;
  transport_type: "refrigerated_truck" | "ambient_truck" | "mixed_cargo" | "air_cargo";
  refrigerated_storage: boolean;
  cold_chain_failure: boolean;
  cold_chain_failure_hours: number;
  delay_hours: number;
  thermal_exposure_hours: number;
  extended_storage_hours: number;
  lot_value_usd: number;
}

export interface RangeValue {
  min: number;
  max: number;
  unit: string;
}

export interface QualityPoint {
  day: number;
  irradiated: number;
  irradiated_low: number;
  irradiated_high: number;
  non_irradiated: number;
  cold_chain_event: boolean;
  delay_event: boolean;
  thermal_event: boolean;
  storage_event: boolean;
}

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface SimulationResponse {
  product: string;
  route: string;
  risk_level: RiskLevel;
  risk_pressure: RangeValue;
  remaining_quality: RangeValue;
  estimated_shelf_life_range: RangeValue;
  estimated_loss_percentage: RangeValue;
  estimated_loss_value: RangeValue;
  potential_savings_value: RangeValue;
  logistics_stress: RangeValue;
  microbial_reduction_index: RangeValue;
  confidence: "LOW" | "MEDIUM" | "HIGH";
  recommendations: string[];
  quality_curve: QualityPoint[];
  cold_chain_alert: string | null;
  digital_twin_summary: string;
  model_notes: string[];
}
