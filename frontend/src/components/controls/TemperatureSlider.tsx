import { useTranslation } from "react-i18next";

import { Slider } from "../ui/slider";

interface TemperatureSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function TemperatureSlider({ value, onChange }: TemperatureSliderProps) {
  const { t } = useTranslation();

  return (
    <Slider
      label={t("controls.temperature")}
      valueLabel={`${value} °C`}
      min={-2}
      max={35}
      step={1}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  );
}
