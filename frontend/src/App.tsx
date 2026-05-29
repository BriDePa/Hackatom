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
import { EconomicImpact } from "./components/dashboard/EconomicImpact";
import { EventTimeline } from "./components/dashboard/EventTimeline";
import { QualityChart } from "./components/dashboard/QualityChart";
import { RecommendationCard } from "./components/dashboard/RecommendationCard";
import { RiskCard } from "./components/dashboard/RiskCard";
import { ScenarioComparison } from "./components/dashboard/ScenarioComparison";
import { SimulationIntelligence } from "./components/dashboard/SimulationIntelligence";
import { Card } from "./components/ui/card";
import { simulateScenario } from "./lib/api";
import { fallbackSimulation } from "./lib/mock-data";
import type { SimulationInput, SimulationResponse } from "./types/simulation";

const initialInput: SimulationInput = {
  product: "tomato",
  route_id: "optimal_cold_chain",
  dose: 1.4,
  temperature: 8,
  humidity: 82,
  transport_hours: 36,
  transport_type: "refrigerated_truck",
  refrigerated_storage: true,
  cold_chain_failure: false,
  cold_chain_failure_hours: 6,
  delay_hours: 0,
  thermal_exposure_hours: 0,
  extended_storage_hours: 0,
  lot_value_usd: 2500,
};

