import {
  CartesianGrid,
  Area,
  AreaChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
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
          <p className="text-sm text-ink/60">{t("dashboard.curve")}</p>
          <h2 className="text-xl font-semibold text-ink">{t("dashboard.comparison")}</h2>
        </div>
        <div className="flex items-center gap-4 text-xs text-ink/60">
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-indicator-accent" />
            {t("chart.irradiated")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 border-b border-dashed border-inkLight" />
            {t("chart.nonIrradiated")}
          </span>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: -20 }}>
            <CartesianGrid stroke="rgba(0,0,0,0.08)" strokeDasharray="4 4" />
            <XAxis dataKey="day" stroke="rgba(0,0,0,0.4)" label={{ value: t("chart.day"), position: "insideBottom", offset: -2 }} />
            <YAxis stroke="rgba(0,0,0,0.4)" domain={[30, 100]} />
            <Tooltip content={<ChartTooltip />} />
            <Area
              type="monotone"
              dataKey="irradiated_high"
              stroke="transparent"
              fill="rgba(37,99,235,0.10)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="irradiated_low"
              stroke="transparent"
              fill="#ffffff"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="irradiated"
              stroke="#2563eb"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 4, stroke: "#2563eb", strokeWidth: 2, fill: "#ffffff" }}
            />
            <Line
              type="monotone"
              dataKey="non_irradiated"
              stroke="#6b6b6b"
              strokeWidth={2}
              strokeDasharray="6 5"
              dot={false}
              activeDot={{ r: 3, stroke: "#6b6b6b", strokeWidth: 1.5, fill: "#ffffff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  const { t } = useTranslation();
  if (!active || !payload || payload.length === 0) return null;

  const point = payload[0]?.payload as QualityPoint | undefined;
  if (!point) return null;

  const events: string[] = [];
  if (point.cold_chain_event) events.push(t("events.coldChain"));
  if (point.delay_event) events.push(t("events.delay"));
  if (point.thermal_event) events.push(t("events.thermal"));
  if (point.storage_event) events.push(t("events.storage"));

  return (
    <div className="rounded-lg border border-stroke/20 bg-white px-4 py-3 shadow-sketch">
      <p className="mb-1.5 text-xs font-semibold text-ink/70">
        {t("chart.day")} {label}
      </p>
      <div className="grid gap-1 text-xs">
        <div className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-1.5 text-ink/80">
            <span className="h-1.5 w-1.5 rounded-full bg-indicator-accent" />
            {t("chart.irradiated")}
          </span>
          <span className="font-mono font-semibold text-indicator-accent">
            {point.irradiated.toFixed(1)}%
          </span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span className="flex items-center gap-1.5 text-ink/80">
            <span className="h-1.5 w-1.5 rounded-full border border-inkLight bg-white" />
            {t("chart.nonIrradiated")}
          </span>
          <span className="font-mono text-inkLight">
            {point.non_irradiated.toFixed(1)}%
          </span>
        </div>
        <div className="mt-0.5 border-t border-stroke/10 pt-1.5 text-[11px] text-inkLight">
          {t("chart.uncertaintyHigh")}: {point.irradiated_low.toFixed(1)}% – {point.irradiated_high.toFixed(1)}%
        </div>
        {events.length > 0 ? (
          <div className="mt-0.5 flex flex-wrap gap-1">
            {events.map((event) => (
              <span key={event} className="rounded bg-indicator-warning/15 px-1.5 py-0.5 text-[10px] font-medium text-indicator-warning">
                {event}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
