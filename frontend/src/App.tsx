import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, Atom, FlaskConical } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DoseSlider } from "./components/controls/DoseSlider";
import { HumiditySlider } from "./components/controls/HumiditySlider";
import { LanguageSelector } from "./components/controls/LanguageSelector";
import { ProductSelector } from "./components/controls/ProductSelector";
import { TemperatureSlider } from "./components/controls/TemperatureSlider";
import { TransportSelector } from "./components/controls/TransportSelector";
import { ColdChainAlert } from "./components/dashboard/ColdChainAlert";
import { QualityChart } from "./components/dashboard/QualityChart";
import { RecommendationCard } from "./components/dashboard/RecommendationCard";
import { RiskCard } from "./components/dashboard/RiskCard";
import { ScenarioComparison } from "./components/dashboard/ScenarioComparison";
import { Card } from "./components/ui/card";
import { simulateScenario } from "./lib/api";
import { fallbackSimulation } from "./lib/mock-data";
import type { SimulationInput, SimulationResponse } from "./types/simulation";

const initialInput: SimulationInput = {
  product: "tomato",
  dose: 1.4,
  temperature: 8,
  humidity: 82,
  transport_hours: 36,
  cold_chain_failure: false,
};

function App() {
  const { t } = useTranslation();
  const [input, setInput] = useState<SimulationInput>(initialInput);
  const [simulation, setSimulation] = useState<SimulationResponse>(fallbackSimulation);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSimulate = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await simulateScenario(input);
      setSimulation(result);
    } catch {
      setSimulation(fallbackSimulation);
      setError("simulation_failed");
    } finally {
      setIsLoading(false);
    }
  }, [input]);

  useEffect(() => {
    void handleSimulate();
  }, [handleSimulate]);

  const metrics = useMemo(
    () => [
      {
        label: t("dashboard.quality"),
        value: formatRange(
          simulation.remaining_quality.min,
          simulation.remaining_quality.max,
          simulation.remaining_quality.unit,
          t,
        ),
      },
      {
        label: t("dashboard.shelfLife"),
        value: formatRange(
          simulation.estimated_shelf_life_range.min,
          simulation.estimated_shelf_life_range.max,
          simulation.estimated_shelf_life_range.unit,
          t,
        ),
      },
      {
        label: t("dashboard.loss"),
        value: formatRange(
          simulation.estimated_loss_percentage.min,
          simulation.estimated_loss_percentage.max,
          simulation.estimated_loss_percentage.unit,
          t,
        ),
      },
      {
        label: t("dashboard.confidence"),
        value: t(`confidence.${simulation.confidence}`),
      },
    ],
    [simulation, t],
  );

  return (
    <main className="min-h-screen p-4 text-emerald-50 md:p-6">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[380px_minmax(0,1fr)]">
        <motion.aside
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-lg border border-white/10 bg-carbon/88 p-5 shadow-glow backdrop-blur"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-md border border-bio/25 bg-bio/10 px-2 py-1 text-xs uppercase text-bio">
                <Atom className="h-3.5 w-3.5" />
                {t("app.badge")}
              </span>
              <h1 className="mt-4 text-3xl font-semibold tracking-normal">{t("app.title")}</h1>
              <p className="mt-2 text-sm leading-6 text-emerald-50/65">{t("app.subtitle")}</p>
            </div>
          </div>

          <div className="grid gap-5">
            <LanguageSelector />
            <ProductSelector
              value={input.product}
              onChange={(product) => setInput((current) => ({ ...current, product }))}
            />
            <DoseSlider value={input.dose} onChange={(dose) => setInput((current) => ({ ...current, dose }))} />
            <TemperatureSlider
              value={input.temperature}
              onChange={(temperature) => setInput((current) => ({ ...current, temperature }))}
            />
            <HumiditySlider
              value={input.humidity}
              onChange={(humidity) => setInput((current) => ({ ...current, humidity }))}
            />
            <TransportSelector
              value={input.transport_hours}
              coldChainFailure={input.cold_chain_failure}
              onTransportChange={(transport_hours) => setInput((current) => ({ ...current, transport_hours }))}
              onColdChainChange={(cold_chain_failure) =>
                setInput((current) => ({ ...current, cold_chain_failure }))
              }
            />
            <button
              type="button"
              onClick={() => void handleSimulate()}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-bio px-4 py-3 font-semibold text-carbon transition hover:bg-emerald-300 disabled:cursor-wait disabled:opacity-70"
              disabled={isLoading}
            >
              <FlaskConical className="h-4 w-4" />
              {t("controls.simulate")}
            </button>
            <p className="text-xs leading-5 text-emerald-50/50">{t("app.disclaimer")}</p>
            {error ? <p className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-sm text-warning">{t(`errors.${error}`)}</p> : null}
          </div>
        </motion.aside>

        <section className="grid gap-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
          >
            {metrics.map((metric) => (
              <Card key={metric.label} className="p-5">
                <p className="text-sm text-emerald-50/60">{metric.label}</p>
                <p className="mt-3 font-mono text-3xl text-emerald-50">{metric.value}</p>
              </Card>
            ))}
          </motion.div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)]">
            <QualityChart data={simulation.quality_curve} />
            <div className="grid gap-5">
              <RiskCard risk={simulation.risk_level} />
              <ScenarioComparison data={simulation.quality_curve} />
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <RecommendationCard recommendations={simulation.recommendations} />
            <div className="grid gap-5">
              <ColdChainAlert alert={simulation.cold_chain_alert} />
              <Card className="p-5">
                <div className="flex items-center gap-2 text-sm text-emerald-50/60">
                  <Activity className="h-4 w-4 text-ion" />
                  {t("dashboard.modelNotes")}
                </div>
                <div className="mt-4 grid gap-2">
                  {simulation.model_notes.map((note) => (
                    <p key={note} className="rounded-lg bg-white/[0.04] px-3 py-2 text-sm text-emerald-50/75">
                      {t(`notes.${note}`)}
                    </p>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default App;

function formatRange(
  min: number,
  max: number,
  unit: string,
  t: (key: string, options?: Record<string, string>) => string,
) {
  return `${Math.round(min)}-${Math.round(max)} ${t(`units.${unit}`, { defaultValue: unit })}`;
}
