import { Truck } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TransportSelectorProps {
  value: number;
  routeId: string;
  transportType: string;
  refrigeratedStorage: boolean;
  lotValue: number;
  coldChainFailureHours: number;
  delayHours: number;
  thermalExposureHours: number;
  extendedStorageHours: number;
  coldChainFailure: boolean;
  onTransportChange: (value: number) => void;
  onRouteChange: (value: "optimal_cold_chain" | "export_stress" | "ambient_long_distance") => void;
  onTransportTypeChange: (value: "refrigerated_truck" | "ambient_truck" | "mixed_cargo" | "air_cargo") => void;
  onRefrigeratedStorageChange: (value: boolean) => void;
  onLotValueChange: (value: number) => void;
  onColdChainHoursChange: (value: number) => void;
  onDelayHoursChange: (value: number) => void;
  onThermalExposureHoursChange: (value: number) => void;
  onExtendedStorageHoursChange: (value: number) => void;
  onColdChainChange: (value: boolean) => void;
}

export function TransportSelector({
  value,
  routeId,
  transportType,
  refrigeratedStorage,
  lotValue,
  coldChainFailureHours,
  delayHours,
  thermalExposureHours,
  extendedStorageHours,
  coldChainFailure,
  onTransportChange,
  onRouteChange,
  onTransportTypeChange,
  onRefrigeratedStorageChange,
  onLotValueChange,
  onColdChainHoursChange,
  onDelayHoursChange,
  onThermalExposureHoursChange,
  onExtendedStorageHoursChange,
  onColdChainChange,
}: TransportSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4">
      <label className="grid gap-2 text-sm text-ink/80">
        <span className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-inkLight" />
          {t("controls.route")}
        </span>
        <select
          value={routeId}
          onChange={(event) =>
            onRouteChange(event.target.value as "optimal_cold_chain" | "export_stress" | "ambient_long_distance")
          }
          className="rounded-lg border border-stroke/10 bg-white px-3 py-3 text-ink outline-none ring-stroke/30 focus:ring-2"
        >
          <option value="optimal_cold_chain">{t("routes.optimal_cold_chain")}</option>
          <option value="export_stress">{t("routes.export_stress")}</option>
          <option value="ambient_long_distance">{t("routes.ambient_long_distance")}</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm text-ink/80">
        <span>{t("controls.transportType")}</span>
        <select
          value={transportType}
          onChange={(event) =>
            onTransportTypeChange(
              event.target.value as "refrigerated_truck" | "ambient_truck" | "mixed_cargo" | "air_cargo",
            )
          }
          className="rounded-lg border border-stroke/10 bg-white px-3 py-3 text-ink outline-none ring-stroke/30 focus:ring-2"
        >
          <option value="refrigerated_truck">{t("transportTypes.refrigerated_truck")}</option>
          <option value="ambient_truck">{t("transportTypes.ambient_truck")}</option>
          <option value="mixed_cargo">{t("transportTypes.mixed_cargo")}</option>
          <option value="air_cargo">{t("transportTypes.air_cargo")}</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm text-ink/80">
        <span className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-inkLight" />
          {t("controls.transport")}
        </span>
        <input
          type="number"
          min={1}
          max={240}
          value={value}
          onChange={(event) => onTransportChange(Number(event.target.value))}
          className="rounded-lg border border-stroke/10 bg-white px-3 py-3 text-ink outline-none ring-stroke/30 focus:ring-2"
        />
      </label>
      <label className="grid gap-2 text-sm text-ink/80">
        <span>{t("controls.lotValue")}</span>
        <input
          type="number"
          min={100}
          max={100000}
          value={lotValue}
          onChange={(event) => onLotValueChange(Number(event.target.value))}
          className="rounded-lg border border-stroke/10 bg-white px-3 py-3 text-ink outline-none ring-stroke/30 focus:ring-2"
        />
      </label>
      <button
        type="button"
        onClick={() => onRefrigeratedStorageChange(!refrigeratedStorage)}
        className="flex items-center justify-between rounded-lg border border-stroke/10 bg-stroke/[0.04] px-4 py-3 text-left text-sm text-ink transition hover:border-stroke/40"
        aria-pressed={refrigeratedStorage}
      >
        <span>{t("controls.refrigeratedStorage")}</span>
        <span className={refrigeratedStorage ? "text-stroke" : "text-stroke/60"}>
          {refrigeratedStorage ? t("controls.enabled") : t("controls.disabled")}
        </span>
      </button>
      <button
        type="button"
        onClick={() => onColdChainChange(!coldChainFailure)}
        className="flex items-center justify-between rounded-lg border border-stroke/10 bg-stroke/[0.04] px-4 py-3 text-left text-sm text-ink transition hover:border-stroke/40"
        aria-pressed={coldChainFailure}
      >
        <span>{t("controls.coldChain")}</span>
        <span className={coldChainFailure ? "text-stroke" : "text-stroke/60"}>
          {coldChainFailure ? t("controls.failure") : t("controls.normal")}
        </span>
      </button>
      {coldChainFailure ? (
        <label className="grid gap-2 text-sm text-ink/80">
          <span>{t("controls.failureHours")}</span>
          <input
            type="number"
            min={1}
            max={48}
            value={coldChainFailureHours}
            onChange={(event) => onColdChainHoursChange(Number(event.target.value))}
            className="rounded-lg border border-stroke/30 bg-white px-3 py-3 text-ink outline-none ring-stroke/30 focus:ring-2"
          />
        </label>
      ) : null}
      <div className="grid gap-3 rounded-lg border border-stroke/10 bg-stroke/[0.035] p-3">
        <p className="text-sm font-semibold text-ink/80">{t("controls.logisticsEvents")}</p>
        <EventInput label={t("controls.delayHours")} value={delayHours} max={96} onChange={onDelayHoursChange} />
        <EventInput
          label={t("controls.thermalExposureHours")}
          value={thermalExposureHours}
          max={48}
          onChange={onThermalExposureHoursChange}
        />
        <EventInput
          label={t("controls.extendedStorageHours")}
          value={extendedStorageHours}
          max={168}
          onChange={onExtendedStorageHoursChange}
        />
      </div>
    </div>
  );
}

interface EventInputProps {
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
}

function EventInput({ label, value, max, onChange }: EventInputProps) {
  return (
    <label className="grid gap-1 text-xs text-ink/70">
      <span>{label}</span>
      <input
        type="number"
        min={0}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="rounded-md border border-stroke/10 bg-white px-3 py-2 text-sm text-ink outline-none ring-stroke/30 focus:ring-2"
      />
    </label>
  );
}
