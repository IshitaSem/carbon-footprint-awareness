# 🌱 CarbonWise — Carbon Footprint Awareness Platform

CarbonWise is a privacy-first, fully browser-based carbon footprint calculator and sustainability insight platform built with Next.js 14, TypeScript, Tailwind CSS, and Recharts.

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

---

### 📊 Dashboard
- Total carbon footprint (kg → tonnes)
- Breakdown by category:
  - Transport
  - Electricity
  - Food
  - Waste
- Comparison with:
  - Global average (4.7t CO₂/year)
  - Sustainable target (2t CO₂/year)
- Visual charts:
  - Pie chart (emission breakdown)
  - Bar chart (user vs average vs optimal)
  - Carbon gauge (progress indicator)

---

### 💡 Insights Engine
- Personalized recommendations based on user behavior
- Priority levels:
  - High
  - Medium
  - Low
- Estimated CO₂ savings per action
- Category-based filtering (Transport, Food, Electricity, Waste, Lifestyle)

---

### 🌍 About & Awareness
- Science-based emission factors (IPCC, IEA, Our World in Data)
- Transparent calculation methodology
- Limitations clearly explained

---

## 🏗️ Tech Stack

- Next.js 14 (App Router)
- TypeScript (strict mode)
- Tailwind CSS (custom earth/moss/carbon theme)
- Recharts (data visualization)
- Zod (form validation)
- Lucide React (icons)
- sessionStorage (client-only state)

---

## 📁 Project Structure


app/ → Pages (Home, Calculator, Dashboard, Insights, About)
components/ → UI components, charts, layout, calculator
lib/ → Carbon calculation engine & utilities
types/ → Strict TypeScript types


---

## ⚙️ Setup Instructions

### Install dependencies
```bash
npm install
Run development server
npm run dev
Build production version
npm run build
Start production server
npm run start
Type check
npm run type-check
🧠 How It Works
Emission Calculation Logic
Transport:
Car km × 0.21 kg CO₂/km
Public transport km × 0.089 kg CO₂/km
Flights × 255 kg CO₂
Electricity:
kWh × 0.475 kg CO₂
Food:
Based on diet type (vegan → high meat)
Waste:
Base 500 kg − recycling offset
🎯 Carbon Rating System
Rating	Range (kg/year)
Low	0 – 2000
Medium	2001 – 4700
High	4701 – 8000
Critical	8000+
🌍 Data Sources
IPCC (Intergovernmental Panel on Climate Change)
International Energy Agency (IEA)
Our World in Data
UK Government GHG Conversion Factors
🔐 Privacy
No backend
No authentication
No database
All data stored locally in sessionStorage
No tracking or analytics
📱 Pages
/ → Landing page
/calculator → Carbon footprint calculator
/dashboard → Visual analytics
/insights → Recommendations engine
/about → Methodology & sources
⚠️ Limitations
Uses global average emission factors
Does not account for regional electricity variations
Does not include full lifecycle emissions (LCA)
Estimates are for awareness, not audit-grade reporting
🌱 Future Improvements
Country-specific emission factors
Real-time grid carbon intensity
User accounts & saved history
PDF export reports
Gamification system
Mobile app version
💚 Built With

Next.js 14 • TypeScript • Tailwind CSS • Recharts

“You can’t reduce what you don’t measure.”
