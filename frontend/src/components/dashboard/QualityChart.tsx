import {
  CartesianGrid,
  Area,
  AreaChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslation } from "react-i18next";

import type { QualityPoint } from "../../types/simulation";
import { Card } from "../ui/card";

interface QualityChartProps {
  data: QualityPoint[];
}

export function QualityChart({ data }: QualityChartProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-emerald-50/60">{t("dashboard.curve")}</p>
          <h2 className="text-xl font-semibold text-emerald-50">{t("dashboard.comparison")}</h2>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: -20 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
            <XAxis dataKey="day" stroke="rgba(236,255,247,0.65)" label={{ value: t("chart.day"), position: "insideBottom", offset: -2 }} />
            <YAxis stroke="rgba(236,255,247,0.65)" domain={[30, 100]} />
            <Tooltip
              contentStyle={{
                background: "#07110f",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 8,
                color: "#ecfff7",
              }}
            />
            <Area
              type="monotone"
              dataKey="irradiated_high"
              name={t("chart.uncertaintyHigh")}
              stroke="transparent"
              fill="rgba(87,255,154,0.10)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="irradiated_low"
              name={t("chart.uncertaintyLow")}
              stroke="transparent"
              fill="#07110f"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="irradiated"
              name={t("chart.irradiated")}
              stroke="#57ff9a"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="non_irradiated"
              name={t("chart.nonIrradiated")}
              stroke="#45d9ff"
              strokeWidth={3}
              strokeDasharray="6 5"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
