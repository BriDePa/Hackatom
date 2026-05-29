import { AlertTriangle, ShieldCheck, Siren } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "../../lib/utils";
import type { RiskLevel } from "../../types/simulation";
import { Card } from "../ui/card";

interface RiskCardProps {
  risk: RiskLevel;
}

const riskStyles = {
  LOW: "border-indicator-savings/30 text-indicator-savings",
  MEDIUM: "border-indicator-warning/40 text-indicator-warning",
  HIGH: "border-indicator-loss/40 text-indicator-loss",
};

const riskIcons = {
  LOW: ShieldCheck,
  MEDIUM: AlertTriangle,
  HIGH: Siren,
};

export function RiskCard({ risk }: RiskCardProps) {
  const { t } = useTranslation();
  const Icon = riskIcons[risk];

  return (
    <Card className={cn("p-5", riskStyles[risk])}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-ink/60">{t("dashboard.risk")}</p>
          <p className="mt-2 text-3xl font-semibold">{t(`risk.${risk}`)}</p>
        </div>
        <Icon className="h-10 w-10" />
      </div>
    </Card>
  );
}