const scenarioPresets: Array<{ key: string; input: Partial<SimulationInput> }> = [
  {
    key: "optimalColdChain",
    input: {
      route_id: "optimal_cold_chain",
      transport_type: "refrigerated_truck",
      refrigerated_storage: true,
      temperature: 4,
      humidity: 88,
      transport_hours: 18,
      cold_chain_failure: false,
      delay_hours: 0,
      thermal_exposure_hours: 0,
      extended_storage_hours: 0,
    },
  },
  {
    key: "exportStress",
    input: {
      route_id: "export_stress",
      transport_type: "mixed_cargo",
      refrigerated_storage: true,
      temperature: 14,
      humidity: 82,
      transport_hours: 54,
      delay_hours: 10,
      thermal_exposure_hours: 2,
    },
  },
  {
    key: "refrigerationFailure",
    input: {
      route_id: "export_stress",
      transport_type: "refrigerated_truck",
      refrigerated_storage: false,
      temperature: 18,
      humidity: 84,
      cold_chain_failure: true,
      cold_chain_failure_hours: 8,
      thermal_exposure_hours: 4,
    },
  },
  {
    key: "highHumidityStorage",
    input: {
      route_id: "optimal_cold_chain",
      humidity: 96,
      temperature: 10,
      extended_storage_hours: 48,
      delay_hours: 0,
      thermal_exposure_hours: 0,
    },
  },
  {
    key: "longDistanceTransport",
    input: {
      route_id: "ambient_long_distance",
      transport_type: "ambient_truck",
      refrigerated_storage: false,
      temperature: 22,
      humidity: 78,
      transport_hours: 96,
      delay_hours: 12,
      thermal_exposure_hours: 6,
    },
  },
];

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

  const handleFormatRange = useCallback(
    (min: number, max: number, unit: string) => formatRange(min, max, unit, t),
    [t],
  );

  return (
    <main className="min-h-screen p-4 text-ink md:p-6">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[380px_minmax(0,1fr)]">
        <motion.aside
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-lg border border-stroke/10 bg-white p-5 shadow-sketch"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-md border border-indicator-accent/30 bg-indicator-accent/10 px-2 py-1 text-xs uppercase text-indicator-accent">
                <Atom className="h-3.5 w-3.5" />
                {t("app.badge")}
              </span>
              <h1 className="mt-4 text-3xl font-semibold tracking-normal">{t("app.title")}</h1>
              <p className="mt-2 text-sm leading-6 text-inkLight">{t("app.subtitle")}</p>
            </div>
          </div>

          <div className="grid gap-5">
            <LanguageSelector />
            <ProductSelector
              value={input.product}
              onChange={(product) => setInput((current) => ({ ...current, product }))}
            />
            <div className="grid gap-2">
              <p className="text-sm text-ink/80">{t("controls.quickScenarios")}</p>
              <div className="grid grid-cols-1 gap-2">
                {scenarioPresets.map((preset) => (
                  <button
                    key={preset.key}
                    type="button"
                    onClick={() => setInput((current) => ({ ...current, ...preset.input }))}
                    className="rounded-lg border border-stroke/10 bg-stroke/[0.04] px-3 py-2 text-left text-sm text-ink/80 transition hover:border-indicator-accent/50 hover:text-indicator-accent"
                  >
                    {t(`scenarios.${preset.key}`)}
                  </button>
                ))}
              </div>
            </div>
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
              routeId={input.route_id}
              transportType={input.transport_type}
              refrigeratedStorage={input.refrigerated_storage}
              lotValue={input.lot_value_usd}
              coldChainFailureHours={input.cold_chain_failure_hours}
              delayHours={input.delay_hours}
              thermalExposureHours={input.thermal_exposure_hours}
              extendedStorageHours={input.extended_storage_hours}
              coldChainFailure={input.cold_chain_failure}
              onRouteChange={(route_id) => setInput((current) => ({ ...current, route_id }))}
              onTransportTypeChange={(transport_type) => setInput((current) => ({ ...current, transport_type }))}
              onRefrigeratedStorageChange={(refrigerated_storage) =>
                setInput((current) => ({ ...current, refrigerated_storage }))
              }
              onTransportChange={(transport_hours) => setInput((current) => ({ ...current, transport_hours }))}
              onLotValueChange={(lot_value_usd) => setInput((current) => ({ ...current, lot_value_usd }))}
              onColdChainHoursChange={(cold_chain_failure_hours) =>
                setInput((current) => ({ ...current, cold_chain_failure_hours }))
              }
              onDelayHoursChange={(delay_hours) => setInput((current) => ({ ...current, delay_hours }))}
              onThermalExposureHoursChange={(thermal_exposure_hours) =>
                setInput((current) => ({ ...current, thermal_exposure_hours }))
              }
              onExtendedStorageHoursChange={(extended_storage_hours) =>
                setInput((current) => ({ ...current, extended_storage_hours }))
              }
              onColdChainChange={(cold_chain_failure) =>
                setInput((current) => ({ ...current, cold_chain_failure }))
              }
            />
            <button
              type="button"
              onClick={() => void handleSimulate()}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indicator-accent px-4 py-3 font-semibold text-white transition hover:bg-indicator-accent/80 disabled:cursor-wait disabled:opacity-70"
              disabled={isLoading}
            >
              <FlaskConical className="h-4 w-4" />
              {t("controls.simulate")}
            </button>
            <p className="text-xs leading-5 text-ink/50">{t("app.disclaimer")}</p>
            {error ? <p className="rounded-lg border border-stroke/40 bg-stroke/10 p-3 text-sm text-stroke">{t(`errors.${error}`)}</p> : null}
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
                <p className="text-sm text-ink/60">{metric.label}</p>
                <p className="mt-3 font-mono text-3xl text-ink">{metric.value}</p>
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

          <SimulationIntelligence simulation={simulation} formatRange={handleFormatRange} />
          <EventTimeline data={simulation.quality_curve} />

          <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className="grid gap-5">
              <EconomicImpact simulation={simulation} formatRange={handleFormatRange} />
              <RecommendationCard recommendations={simulation.recommendations} />
            </div>
            <div className="grid gap-5">
              <ColdChainAlert alert={simulation.cold_chain_alert} />
              <Card className="p-5">
                <div className="flex items-center gap-2 text-sm text-ink/60">
                  <Activity className="h-4 w-4 text-inkLight" />
                  {t("dashboard.modelNotes")}
                </div>
                <div className="mt-4 grid gap-2">
                  {simulation.model_notes.map((note) => (
                    <p key={note} className="rounded-lg bg-stroke/[0.04] px-3 py-2 text-sm text-ink/75">
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
