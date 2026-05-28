import { useTranslation } from "react-i18next";

import type { QualityPoint } from "../../types/simulation";
import { Card } from "../ui/card";

interface ScenarioComparisonProps {
  data: QualityPoint[];
}

export function ScenarioComparison({ data }: ScenarioComparisonProps) {
  const { t } = useTranslation();
  const lastPoint = data[data.length - 1];
  const gain = Math.max(lastPoint.irradiated - lastPoint.non_irradiated, 0);

  return (
    <Card className="p-5">
      <p className="text-sm text-emerald-50/60">{t("dashboard.comparison")}</p>
      <div className="mt-5 grid gap-4">
        <MetricBar label={t("chart.irradiated")} value={lastPoint.irradiated} tone="bio" />
        <MetricBar label={t("chart.nonIrradiated")} value={lastPoint.non_irradiated} tone="ion" />
      </div>
      <p className="mt-4 font-mono text-sm text-bio">
        +{gain.toFixed(1)}% {t("dashboard.delta")}
      </p>
    </Card>
  );
}

interface MetricBarProps {
  label: string;
  value: number;
  tone: "bio" | "ion";
}

function MetricBar({ label, value, tone }: MetricBarProps) {
  const color = tone === "bio" ? "bg-bio" : "bg-ion";

  return (
    <div>
      <div className="mb-2 flex justify-between text-sm text-emerald-50/75">
        <span>{label}</span>
        <span>{value.toFixed(1)}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
