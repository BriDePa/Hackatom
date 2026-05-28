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
    <Card className={`p-5 ${alert ? "border-danger/40" : "border-bio/30"}`}>
      <div className="flex gap-3">
        <ThermometerSnowflake className={`h-5 w-5 shrink-0 ${alert ? "text-danger" : "text-bio"}`} />
        <div>
          <p className="text-sm text-emerald-50/60">{t("dashboard.alerts")}</p>
          <p className="mt-2 text-sm text-emerald-50/90">{message}</p>
        </div>
      </div>
    </Card>
  );
}
