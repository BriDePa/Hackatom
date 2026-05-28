export interface SimulationInput {
  product: "tomato" | "strawberry";
  dose: number;
  temperature: number;
  humidity: number;
  transport_hours: number;
  cold_chain_failure: boolean;
}

export interface RangeValue {
  min: number;
  max: number;
  unit: string;
}

export interface QualityPoint {
  day: number;
  irradiated: number;
  non_irradiated: number;
}

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface SimulationResponse {
  product: string;
  risk_level: RiskLevel;
  remaining_quality: RangeValue;
  estimated_shelf_life_range: RangeValue;
  estimated_loss_percentage: RangeValue;
  confidence: "LOW" | "MEDIUM" | "HIGH";
  recommendations: string[];
  quality_curve: QualityPoint[];
  cold_chain_alert: string | null;
  model_notes: string[];
}
