# IRRAFRESH / PHASE Scientific Model

## Positioning

PHASE (Post-Harvest Analysis & Simulation Engine) is the scientific simulation engine of IRRAFRESH. It is a simulation and decision-support platform for post-harvest logistics of irradiated foods. It is not an exact predictor, certified food safety system, industrial AI, or physical nuclear simulator.

The MVP represents a simplified digital twin of an agricultural lot during transport. It combines irradiation dose, temperature, humidity, route stress, cold-chain events, deterioration kinetics, relative risk, uncertainty, and economic impact.

## Scientific Topics Covered

- Gamma irradiation of foods
- Post-harvest deterioration
- Shelf-life prediction
- Cold chain integrity
- Relative microbial reduction
- Plant respiration
- Environmental stress
- Logistics risk
- Transport delays
- Temperature-driven deterioration
- Humidity-driven deterioration
- Economic impact
- Scientific uncertainty
- Scenario simulation
- Decision Support Systems (DSS)

## Quality Index

`Q` is a simplified composite quality index. It represents:

- freshness,
- microbiological stability,
- commercial value,
- and post-harvest integrity.

It is intentionally not a laboratory measurement.

## Dynamic Deterioration Model

The base deterioration equation remains:

```text
Q(t) = Q0 * exp(-k(t) * t)
```

The coefficient is dynamic:

```text
k(t) = k0 + a*T + b*H - c*D + r*L
```

Where:

- `k0`: product base deterioration,
- `T`: temperature pressure,
- `H`: humidity pressure,
- `D`: gamma dose,
- `L`: logistics stress,
- `r`: product transport sensitivity.

Interpretation:

- higher temperature increases deterioration,
- higher humidity increases microbial deterioration pressure,
- higher irradiation lowers relative deterioration pressure,
- higher logistics stress increases deterioration.

Cold-chain failures temporarily increase `k(t)` for the configured event duration.

## Relative Risk Model

IRRAFRESH uses a relative risk pressure:

```text
R = w1*T + w2*t + w3*L - w4*D
```

The system only exposes categories and ranges:

- LOW,
- MEDIUM,
- HIGH.

It avoids false precision such as exact risk percentages.

## Economic Model

Estimated loss is:

```text
Loss = P * (1 - Q(t)/Q0)
```

Where `P` is the estimated lot value. The dashboard also compares irradiated vs non-irradiated scenarios to estimate potential avoided loss.

## Data Strategy

Product parameters live in internal CSV and JSON files. They are editable by developers, but not exposed as user controls:

- `backend/data/products.csv`
- `backend/data/products.json`

Abstract logistics profile parameters live in:

- `backend/data/routes.json`

The JSON files contain richer simulation parameters. The CSV file keeps a compact editable tabular view for hackathon demos.

## Validation Strategy

Parameters are literature-inspired and tuned for coherent relative trends, not industrial calibration. The intended claim is:

> scientifically inspired comparative simulation

The intended claim is not:

> exact shelf-life prediction

## References Used For Parameter Direction

- IAEA food irradiation guidance: https://www.iaea.org/topics/food-irradiation
- IAEA minimally processed fruit and vegetable irradiation report: https://www.iaea.org/publications/7629/use-of-irradiation-to-ensure-hygienic-quality-of-fresh-pre-cut-fruits-and-vegetables-and-other-minimally-processed-food-of-plant-origin
- WHO food irradiation publication record: https://iris.who.int/handle/10665/38544
- FDA food irradiation overview: https://www.fda.gov/food/buy-store-serve-safe-food/food-irradiation-what-you-need-know
- FAO post-harvest quality and safety guidance: https://www.fao.org/4/y5431e/y5431e04.htm
- FAO temperature and relative humidity control: https://www.fao.org/4/x5403e/x5403e08.htm
- FAO basic post-harvest handling: https://www.fao.org/4/y4358e/y4358e05.htm
