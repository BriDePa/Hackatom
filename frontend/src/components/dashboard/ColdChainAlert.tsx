import { ThermometerSnowflake } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card } from "../ui/card";

interface ColdChainAlertProps {
  alert: string | null;
}

export function ColdChainAlert({ alert }: ColdChainAlertProps) {
  const { t } = useTranslation();
  const message = alert ? t(`alerts.${alert}`) : t("alerts.none");

  return (
    <Card className={`p-5 ${alert ? "border-indicator-loss/30" : "border-indicator-savings/30"}`}>
      <div className="flex gap-3">
        <ThermometerSnowflake className={`h-5 w-5 shrink-0 ${alert ? "text-indicator-loss" : "text-indicator-savings"}`} />
        <div>
          <p className="text-sm text-ink/60">{t("dashboard.alerts")}</p>
          <p className="mt-2 text-sm text-ink/90">{message}</p>
        </div>
      </div>
    </Card>
  );
}
