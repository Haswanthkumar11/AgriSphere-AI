# 🏛️ AgriSphere AI — Agentic AI Architecture & Hackathon Defense Guide

## Executive Summary
AgriSphere AI implements a production-grade **Agentic AI Architecture & Hybrid AI Pipeline** built on the software engineering principle of **Separation of Concerns**. Instead of expecting a single AI model to perform perception, localization, semantic reasoning, and environmental context evaluation, the platform uses **🌾 AgriSphere Companion** as a backend orchestrator that coordinates specialized tools and uses **Gemini 2.5 Flash** as its central reasoning engine.

1. **🌾 AgriSphere Companion**: Backend Agentic AI orchestrator (`POST /api/v1/companion/chat`).
2. **Tool Registry**: Specialized tool execution layer (`WeatherTool`, `MarketplaceTool`, `CropTool`, `ProfileTool`, `BookingTool`, `NavigationTool`, `GovernmentTool`, `ReportTool`).
3. **Context Builder Engine**: Assembles live application state (Farmer profile, Crop type, Weather telemetry, Scan history, Equipment listings, Bookings, Screen context).
4. **Gemini 2.5 Flash**: Acts as central reasoning engine for structured JSON response generation.
5. **OpenCV + YOLOv8**: Real-time image normalization, EXIF stripping, crop localization, and leaf boundary detection.
6. **Live Weather Telemetry**: Real-time OpenWeatherMap current metrics and 5-day forecast.
7. **Report Engine (`report_engine.py`)**: Official ICAR Diagnostic Certificates & AGMARK Grain Passports downloadable in PDF format.

---

## 1. AgriSphere Companion Lifecycle & System Architecture

```
                            Farmer
                               │
                               ▼
                    React + Material 3 UI
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
   Crop Scan             Voice Query           Weather Request
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               ▼
                   FastAPI API Gateway
                               │
                               ▼
                    🌾 AgriSphere Companion
                   (Agentic AI Orchestrator)
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
      Intent Router                         Tool Registry
  (Weather, Crop, Market,              ┌──────────┬──────────┐
   Profile, Navigation)                ▼          ▼          ▼
                                    Weather    Crop    Marketplace
                                       │          │          │
                                       └──────────┼──────────┘
                                                  ▼
                                       PostgreSQL + Live APIs
                                                  │
                                                  ▼
                                       Context Builder Engine
                                                  │
                                                  ▼
                                        Gemini 2.5 Flash
                                       (Reasoning Engine)
                                                  │
                                                  ▼
                                      Structured JSON Response
                                          │              │
                                          ▼              ▼
                                  Material UI Cards  Voice Audio
```

---

## 2. AgriSphere Companion 8-Step Lifecycle

```
1. Farmer Speaks / Types
          │
          ▼
2. Intent Understood (Weather / Crop Scan / Marketplace / Navigation)
          │
          ▼
3. Required Tools Selected (ToolRegistry Dispatch)
          │
          ▼
4. Live Context Retrieved (PostgreSQL SQL + OpenWeatherMap Telemetry)
          │
          ▼
5. Gemini 2.5 Flash Reasons (Multimodal Grounded Prompt)
          │
          ▼
6. Structured Advice Generated (JSON Envelope with Actions & Ticks)
          │
          ▼
7. Voice Response Output (Text-to-Speech Audio Synthesis)
          │
          ▼
8. History Saved & Report Generated (SQL Persistence & PDF Export)
```

---

## 3. Hackathon Judge Q&A Defense Script

### Q1: "Why didn't you just use Gemini directly?"
> **Answer**:  
> *"Gemini is not our application; it is strictly our central reasoning engine. We built an Agentic AI Orchestrator backend that first determines the farmer's intent, gathers live context from specialized application tools—such as live weather telemetry, crop disease history, equipment marketplace listings, and farmer profile records—and then constructs a structured prompt for Gemini. The response is converted into a standardized JSON envelope that drives Material 3 UI cards, multilingual voice playback, and downloadable PDF reports."*

### Q2: "Why are you using YOLO alongside Gemini?"
> **Answer**:  
> *"YOLO is responsible for low-latency visual localization and crop identification. We intentionally separate object detection from agricultural reasoning. YOLO identifies and localizes the leaf boundary in real time, while Gemini Vision performs higher-level multimodal analysis like disease diagnosis and severity classification. This modular separation makes the pipeline faster and more reliable."*

### Q3: "How do you prevent AI hallucinations?"
> **Answer**:  
> *"We eliminate hallucinations by grounding Gemini in structured application state instead of relying on an image or raw text prompt alone. Before Gemini receives the request, our Context Builder feeds it the localized crop region from YOLO, the farmer's verified crop profile, recent scan history, and live OpenWeatherMap weather telemetry. Grounding the prompt in real application data keeps recommendations precise and trustworthy."*

### Q4: "Is your weather data live or fabricated?"
> **Answer**:  
> *"Our weather service connects directly to the OpenWeatherMap API in real time. It fetches live temperature, humidity, wind speed, pressure, and rain probabilities, cached on a 10-minute TTL per city. If the external weather service becomes unavailable, the system transparently indicates offline status rather than showing fabricated data."*

### Q5: "How does the Companion perform actions?"
> **Answer**:  
> *"The Companion returns structured action payloads within its JSON response. When a farmer says 'Scan my crop' or 'Check weather', the backend NavigationTool includes target route actions (`/scan`, `/weather`, `/equipment`). The React frontend inspects these actions and automatically navigates the user or opens the camera view, making the Companion an active agent rather than a passive Q&A chatbot."*
