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
      <p className="text-sm text-ink/60">{t("dashboard.recommendations")}</p>
      <div className="mt-4 grid gap-3">
        {recommendations.map((recommendation) => (
          <div key={recommendation} className="flex gap-3 rounded-lg bg-stroke/[0.04] p-3 text-sm text-ink/85">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-stroke" />
            <span>{t(`recommendations.${recommendation}`)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
