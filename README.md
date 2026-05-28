# IRRAFRESH / PHASE

Inteligencia Logistica Post-Cosecha Impulsada por Irradiacion.

PHASE (Post-Harvest Analysis & Simulation Engine) es el motor de simulacion de IRRAFRESH para explorar escenarios logisticos post-cosecha de productos agricolas irradiados. El sistema usa modelos matematicos simplificados inspirados en literatura cientifica y devuelve rangos, niveles de riesgo y recomendaciones visuales; no busca predicciones industriales exactas.

Pitch tecnico:

> Plataforma de simulacion y soporte de decisiones para logistica post-cosecha de alimentos irradiados.

## Estructura

- `frontend/`: React + Vite + TailwindCSS + Recharts + Framer Motion + i18n.
- `backend/`: FastAPI + Pydantic + NumPy + Pandas.
- `backend/data/products.csv`: vista tabular editable de parametros.
- `backend/data/products.json`: parametros cientificos por alimento.
- `backend/data/routes.json`: perfiles logisticos abstractos y estres operativo.
- `IRRAFRESH_PROJECT_CONTEXT.txt`: contexto integral para otras IAs, personas y continuidad del proyecto.
- `docs/scientific-model.md`: modelo matematico, DSS, incertidumbre y referencias.
- `docs/pitch.md`: narrativa de demo para hackathon.

## Desarrollo

Backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
fastapi dev app/main.py
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Por defecto el frontend consume `http://127.0.0.1:8000`. Se puede cambiar con `VITE_API_URL`.

## API principal

`POST /simulate`

```json
{
  "product": "tomato",
  "route_id": "optimal_cold_chain",
  "dose": 1.2,
  "temperature": 8,
  "humidity": 82,
  "transport_hours": 36,
  "transport_type": "refrigerated_truck",
  "refrigerated_storage": true,
  "cold_chain_failure": false,
  "cold_chain_failure_hours": 6,
  "delay_hours": 0,
  "thermal_exposure_hours": 0,
  "extended_storage_hours": 0,
  "lot_value_usd": 2500
}
```

La respuesta incluye riesgo relativo, calidad restante en rango, vida util estimada, perdida estimada, impacto economico, estres logistico, reduccion microbiana relativa, recomendaciones, curva de calidad, bandas de incertidumbre y comparacion irradiado/no irradiado.
