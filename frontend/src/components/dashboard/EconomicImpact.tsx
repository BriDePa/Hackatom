import { Banknote, TrendingDown } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { SimulationResponse } from "../../types/simulation";
import { Card } from "../ui/card";

interface EconomicImpactProps {
  simulation: SimulationResponse;
  formatRange: (min: number, max: number, unit: string) => string;
}

export function EconomicImpact({ simulation, formatRange }: EconomicImpactProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-5">
      <p className="text-sm text-emerald-50/60">{t("dashboard.economicImpact")}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-danger/20 bg-danger/10 p-4">
          <TrendingDown className="mb-3 h-5 w-5 text-danger" />
          <p className="text-sm text-emerald-50/65">{t("dashboard.estimatedLossValue")}</p>
          <p className="mt-2 font-mono text-2xl text-emerald-50">
            {formatRange(
              simulation.estimated_loss_value.min,
              simulation.estimated_loss_value.max,
              simulation.estimated_loss_value.unit,
            )}
          </p>
        </div>
        <div className="rounded-lg border border-bio/20 bg-bio/10 p-4">
          <Banknote className="mb-3 h-5 w-5 text-bio" />
          <p className="text-sm text-emerald-50/65">{t("dashboard.potentialSavings")}</p>
          <p className="mt-2 font-mono text-2xl text-emerald-50">
            {formatRange(
              simulation.potential_savings_value.min,
              simulation.potential_savings_value.max,
              simulation.potential_savings_value.unit,
            )}
          </p>
        </div>
      </div>
    </Card>
  );
}
