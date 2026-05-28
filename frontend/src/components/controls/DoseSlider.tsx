import { useTranslation } from "react-i18next";

import { Slider } from "../ui/slider";

interface DoseSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function DoseSlider({ value, onChange }: DoseSliderProps) {
  const { t } = useTranslation();

  return (
    <Slider
      label={t("controls.dose")}
      valueLabel={`${value.toFixed(1)} kGy`}
      min={0}
      max={5}
      step={0.1}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  );
}
