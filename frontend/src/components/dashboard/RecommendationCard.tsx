import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card } from "../ui/card";

interface RecommendationCardProps {
  recommendations: string[];
}

export function RecommendationCard({ recommendations }: RecommendationCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-5">
      <p className="text-sm text-emerald-50/60">{t("dashboard.recommendations")}</p>
      <div className="mt-4 grid gap-3">
        {recommendations.map((recommendation) => (
          <div key={recommendation} className="flex gap-3 rounded-lg bg-white/[0.04] p-3 text-sm text-emerald-50/85">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-bio" />
            <span>{t(`recommendations.${recommendation}`)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
