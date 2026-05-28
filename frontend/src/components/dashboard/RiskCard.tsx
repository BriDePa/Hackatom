import { AlertTriangle, ShieldCheck, Siren } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "../../lib/utils";
import type { RiskLevel } from "../../types/simulation";
import { Card } from "../ui/card";

interface RiskCardProps {
  risk: RiskLevel;
}

const riskStyles = {
  LOW: "border-bio/40 text-bio",
  MEDIUM: "border-warning/50 text-warning",
  HIGH: "border-danger/50 text-danger",
};

export function RiskCard({ risk }: RiskCardProps) {
  const { t } = useTranslation();
  const Icon = risk === "LOW" ? ShieldCheck : risk === "MEDIUM" ? AlertTriangle : Siren;

  return (
    <Card className={cn("p-5", riskStyles[risk])}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-emerald-50/60">{t("dashboard.risk")}</p>
          <p className="mt-2 text-3xl font-semibold">{t(`risk.${risk}`)}</p>
        </div>
        <Icon className="h-10 w-10" />
      </div>
    </Card>
  );
}
