import type { SimulationInput, SimulationResponse } from "../types/simulation";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

export async function simulateScenario(input: SimulationInput): Promise<SimulationResponse> {
  const response = await fetch(`${API_URL}/simulate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("simulation_failed");
  }

  return response.json() as Promise<SimulationResponse>;
}
