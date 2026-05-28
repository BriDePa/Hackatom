import { useTranslation } from "react-i18next";

import { Slider } from "../ui/slider";

interface HumiditySliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function HumiditySlider({ value, onChange }: HumiditySliderProps) {
  const { t } = useTranslation();

  return (
    <Slider
      label={t("controls.humidity")}
      valueLabel={`${value}%`}
      min={40}
      max={100}
      step={1}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  );
}
