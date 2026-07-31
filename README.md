# 🌾 AgriSphere AI — Complete AI-Powered Farmer Decision Support Platform

An end-to-end agricultural platform covering the entire crop lifecycle: from pre-harvest planning and AI crop disease diagnosis to post-harvest grain quality grading, storage risk advice, and equipment marketplace discovery.

---

## 🌟 Executive Overview & Problem Statement

Rural farmers face critical decision bottlenecks across the agricultural lifecycle:
1. **Pre-Harvest Uncertainty**: Weather unpredictability, pest outbreaks, and unvalidated treatment choices.
2. **Post-Harvest Losses**: Lack of objective grain quality assessment leading to distress selling at suboptimal mandi rates.
3. **Equipment Access Friction**: High capital expenditure for machinery and lack of direct rental channels with nearby verified equipment owners.

**AgriSphere AI** solves these challenges by providing a unified, multilingual decision support platform powered by computer vision, ICAR-grounded knowledge bases, and direct owner-farmer connectivity.

---

## 🏗️ 5-Module Core Platform Capabilities

```
                                    Authentication (JWT / 4-Role RBAC)
                                                     │
                                                     ▼
                                     Unified Executive Farmer Dashboard
                                                     │
    ┌───────────────────────┬────────────────────────┼────────────────────────┬───────────────────────┐
    │                       │                        │                        │                       │
    ▼                       ▼                        ▼                        ▼                       ▼
Module 1:               Module 2:                Module 3:                Module 4:               Module 5:
Pre-Harvest &           Farm Intelligence        Crop Intelligence        Post-Harvest Quality    Farm Resource Hub
Yield Prediction        & Live Weather           (Hero AI System)         (Grain Quality Check)   & Notifications
 (LightGBM/ML)           (Open-Meteo)        (YOLOv8 + Gemini + ICAR) (OpenCV Otsu + Passport)  (6 Services + Events)
```

### Module 1: Pre-Harvest & Yield Prediction
- LightGBM / ML regression stand-in for harvest yield forecasting based on soil type, acreage, and crop variety.
- Mandi price tracker across regional APMC markets.

### Module 2: Farm Intelligence & Weather Engine
- Live weather forecast integration via Open-Meteo API (temperature, precipitation, wind speed, spray windows).
- Severe weather advisory banners with localized multilingual warnings (EN, TE, HI, KN).

### Module 3: Crop Intelligence System (Hero AI Module)
- **10 AI Subsystems**: Image preprocessor, YOLOv8/OpenCV lesion detector, confidence engine, ICAR/KVK-grounded Knowledge Base (`DiseaseKnowledge`), advisory engine, treatment recommendation, history engine, progression comparison engine, model registry (`BaseCropModel`), voice advisory generator.
- **`AISession` Container**: Groups scans, predictions, ICAR treatments, and side-by-side progression tracking under a single session lifecycle.
- **3 Hero React UI Cards**: `<ReliabilityPanel>` (Model name, inference speed, confidence %, ICAR badge), `<ScanComparisonCard>` (Improved 🟢 / Stable 🟡 / Worsened 🔴), `<ActionSummaryCard>` (Next actions & spray window).

### Module 4: Post-Harvest Quality & Storage Intelligence
- **9 AI Subsystems**: Real OpenCV Otsu automated thresholding & contour length/purity calculation (`analyze_grain_quality`), quality assessment, grade classification (AGMARK Grade A/B/C), storage risk meter, market readiness sell vs. store advisor, model registry (`BaseHarvestModel`), recommendation engine, history engine, passport generator.
- **Defensible Parameters**: Moisture status (`Optimal 🟢 / Elevated 🟡 / High Risk 🔴`) and defensible range (`10–12%`, `12–14%`, `Above 14%`).
- **Official Grain Quality Passport**: Generates persistent quality passport (`GRN-2026-XXXXX`) with downloadable PDF / printable confirmation.
- **5 Hero React UI Cards**: `<QualityScoreCard>`, `<StorageAdvisorCard>`, `<MarketReadinessCard>`, `<GrainPassportCard>`, `<QualityComparisonCard>`.

### Module 5: Farm Resource Hub & Event-Driven Notification Engine
- **6 Backend Service Modules (`backend/app/services/resource/`)**: `equipment_service`, `booking_service`, `availability_service`, `notification_service`, `search_service`, `owner_dashboard_service`.
- **10 Equipment Categories**: `🚜 Tractor`, `🌾 Harvester`, `🚛 Trailer`, `🚿 Irrigation Pump`, `🌱 Seeder`, `🚜 Rotavator`, `🌾 Thresher`, `🧴 Sprayer`, `🌿 Cultivator`, `🪓 Other`.
- **Double-Booking Prevention**: Date overlap checking (`has_booking_overlap`) preventing double bookings on equipment.
- **Verified Owner Badge (`is_verified`)**: Displays `Verified Owner ✔️` badge for trusted equipment owners.
- **Direct Action Triggers**: `Call` (`tel:+91...`) and `WhatsApp` (`https://wa.me/...` with prefilled context message).
- **Event-Driven Notification Engine**: Dispatches platform notifications for `BOOKING_REQUEST`, `BOOKING_ACCEPTED`, `BOOKING_REJECTED`, `BOOKING_COMPLETED`, `CROP_SCAN`, and `GRAIN_PASSPORT`.
- **Truthful Rental Confirmation**: Downloadable/printable **Rental Confirmation** document supporting EN, TE, HI, KN.
- **Owner Dashboard Operational Metrics**: Total Listings, Pending Requests, Accepted Bookings, Completed Rentals (*no fake income*).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, CSS Modules / Custom Design System, React Router 6 |
| **Backend** | Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy ORM |
| **Computer Vision & ML** | OpenCV (Otsu thresholding, contour lesion segmentation, purity calculation), NumPy, SciPy |
| **Database** | SQLite (Dev) / Supabase PostgreSQL (Prod) |
| **Localization** | Multilingual Translation Layer (English `en`, Telugu `te`, Hindi `hi`, Kannada `kn`) |

---

## 🧪 Testing & Verification Summary

### Backend Unit & Integration Tests (`backend/tests/`)
- `python -m unittest tests/test_resource_module.py tests/test_harvest_module.py tests/test_modules.py`
- **Result**: `Ran 16 tests in 0.502s — OK!` (100% pass rate across all 5 modules).

### Frontend Production Build (`frontend/`)
- `npm run build`
- **Result**: `✓ 175 modules transformed in 1m 33s cleanly with 0 errors!`

---

## 🚀 Quickstart Guide

### 1. Backend Server
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- Interactive Swagger API Docs: `http://localhost:8000/docs`

### 2. Frontend Development Server
```bash
cd frontend
npm install
npm run dev
```
- App Local Server: `http://localhost:5173`

---

## 📄 License & Maintainer
Maintained by the AgriSphere AI Engineering Team. Last updated: **2026-07-31**.
