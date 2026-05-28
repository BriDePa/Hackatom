# IRRAFRESH

Inteligencia Logistica Post-Cosecha Impulsada por Irradiacion.

IRRAFRESH es un MVP de simulacion cientifica para explorar escenarios logisticos de productos agricolas irradiados. El sistema usa modelos matematicos simplificados y devuelve rangos, niveles de riesgo y recomendaciones visuales; no busca predicciones industriales exactas.

## Estructura

- `frontend/`: React + Vite + TailwindCSS + Recharts + Framer Motion + i18n.
- `backend/`: FastAPI + Pydantic + NumPy + Pandas.
- `backend/data/products.csv`: parametros editables para tomate y fresa.

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
  "dose": 1.2,
  "temperature": 8,
  "humidity": 82,
  "transport_hours": 36,
  "cold_chain_failure": false
}
```

La respuesta incluye riesgo, calidad restante en rango, vida util estimada, perdida estimada, recomendaciones, curva de calidad y comparacion irradiado/no irradiado.
