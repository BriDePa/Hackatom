import { Sprout } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { SimulationInput } from "../../types/simulation";

interface ProductSelectorProps {
  value: SimulationInput["product"];
  onChange: (value: SimulationInput["product"]) => void;
}

export function ProductSelector({ value, onChange }: ProductSelectorProps) {
  const { t } = useTranslation();

  return (
    <label className="grid gap-2 text-sm text-emerald-50/80">
      <span className="flex items-center gap-2">
        <Sprout className="h-4 w-4 text-bio" />
        {t("controls.product")}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as SimulationInput["product"])}
        className="rounded-lg border border-white/10 bg-carbon px-3 py-3 text-emerald-50 outline-none ring-bio/30 focus:ring-2"
      >
        <option value="tomato">{t("controls.tomato")}</option>
        <option value="strawberry">{t("controls.strawberry")}</option>
        <option value="potato">{t("controls.potato")}</option>
      </select>
    </label>
  );
}
