import { BrainCircuit, Route, Waves } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import type { SimulationResponse } from "../../types/simulation";
import { Card } from "../ui/card";

interface SimulationIntelligenceProps {
  simulation: SimulationResponse;
  formatRange: (min: number, max: number, unit: string) => string;
}

export function SimulationIntelligence({ simulation, formatRange }: SimulationIntelligenceProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 text-sm text-emerald-50/60">
        <BrainCircuit className="h-4 w-4 text-ion" />
        {t("dashboard.digitalTwin")}
      </div>
      <p className="mt-3 text-sm leading-6 text-emerald-50/80">{t(`twin.${simulation.digital_twin_summary}`)}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Metric icon={<Route className="h-4 w-4" />} label={t("dashboard.route")} value={simulation.route} />
        <Metric
          icon={<Waves className="h-4 w-4" />}
          label={t("dashboard.logisticsStress")}
          value={formatRange(simulation.logistics_stress.min, simulation.logistics_stress.max, simulation.logistics_stress.unit)}
        />
        <Metric
          icon={<BrainCircuit className="h-4 w-4" />}
          label={t("dashboard.microbialReduction")}
          value={formatRange(
            simulation.microbial_reduction_index.min,
            simulation.microbial_reduction_index.max,
            simulation.microbial_reduction_index.unit,
          )}
        />
      </div>
    </Card>
  );
}

interface MetricProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function Metric({ icon, label, value }: MetricProps) {
  return (
    <div className="rounded-lg bg-white/[0.04] p-3">
      <div className="mb-2 flex items-center gap-2 text-ion">{icon}</div>
      <p className="text-xs text-emerald-50/55">{label}</p>
      <p className="mt-1 text-sm font-semibold text-emerald-50">{value}</p>
    </div>
  );
}
