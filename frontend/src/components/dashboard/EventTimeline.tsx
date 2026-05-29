import { Clock3, Thermometer, TimerReset, Warehouse } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { QualityPoint } from "../../types/simulation";
import { Card } from "../ui/card";

interface EventTimelineProps {
  data: QualityPoint[];
}

export function EventTimeline({ data }: EventTimelineProps) {
  const { t } = useTranslation();
  const events = [
    {
      key: "coldChain",
      active: data.some((point) => point.cold_chain_event),
      icon: <Thermometer className="h-4 w-4" />,
    },
    {
      key: "delay",
      active: data.some((point) => point.delay_event),
      icon: <TimerReset className="h-4 w-4" />,
    },
    {
      key: "thermal",
      active: data.some((point) => point.thermal_event),
      icon: <Clock3 className="h-4 w-4" />,
    },
    {
      key: "storage",
      active: data.some((point) => point.storage_event),
      icon: <Warehouse className="h-4 w-4" />,
    },
  ];

  return (
    <Card className="p-5">
      <p className="text-sm text-ink/60">{t("dashboard.eventTimeline")}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        {events.map((event) => (
          <div
            key={event.key}
            className={`rounded-lg border p-3 ${
              event.active ? "border-indicator-warning/40 bg-indicator-warning/10 text-indicator-warning" : "border-stroke/10 bg-stroke/[0.04] text-ink/55"
            }`}
          >
            <div className="mb-2">{event.icon}</div>
            <p className="text-sm font-semibold">{t(`events.${event.key}`)}</p>
            <p className="mt-1 text-xs">{event.active ? t("events.active") : t("events.inactive")}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
