import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
];

export function LanguageSelector() {
  const { i18n, t } = useTranslation();

  return (
    <label className="grid gap-2 text-sm text-emerald-50/80">
      <span className="flex items-center gap-2">
        <Languages className="h-4 w-4 text-ion" />
        {t("controls.language")}
      </span>
      <select
        value={i18n.language}
        onChange={(event) => void i18n.changeLanguage(event.target.value)}
        className="rounded-lg border border-white/10 bg-carbon px-3 py-3 text-emerald-50 outline-none ring-ion/30 focus:ring-2"
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.label}
          </option>
        ))}
      </select>
    </label>
  );
}
