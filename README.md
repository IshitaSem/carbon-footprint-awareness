# 🌱 Sustainyapri — Carbon Footprint Awareness Platform

Sustainyapri is a privacy-first, fully browser-based carbon footprint calculator and sustainability insight platform built with Next.js 14, TypeScript, Tailwind CSS, and Recharts.

It helps users calculate their annual CO₂ emissions, compare them with global benchmarks, and receive actionable sustainability recommendations — all without any backend or data storage.

---

## 🚀 Features

### 🧮 Carbon Footprint Calculator
- Calculates yearly CO₂ emissions from:
  - Transport (car, public transport, flights)
  - Electricity usage
  - Diet type
  - Recycling habits
- Instant results stored in `sessionStorage`

### 📊 Dashboard
- Total carbon footprint (kg → tonnes)
- Breakdown by category: Transport, Electricity, Food, Waste
- Comparison with global average (4.7t CO₂/year) and sustainable target (2t CO₂/year)
- Visual charts: pie chart, bar chart, carbon gauge

### 💡 Insights Engine
- Personalised recommendations based on user profile
- Priority levels: High, Medium, Low
- Estimated CO₂ savings per action
- Category-based filtering (Transport, Food, Electricity, Waste, Lifestyle)

### 🌍 About & Awareness
- Science-based emission factors (IPCC, IEA, Our World in Data)
- Transparent calculation methodology
- Limitations clearly explained

---

## 🏗️ Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 14 (App Router) | Framework |
| TypeScript (strict mode) | Type safety |
| Tailwind CSS | Styling |
| Recharts | Data visualisation |
| Zod | Form validation |
| Lucide React | Icons |
| Vitest | Unit testing |
| sessionStorage | Client-only state |

---

## 📁 Project Structure

```
app/          → Pages (Home, Calculator, Dashboard, Insights, About)
components/   → UI primitives, charts, layout, calculator
lib/          → Calculation engine, constants, utilities
types/        → Shared TypeScript types
hooks/        → Custom React hooks
__tests__/    → Vitest test suites
```

---

## ⚙️ Setup

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Start production server

```bash
npm start
```

### Type check

```bash
npm run type-check
```

### Lint

```bash
npm run lint
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage
```

**Current coverage:** 99.53% statements · 91.07% branches · 100% functions

---

## 🧠 How It Works

### Emission Calculation Logic

| Category | Formula |
|----------|---------|
| Car | km/week × 52 × 0.21 kg CO₂/km |
| Public transport | km/week × 52 × 0.089 kg CO₂/km |
| Flights | trips/year × 255 kg CO₂ |
| Electricity | kWh/month × 12 × 0.475 kg CO₂/kWh |
| Food | Fixed by diet type (see below) |
| Waste | 500 kg base − recycling offset |

### Diet Emissions

| Diet | kg CO₂/year |
|------|------------|
| Vegan | 1,500 |
| Vegetarian | 1,700 |
| Mixed | 2,500 |
| High-meat | 3,300 |

### Carbon Rating System

| Rating | Range (kg/year) |
|--------|----------------|
| 🟢 Low | 0 – 2,000 |
| 🟡 Medium | 2,001 – 4,700 |
| 🟠 High | 4,701 – 8,000 |
| 🔴 Critical | 8,001+ |

---

## 🌍 Data Sources

- [IPCC](https://www.ipcc.ch/) — Assessment reports and climate science synthesis
- [IEA](https://www.iea.org/) — Energy system data, electricity, and transition analysis
- [Our World in Data](https://ourworldindata.org/co2-and-greenhouse-gas-emissions) — Accessible emissions data and research explainers
- [UK GHG Conversion Factors](https://www.gov.uk/government/collections/government-conversion-factors-for-company-reporting) — Detailed activity-based greenhouse gas conversion factors

---

## 🔐 Privacy

- No backend, no authentication, no database
- All data stored locally in `sessionStorage`
- No tracking or analytics
- Data is cleared when the browser tab is closed

---

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/calculator` | Carbon footprint calculator |
| `/dashboard` | Visual analytics and breakdown |
| `/insights` | Personalised recommendations engine |
| `/about` | Methodology and sources |

---

## 🚀 Deployment

Deployed on [Vercel](https://vercel.com). To deploy your own:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect the repository to Vercel via the dashboard for automatic deployments on push.

---

## ⚠️ Limitations

- Uses global average emission factors (not region-specific)
- Does not account for full lifecycle emissions (LCA)
- Does not include purchases, services, or investment-linked emissions
- Estimates are for awareness and planning, not audit-grade reporting

---

## 🌱 Future Improvements

- Country-specific emission factors
- Real-time grid carbon intensity
- User accounts and saved history
- PDF export reports
- Mobile app version

---

## 💚 Built With

Next.js 14 · TypeScript · Tailwind CSS · Recharts · Vitest

> *"You can't reduce what you don't measure."*
