# SATQUERY AI — Agentic Remote-Sensing Assistant

> **Tagline:** *"Ask. Analyze. Understand."*  
> **Domain:** NASA Space Apps / Advanced Remote-Sensing AI Web Application  
> **Status:** Production-Ready Full-Stack Prototype

---

## 1. Executive Summary & Design Philosophy

**SatQuery AI** is an agentic, query-driven remote-sensing assistant that enables experts and non-experts to analyze satellite imagery, perform multi-temporal change detection, process optical/multispectral/SAR imagery, continuously monitor areas of interest (AOIs), assess indicative groundwater potential, and learn Earth observation concepts via natural language interaction.

### Visual & Design Principles
- **Aesthetics:** Serious scientific geospatial product design. Restrained, human-crafted UI inspired by earth, forest, ocean, satellite imagery, and topographic maps.
- **Color Palette:**
  - **Primary Base:** Deep Navy (`#0B132B`, `#1C2541`) & Slate (`#3A506B`, `#475569`)
  - **Surface / Background:** Soft Scientific Light Gray (`#F4F6F9`, `#FFFFFF`)
  - **Accents:** Muted Forest Green (`#2D6A4F`), Muted Ocean Blue (`#014F86`), Warm Earth (`#D4A373`)
  - **Prohibitions:** ZERO fluorescent/neon colors, no cyberpunk styling, no excessive glassmorphism, no fake AI pulse animations, and no generic "AI SaaS" templates.
- **Header Strip:** Styled announcement strip featuring `<marquee>` with *"Welcome to SatQuery AI"*.

---

## 2. Key Modules & Technical Capabilities

1. **Ask SatQuery (Visual Question Answering & Text Grounding):** Natural language satellite interpretation powered by specialist model adapters.
2. **Land Cover Classification (BigEarthNet-19 Adaptation):** 19-class CORINE land-cover distribution charts, legends, and model cards.
3. **Bi-Temporal & Multi-Temporal Change Detection:** Side-by-side comparison, interactive swipe slider, difference highlight maps, and timeline date selectors (Jan 2026 vs Sep 2026).
4. **Optical + SAR Cross-Modal Analysis:** Demonstrates how Sentinel-1 C-band active microwave radar penetrates cloud cover to complement optical RGB imagery.
5. **Video Frame Analysis Pipeline:** Extracts keyframes from MP4 video streams and performs temporal keyframe analysis with explicit pipeline indicators.
6. **Radiometric Spectral Indices:** Computes NDVI (Vegetation), NDWI (Water), and NDBI (Built-up) formulas and pseudo-color rasters.
7. **Interactive GIS Map & Continuous Monitoring:** Leaflet interactive map with AOI drawing, location search, and user-configurable change threshold alerts (default 35%).
8. **Indicative Groundwater / Borewell Hydrogeology:** Surface infiltration candidate mapping with exact Lat/Long coordinates and explicit scientific safety disclaimers (*"Field hydrogeological verification required before drilling"*).
9. **Rocket Tracking Prototype:** Aerospace telemetry registry for tracking rockets (PSLV-C56, Falcon 9, Ariane 6) with status tags.
10. **Interactive Learning Hub & Prompt Playground:** 17-section remote sensing curriculum, real-time prompt quality evaluator (0-100% rating with specificity feedback), and interactive quiz.
11. **Multi-Language Architecture:** Supports English + all 22 official Eighth Schedule Indian Languages (Assamese, Bengali, Bodo, Dogri, Gujarati, Hindi, Kannada, Kashmiri, Konkani, Maithili, Malayalam, Manipuri, Marathi, Nepali, Odia, Punjabi, Sanskrit, Santali, Sindhi, Tamil, Telugu, Urdu).
12. **Printable PDF Audit Reports:** Instant generation of executive reports with query context, detected classes, and auditable execution steps.

---

## 3. Launch & Verification Instructions

### Start the Server (Node.js Full-Stack Web Server)

Run the following command in PowerShell / Terminal:

```bash
& "C:\Program Files\cursor\resources\app\resources\helpers\node.exe" server.js
```

Then open your browser at:
`http://localhost:3000`

---

## 4. Architecture & Monorepo Structure

```
SatQuery_AI/
│
├── server.js                         # Node.js Full-Stack Application Server (Port 3000)
├── frontend/
│   ├── public/
│   │   ├── index.html                # Single-Page React App with Tailwind, Leaflet, & Lucide Icons
│   │   └── samples/                  # High-Resolution Satellite Tiles (Optical, SAR, Change Mask, NDVI)
│   └── src/
│       └── i18n/
│           └── languages.js          # Multilingual Translation Engine (23 Languages)
├── backend/
│   ├── app/
│   │   ├── main.py                   # FastAPI REST API Backend
│   │   ├── agents/
│   │   │   └── agentic_controller.py # Intent Parser, Modality Inspector, & Task Router
│   │   ├── models_ai/
│   │   │   └── model_registry.py     # BigEarthNet & Specialist Model Cards
│   │   └── database/
│   │       └── db.py                 # SQLite ORM Database Connection
└── data/                             # SQLite Database & Sample Metadata Storage
```
