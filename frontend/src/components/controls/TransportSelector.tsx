import { Truck } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TransportSelectorProps {
  value: number;
  coldChainFailure: boolean;
  onTransportChange: (value: number) => void;
  onColdChainChange: (value: boolean) => void;
}

export function TransportSelector({
  value,
  coldChainFailure,
  onTransportChange,
  onColdChainChange,
}: TransportSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4">
      <label className="grid gap-2 text-sm text-emerald-50/80">
        <span className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-ion" />
          {t("controls.transport")}
        </span>
        <input
          type="number"
          min={1}
          max={240}
          value={value}
          onChange={(event) => onTransportChange(Number(event.target.value))}
          className="rounded-lg border border-white/10 bg-carbon px-3 py-3 text-emerald-50 outline-none ring-ion/30 focus:ring-2"
        />
      </label>
      <button
        type="button"
        onClick={() => onColdChainChange(!coldChainFailure)}
        className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm text-emerald-50 transition hover:border-cyan-300/50"
        aria-pressed={coldChainFailure}
      >
        <span>{t("controls.coldChain")}</span>
        <span className={coldChainFailure ? "text-danger" : "text-bio"}>
          {coldChainFailure ? t("controls.failure") : t("controls.normal")}
        </span>
      </button>
    </div>
  );
}
