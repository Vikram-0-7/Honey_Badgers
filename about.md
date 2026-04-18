# Civix-Pulse — Agentic Governance & Grievance Resolution Swarm

## 🏗️ Project Overview

**Civix-Pulse** is an AI-powered civic grievance resolution platform that autonomously detects, classifies, prioritizes, and resolves citizen complaints using a multi-agent swarm pipeline. Built for the city of Hyderabad, it processes complaints from multiple channels (web portal, WhatsApp, voice calls, image OCR, Twitter) and routes them through an intelligent 4-agent pipeline that classifies issues, detects systemic patterns, assigns field officers, and monitors SLA compliance.

**Team:** Honey Badgers  
**Stack:** Next.js 16 (Frontend) + FastAPI (Backend Agent Service) + Supabase (Database & Auth) + Groq LLaMA-3 (LLM) + Gemini (Image Analysis)

---

## 📐 Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        CITIZEN / USER                           │
│         (Web Portal · WhatsApp · Voice · Image · Twitter)       │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                   NEXT.JS FRONTEND (civixpulse/)                │
│                                                                  │
│   Landing Page ──► Login/Signup ──► Citizen Dashboard            │
│                                   ──► Submit Complaint           │
│                                   ──► Track Complaint            │
│                                   ──► Verify Resolution          │
│                                                                  │
│   Admin Dashboard ──► Clusters ──► Officers ──► Analytics        │
│   Officer Portal  ──► Tasks ──► Map View ──► Leaderboard         │
│                                                                  │
│   API Routes: /api/launch-agent  /api/complaints  /api/profile   │
└───────────────────────────┬──────────────────────────────────────┘
                            │  HTTP (JSON)
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│                FASTAPI AGENT SERVICE (agent-service/)            │
│                                                                  │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐    │
│   │ Ingestion│──►│ Priority │──►│ Auditor  │──►│ Resolver │    │
│   │  Agent   │   │  Agent   │   │  Agent   │   │  Agent   │    │
│   └──────────┘   └──────────┘   └──────────┘   └──────────┘    │
│         │              │              │              │            │
│         ▼              ▼              ▼              ▼            │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              PHASE 4: CITY INTELLIGENCE                  │   │
│   │  Predictions · Predictive Alerts · Cross-Dept            │   │
│   │  Correlations · City Health Score · Score Decay           │   │
│   └─────────────────────────────────────────────────────────┘   │
└───────────────────────────┬──────────────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
     ┌────────────────┐          ┌────────────────┐
     │   Groq LLaMA-3 │          │    Supabase    │
     │  (Classification│          │ (DB + Auth +   │
     │   & Root Cause) │          │    Storage)    │
     └────────────────┘          └────────────────┘
```

---

## 📁 Project Structure

```
Honey_Badgers/
├── agent-service/              # Python FastAPI backend (AI pipeline)
│   ├── main.py                 # FastAPI entry point + all endpoints
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # GROQ_API_KEY
│   ├── agents/                 # 4 sequential AI agents
│   │   ├── __init__.py         # Agent exports
│   │   ├── ingestion_agent.py  # Agent 1: Multimodal ingestion
│   │   ├── priority_agent.py   # Agent 2: Classification & priority scoring
│   │   ├── auditor_agent.py    # Agent 3: Cluster detection & root cause
│   │   └── resolver_agent.py   # Agent 4: Officer assignment & SLA
│   ├── models/
│   │   └── complaint.py        # All Pydantic data models
│   └── services/
│       ├── pipeline.py         # Pipeline orchestrator + intelligence
│       ├── llm_service.py      # Groq LLaMA-3 API integration
│       ├── mock_data.py        # Mock complaints & officers generator
│       └── score_decay.py      # Impact score decay cron logic
│
├── civixpulse/                 # Next.js 16 frontend
│   ├── app/
│   │   ├── layout.tsx          # Root layout (Inter font, global CSS)
│   │   ├── page.tsx            # Landing page (Hero + Services + Process)
│   │   ├── globals.css         # Global styles + Tailwind config
│   │   ├── login/              # Login page
│   │   ├── signup/             # Signup page
│   │   ├── update-password/    # Password reset page
│   │   ├── (citizen)/          # Citizen route group
│   │   │   ├── layout.tsx      # Citizen layout (Navbar only)
│   │   │   ├── dashboard/page.tsx  # Citizen dashboard
│   │   │   ├── portal/
│   │   │   │   ├── submit/page.tsx  # Submit complaint (form/image/audio)
│   │   │   │   ├── track/[id]/page.tsx  # Track complaint status
│   │   │   │   └── verify/[id]/page.tsx # Verify resolution
│   │   │   └── profile/        # Citizen profile
│   │   ├── admin/              # Admin route group
│   │   │   ├── layout.tsx      # Admin layout (Navbar + Sidebar)
│   │   │   ├── dashboard/page.tsx  # Admin command center
│   │   │   ├── clusters/       # Cluster analysis view
│   │   │   ├── officers/       # Officer management
│   │   │   └── analytics/      # Analytics dashboard
│   │   ├── officer/            # Officer route group
│   │   │   ├── layout.tsx      # Officer layout (Navbar + Sidebar)
│   │   │   ├── tasks/page.tsx  # Task list view
│   │   │   ├── tasks/[id]/page.tsx  # Task detail + resolution
│   │   │   ├── map/            # Map view
│   │   │   └── leaderboard/    # Officer leaderboard
│   │   └── api/                # Next.js API routes
│   │       ├── launch-agent/route.ts    # Trigger FastAPI pipeline
│   │       ├── complaints/route.ts      # Submit complaint + OCR/audio
│   │       ├── complaints/[id]/route.ts # GET/PATCH single complaint
│   │       ├── complaints/user/route.ts # GET user's complaints
│   │       ├── create-officer/          # Create officer
│   │       └── profile/                 # Profile API
│   ├── components/
│   │   ├── Navbar.tsx          # Global navigation bar
│   │   ├── Hero.tsx            # Landing page hero section
│   │   ├── Services.tsx        # Swarm capabilities grid
│   │   ├── Process.tsx         # 3-step process visualization
│   │   ├── FeatureHighlight.tsx # Feature highlight section
│   │   ├── Footer.tsx          # Global footer
│   │   ├── LoginForm.tsx       # Login form component
│   │   ├── SignupForm.tsx      # Signup form component
│   │   ├── LogoutButton.tsx    # Logout button
│   │   ├── MapPicker.tsx       # Leaflet map for location selection
│   │   ├── ComplaintMap.tsx    # Leaflet map for complaint display
│   │   ├── DynamicComplaintMap.tsx  # Dynamic import wrapper for SSR
│   │   └── ui/                 # Reusable UI primitives
│   │       ├── Card.tsx        # Card container
│   │       ├── StatCard.tsx    # Stat display card
│   │       ├── StatusBadge.tsx # Status indicator badge
│   │       ├── PageHeader.tsx  # Page title + subtitle
│   │       ├── Sidebar.tsx     # Navigation sidebar
│   │       ├── Timeline.tsx    # Event timeline
│   │       ├── Table.tsx       # Data table
│   │       ├── Tabs.tsx        # Tab navigation
│   │       ├── Modal.tsx       # Modal dialog
│   │       └── MapPlaceholder.tsx  # Placeholder for map
│   ├── libs/
│   │   ├── supabase/
│   │   │   ├── client.ts       # Browser-side Supabase client
│   │   │   ├── server.ts       # Server-side Supabase client (SSR)
│   │   │   └── proxy.ts        # Supabase middleware proxy
│   │   ├── supabase.ts         # Legacy Supabase client
│   │   ├── supabase-server.ts  # Legacy server client
│   │   ├── gemini.ts           # Gemini API client
│   │   └── ai/
│   │       ├── extract.ts      # Gemini multimodal extraction
│   │       ├── ocr.ts          # Tesseract.js OCR for images
│   │       └── whisper.ts      # Groq Whisper audio transcription
│   └── package.json            # Node.js dependencies
│
└── Readme.md                   # Git workflow notes
```

---

## 🔧 Backend — Agent Service (FastAPI)

### Entry Point: `main.py`

The FastAPI application that exposes all REST endpoints and manages the in-memory pipeline result store.

| Function/Endpoint | Method | Description |
|---|---|---|
| `root()` | `GET /` | Health check — returns service status, version, timestamp |
| `execute_pipeline()` | `GET /run-pipeline` | Runs the full 4-agent pipeline on all mock data, returns `PipelineResult` |
| `analyze_complaint()` | `POST /agent/analyze` | Accepts a single complaint JSON, appends to mock data, runs full pipeline |
| `get_pipeline_status()` | `GET /agent/status/{run_id}` | Retrieves a previous pipeline run by its UUID |
| `list_mock_complaints()` | `GET /complaints` | Lists all raw mock complaints (unprocessed) |
| `list_mock_officers()` | `GET /officers` | Lists all mock field officers |
| `get_dashboard_stats()` | `GET /dashboard/stats` | Returns stat card data from the most recent pipeline run |
| `trigger_score_decay()` | `POST /cron/score-decay` | Manually triggers impact score decay cycle on all stored pipeline runs |
| `score_decay_status()` | `GET /cron/score-decay/status` | Returns count and severity distribution of unresolved complaints |
| `score_decay_scheduler()` | Background | Async task that auto-runs score decay every 30 minutes |
| `startup_event()` | Startup | Launches the background scheduler when server boots |

**Request Models:**
- `ComplaintSubmission` — Schema for submitting complaints (text, location, lat/lng, source, citizen_id)
- `HealthResponse` — Health check response schema

**In-Memory Store:**
- `pipeline_runs: dict[str, PipelineResult]` — Stores all pipeline run results keyed by UUID. Used by score decay, dashboard stats, and status retrieval.

---

### Agent 1: Ingestion Agent (`agents/ingestion_agent.py`)

**Role:** Continuously monitors all input channels, normalizes complaint data into a standard schema.

| Method | Description |
|---|---|
| `process(complaint)` | Takes a raw `Complaint`, normalizes its text (strips whitespace), stamps it with an `ingested_at` timestamp, records source channel metadata in `agent_notes["ingestion"]`, and returns the enriched complaint |

**Fields populated:** `normalized_text`, `ingested_at`, `reason`, `agent_notes["ingestion"]`

---

### Agent 2: Priority Agent (`agents/priority_agent.py`)

**Role:** Classifies each complaint by category and computes a dynamic priority score using the Impact Matrix formula.

**Priority Score Formula:**
```
Score = (Severity Weight × Zone Multiplier × Affected Population) / (1 + Hours_Since_Submission × 0.1)
```

| Constant | Values |
|---|---|
| Severity Weights | P1=100, P2=70, P3=40, P4=10 |
| Zone Multipliers | school/hospital=3.0, commercial=2.5, residential=2.0, park=1.0 |
| SLA Hours | P1=2h, P2=8h, P3=24h, P4=72h |

| Method | Description |
|---|---|
| `process(complaint)` | Main processing — calls LLM for classification, falls back to keyword matching if LLM fails. Detects zone type, assigns severity, computes priority score, sets SLA deadline |
| `_classify_category(text)` | Keyword-based fallback: matches text against `CATEGORY_KEYWORDS` dict (Water, Roads, Electricity, Sanitation, Safety) |
| `_detect_zone(text, location)` | Detects zone type (school/hospital/commercial/residential/park) from text and location keywords |
| `_assign_severity(text)` | Assigns severity (P1-P4) based on critical keyword lists (`P1_CRITICAL_KEYWORDS`, `P2_HIGH_KEYWORDS`, `HIGH_DISTRESS_KEYWORDS`) |
| `_compute_priority_score(complaint)` | Applies the Impact Matrix formula using severity weight and zone multiplier |

**LLM Integration:** Sends a structured prompt to Groq LLaMA-3 asking for `{category, severity, reason}` as JSON. If the LLM fails, uses the keyword-based fallback logic.

**Fields populated:** `category`, `severity`, `zone_type`, `priority_score`, `sla_deadline_hours`, `status` (→ CLASSIFIED), `sentiment`, `reason`, `agent_notes["priority"]`

---

### Agent 3: Auditor Agent (`agents/auditor_agent.py`)

**Role:** Performs cluster analysis across all complaints to detect systemic infrastructure failures.

**Clustering Logic:**
1. Group complaints by category
2. Within each category, sub-group by geographic proximity using Haversine distance (≤ 5km)
3. If a sub-group has ≥ 3 complaints (`CLUSTER_THRESHOLD`), create a `Cluster`
4. Infer root cause via LLM (falls back to `ROOT_CAUSE_TEMPLATES`)

| Method | Description |
|---|---|
| `process(complaints)` | Main method — takes all classified complaints, returns list of `Cluster` objects. Groups by category, then by geographic proximity, infers root causes |
| `_geo_cluster(complaints)` | Proximity-based clustering using Haversine distance. Groups complaints within `MAX_DISTANCE_KM` (5km) of each other |
| `_haversine(lat1, lon1, lat2, lon2)` | Static method — calculates great-circle distance between two GPS coordinates in km |

**LLM Integration:** For each detected cluster, sends complaint texts to Groq LLaMA-3 asking for `{root_cause, insight, confidence}`. Falls back to `ROOT_CAUSE_TEMPLATES` and `RECOMMENDED_ACTIONS` dictionaries.

**Fields populated:** `cluster_id` on constituent complaints. Creates `Cluster` objects with `root_cause`, `insight`, `predicted_issue`, `confidence`, `recommended_action`, `severity_escalated`.

---

### Agent 4: Resolver Agent (`agents/resolver_agent.py`)

**Role:** Assigns complaints to available field officers based on department match and tracks SLA deadlines.

| Method | Description |
|---|---|
| `process(complaint)` | Assigns a single complaint to its matching department officer, sets SLA deadline, updates status to ASSIGNED, computes SLA breach status |
| `process_batch(complaints)` | Batch processes all complaints, generates officer workload summary |

**Officer Mapping:**
| Department | Officer | ID |
|---|---|---|
| Water | Ravi Kumar | officer-water-001 |
| Roads | Priya Sharma | officer-roads-002 |
| Electricity | Suresh Reddy | officer-electricity-003 |
| Sanitation | Anjali Deshmukh | officer-sanitation-004 |
| Safety | Vikram Singh | officer-safety-005 |

**Fields populated:** `officer_id`, `officer_name`, `department`, `sla_deadline_hours`, `status` (→ ASSIGNED), `assigned_at`, `sla_status`, `reason`, `agent_notes["resolver"]`

---

### Pipeline Orchestrator (`services/pipeline.py`)

**Role:** The core engine that ties all 4 agents together and generates city-level intelligence.

**Pipeline Phases:**

| Phase | Description | Agent/Function |
|---|---|---|
| Phase 1 | Ingestion + Classification | `IngestionAgent.process()` → `PriorityAgent.process()` (per complaint) |
| Phase 2 | Systemic Cluster Analysis | `AuditorAgent.process()` (batch) |
| Phase 3 | Officer Assignment | `ResolverAgent.process_batch()` (batch) |
| Phase 4 | City Intelligence | `generate_predictions()`, `generate_predictive_alerts()`, `detect_cross_dept_correlations()`, `calculate_city_health()` |

**City Intelligence Functions:**

| Function | Description |
|---|---|
| `generate_predictions(complaints)` | Simple count-based prediction — if a category has ≥3 complaints, flags it as "rising" |
| `generate_predictive_alerts(complaints, clusters)` | **Velocity-based 24-48hr failure prediction.** Groups by category, computes weighted velocity (P1=3×, P2=2×, P3=1×, P4=0.5×), triggers alerts at velocity ≥2.0/hr (24hr), ≥1.0/hr (48hr), or ≥0.5/hr with P1 (24hr) |
| `detect_cross_dept_correlations(complaints)` | **Cross-department correlation detector.** Groups complaints by proximity (Haversine ≤2km), identifies locations with 2+ categories, matches against 6 predefined patterns (e.g., Water+Electricity → construction_damage). Uses pair-wise analysis |
| `calculate_city_health(complaints, clusters)` | Computes city health score: `100 - (P1_count × 10 + cluster_count × 5)`. Status: >80=Healthy, ≥50=Moderate Risk, <50=Critical |

**Cross-Department Correlation Patterns:**

| Pair | Type | Root Cause |
|---|---|---|
| Water + Electricity | `construction_damage` | Underground excavation damaged both pipes and conduits |
| Water + Roads | `shared_infrastructure` | Pipeline damage causing road surface collapse |
| Electricity + Safety | `cascading_failure` | Downed wires creating public safety hazard |
| Sanitation + Water | `shared_infrastructure` | Blocked drains contaminating water supply |
| Roads + Safety | `cascading_failure` | Potholes creating accident-prone zones |
| Sanitation + Safety | `cascading_failure` | Waste accumulation creating health hazards |

---

### Impact Score Decay (`services/score_decay.py`)

**Role:** Automatically escalates unresolved complaints over time so nothing falls through the cracks.

**Decay Formula:** `new_score = base_score × (1 + age_hours × 0.05)` — capped at 5× original.

**Severity Escalation Thresholds:**

| Original | Escalates To | After |
|---|---|---|
| P4 | P3 | 24 hours |
| P3 | P2 | 48 hours |
| P2 | P1 | 72 hours |

| Function | Description |
|---|---|
| `calculate_age_hours(complaint)` | Computes how many hours old a complaint is based on `created_at` |
| `apply_score_decay(complaints)` | Core logic — iterates unresolved complaints, applies score formula, checks escalation thresholds, records in `agent_notes["score_decay"]`. Returns summary dict |
| `run_decay_cycle(pipeline_runs)` | Standalone entry point — loops through all stored pipeline runs and applies decay to each. Designed to be called from API or scheduler |

**Tracked Statuses:** `pending`, `classified`, `assigned`, `in_progress` (resolved/verified_closed are skipped)

---

### LLM Service (`services/llm_service.py`)

**Role:** Interface to the Groq API for LLaMA-3.3-70b-versatile model calls.

| Function | Description |
|---|---|
| `analyze_with_llm(prompt)` | Sends a prompt to Groq API, expects JSON response. Uses `temperature=0.2` and `response_format: json_object`. Returns parsed dict or empty dict on failure. Graceful fallback if `GROQ_API_KEY` is missing |

**Config:** Model `llama-3.3-70b-versatile`, timeout 15s, temperature 0.2

---

### Mock Data Generator (`services/mock_data.py`)

**Role:** Generates realistic Hyderabad-based complaint and officer data for testing.

| Function | Description |
|---|---|
| `generate_mock_complaints()` | Returns 10 `Complaint` objects across Kukatpally (Water+Electricity), Gachibowli (Roads+Electricity+Safety), and Ameerpet (Sanitation). Designed to trigger clusters, predictions, and cross-dept correlations |
| `generate_mock_officers()` | Returns 5 `Officer` objects, one per department (Water, Roads, Electricity, Sanitation, Safety) |

---

### Data Models (`models/complaint.py`)

All data is modeled with Pydantic v2 `BaseModel` for automatic validation and JSON serialization.

| Model | Fields | Purpose |
|---|---|---|
| `Complaint` | id, text, location, lat/lng, source, citizen_id, normalized_text, ingested_at, category, priority_score, severity, zone_type, cluster_id, officer_id, officer_name, department, sla_deadline_hours, status, sentiment, assigned_at, sla_status, reason, created_at, updated_at, verification_photo_url, verification_status, verification_feedback, agent_notes | Core entity enriched through 4-agent pipeline |
| `Cluster` | cluster_id, category, root_cause, complaint_ids, count, affected_area, recommended_action, insight, predicted_issue, confidence, reason, severity_escalated, status, created_at | Group of related complaints |
| `Officer` | id, name, department, phone, status, current_task_id, completed_tasks, avg_resolution_time_hrs | Field officer entity |
| `Alert` | type, message, severity, area, complaint_id, cluster_id | Real-time alert (CRITICAL_ALERT, CLUSTER_ALERT, PREDICTIVE_ALERT) |
| `Prediction` | category, prediction, trend, confidence | Simple count-based trend prediction |
| `PredictiveAlert` | category, predicted_failure, time_horizon_hours, confidence, velocity_score, trigger_reason, affected_area, severity_weight | Velocity-based 24-48hr failure prediction |
| `Correlation` | location, correlation, departments, reason, correlation_type, confidence, likely_root_cause, recommended_joint_action | Cross-department correlation detection |
| `CityHealth` | score, status | City health score (0-100) |
| `TopRiskArea` | area, reason | Highest-risk geographic area |
| `MostAffectedCategory` | category, count | Most complaint-heavy category |
| `SystemSummary` | total_complaints, critical_issues, clusters, top_risk_area, city_health_score | Overall system summary |
| `PipelineResult` | message, pipeline_run_id, total_complaints, total_clusters, complaints, clusters, alerts, predictions, predictive_alerts, correlations, city_health, top_risk_area, most_affected_category, system_summary, officer_assignments, execution_log | Complete pipeline output |
| `SeverityLevel` | P1, P2, P3, P4 | Enum — P1 is most critical |
| `ComplaintStatus` | pending, classified, assigned, in_progress, resolved, verified_closed | Lifecycle enum |
| `ComplaintSource` | portal, whatsapp, voice, ocr, twitter | Input channel enum |
| `ComplaintSubmission` | text, location, latitude, longitude, source, citizen_id | API request model (in main.py) |

---

## 🖥️ Frontend — Civix-Pulse (Next.js 16)

### Technology Stack
- **Framework:** Next.js 16 with App Router
- **Styling:** Tailwind CSS v4
- **Auth & DB:** Supabase (SSR via `@supabase/ssr`)
- **Maps:** Leaflet + react-leaflet
- **Icons:** lucide-react
- **AI/ML Clients:** Google Generative AI (Gemini), Tesseract.js (OCR), OpenAI SDK (Groq Whisper)
- **Email:** Resend

### Design System
- Brutalist/minimalist aesthetic — black-and-white with sharp borders
- Typography: Inter font, uppercase bold headings, wide tracking
- All interactive elements use `hover:bg-black hover:text-white` transitions

---

### Pages

#### Landing Page (`app/page.tsx`)
Renders the public-facing homepage with 4 sections: `Navbar` → `Hero` → `Services` → `Process` → `FeatureHighlight` → `Footer`.

#### Login (`app/login/`)
Renders `LoginForm` component with Supabase email/password authentication. Supports role selection (Citizen/Officer/Admin — currently commented out). Includes password reset via `supabase.auth.resetPasswordForEmail()`.

#### Signup (`app/signup/`)
Renders `SignupForm` component for new user registration via Supabase.

#### Citizen Dashboard (`app/(citizen)/dashboard/page.tsx`)
- **Client component** — fetches user's complaints from `/api/complaints/user`
- Displays stat cards (Total Reports, Pending, Resolved)
- Lists recent complaints with status badges and links to track pages
- Notification feed with "Verify Now" links for resolved complaints

#### Submit Complaint (`app/(citizen)/portal/submit/page.tsx`)
- **3 input modes:** Text form, Image (with OCR), Audio (with Whisper)
- **Location picker:** Leaflet map with geolocation auto-detect
- **Processing flow:**
  1. If image/audio mode: uploads file to `/api/complaints` for OCR/transcription
  2. Shows animated status messages (Analyzing → Detecting clusters → Generating insights)
  3. Calls `/api/launch-agent` which triggers FastAPI pipeline
  4. Saves all pipeline results to Supabase (pipeline_runs, complaints, officer_assignments, system_summary, execution_logs)
  5. Redirects to tracking page

#### Track Complaint (`app/(citizen)/portal/track/[id]/page.tsx`)
- **Server component** — fetches complaint, officer assignment, and cluster data from Supabase
- Displays resolution timeline (Submitted → Cluster Identified → Officer Assigned → SLA Deadline)
- Shows cluster info (category, root cause, confidence)
- Shows officer details (name, department, severity, SLA hours)
- Renders complaint location on Leaflet map

#### Verify Resolution (`app/(citizen)/portal/verify/[id]/page.tsx`)
- **Client component** — allows citizen to confirm or reopen a resolved complaint
- Calls `PATCH /api/complaints/{id}` to update status

#### Admin Dashboard (`app/admin/dashboard/page.tsx`)
- Displays stat cards (Active Incidents, Auto-Resolved %, Avg Resolution, Critical P1)
- Predictive Heatmap placeholder
- Agent Action Feed showing recent automated actions

#### Officer Tasks (`app/officer/tasks/page.tsx`)
- Lists active tasks with priority badges, SLA timers, and filter tabs
- Each task links to detail view

#### Officer Task Detail (`app/officer/tasks/[id]/page.tsx`)
- Issue description with image thumbnails
- Resolution action form (textarea + status dropdown + submit)
- Live SLA countdown timer
- Event log timeline

---

### Components

| Component | File | Description |
|---|---|---|
| `Navbar` | `components/Navbar.tsx` | Server component — sticky top nav with logo, search bar ("Hyderabad Control Node"), and auth-aware user actions. Shows email + logout when authenticated |
| `Hero` | `components/Hero.tsx` | Server component — main landing hero with tagline, CTA buttons, and abstract geometric visualization |
| `Services` | `components/Services.tsx` | 6-card grid showing swarm capabilities (Multimodal Ingestion, Priority Intelligence, Systemic Auditor, Autonomous Dispatch, Citizen Feedback Loop, Cross-Department Sync) |
| `Process` | `components/Process.tsx` | 3-step process visualization (Report → Analyze → Resolve) with connecting lines |
| `FeatureHighlight` | `components/FeatureHighlight.tsx` | Feature highlight section |
| `Footer` | `components/Footer.tsx` | Global footer |
| `LoginForm` | `components/LoginForm.tsx` | Client component — email/password form with Supabase auth, password reset, role selection |
| `SignupForm` | `components/SignupForm.tsx` | Client component — registration form |
| `LogoutButton` | `components/LogoutButton.tsx` | Client component — handles sign out |
| `MapPicker` | `components/MapPicker.tsx` | Client component — Leaflet map with click-to-place marker and GPS auto-detect |
| `ComplaintMap` | `components/ComplaintMap.tsx` | Client component — displays a single complaint location marker on Leaflet |
| `DynamicComplaintMap` | `components/DynamicComplaintMap.tsx` | SSR-safe dynamic import wrapper for ComplaintMap |

**UI Primitives (`components/ui/`):**

| Component | File | Description |
|---|---|---|
| `Card` | `ui/Card.tsx` | Simple bordered container — `border border-black/10 bg-white p-6` |
| `StatCard` | `ui/StatCard.tsx` | Metric card with title (10px uppercase), large value (4xl font), and optional subtitle |
| `StatusBadge` | `ui/StatusBadge.tsx` | Inline status pill — supports `Pending` (yellow), `Assigned` (blue), `Resolved` (green), `P1-P4` (red→gray gradient) |
| `PageHeader` | `ui/PageHeader.tsx` | Page title (3xl bold uppercase) with optional subtitle, bottom border |
| `Sidebar` | `ui/Sidebar.tsx` | 256px navigation sidebar with title and link list, hover-to-black transition |
| `Timeline` | `ui/Timeline.tsx` | Vertical timeline with dots and event cards (title, date, optional description) |
| `Table` | `ui/Table.tsx` | Data table component |
| `Tabs` | `ui/Tabs.tsx` | Tab navigation |
| `Modal` | `ui/Modal.tsx` | Modal dialog |
| `MapPlaceholder` | `ui/MapPlaceholder.tsx` | Placeholder rectangle for map areas |

---

### API Routes

| Route | Method | Description |
|---|---|---|
| `/api/launch-agent` | POST | **Core integration point** — receives complaint JSON, calls FastAPI `/agent/analyze`, sends acknowledgment email via Resend (with complaint ID, category, severity, officer, SLA), also triggers `/run-pipeline`, returns combined response |
| `/api/complaints` | POST | **Multimodal complaint handler** — accepts FormData with mode (form/image/audio), extracts text via Tesseract OCR or Groq Whisper, saves initial complaint to Supabase |
| `/api/complaints/[id]` | GET | Fetch a single complaint by ID from Supabase |
| `/api/complaints/[id]` | PATCH | Update complaint status (for verification/reopening) |
| `/api/complaints/user` | GET | Fetch all complaints for the authenticated user, ordered by created_at desc |

---

### Libraries

#### Supabase Integration (`libs/supabase/`)

| File | Export | Description |
|---|---|---|
| `client.ts` | `createClient()` | Browser-side Supabase client using `createBrowserClient()` from `@supabase/ssr` |
| `server.ts` | `createClient()` | Server-side Supabase client using `createServerClient()` with cookie-based session via `next/headers` |
| `proxy.ts` | Middleware proxy | Supabase middleware for session refresh |

#### AI Libraries (`libs/ai/`)

| File | Export | Description |
|---|---|---|
| `extract.ts` | `extractFromFile(file)` | Uses Google Gemini 2.0 Flash to analyze uploaded images/files and extract complaint descriptions via multimodal prompting |
| `ocr.ts` | `extractImageText(file)` | Uses Tesseract.js for local OCR — converts image buffer to text. Used as fallback/alternative to Gemini |
| `whisper.ts` | `extractAudioText(file)` | Uses Groq's Whisper Large V3 Turbo model to transcribe audio complaints to text |

---

## 🔐 Environment Variables

### agent-service/.env
| Variable | Description |
|---|---|
| `GROQ_API_KEY` | API key for Groq LLaMA-3 and Whisper models |

### civixpulse/.env
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key |
| `GEMINI_API_KEY` | Google Gemini API key for multimodal extraction |
| `RESEND_API_KEY` | Resend API key for transactional emails |

---

## 🗄️ Supabase Tables

Based on the code's insert/query patterns, the database schema includes:

| Table | Key Columns | Written By |
|---|---|---|
| `complaints` | id, citizen_id, text, latitude, longitude, source, category, severity, priority_score, officer_name, sla_status, status, created_at | `/api/complaints` + submit page |
| `pipeline_runs` | id, message, total_complaints, total_clusters, city_health_score, city_health_status, top_risk_area, top_risk_reason, most_affected_category | Submit page |
| `officer_assignments` | complaint_id, pipeline_run_id, officer_id, officer_name, category, severity, sla_deadline_hours, assigned_at, status | Submit page |
| `system_summary` | pipeline_run_id, total_complaints, critical_issues, clusters, top_risk_area, city_health_score | Submit page |
| `execution_logs` | pipeline_run_id, log | Submit page |
| `clusters` | category, root_cause, confidence, created_at | Referenced in track page |

---

## 🚀 How to Run

### Backend (Agent Service)
```bash
cd agent-service
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

### Frontend (Civix-Pulse)
```bash
cd civixpulse
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` and the backend on `http://localhost:8000`.

---

## 📊 Key Algorithms

### Impact Matrix Priority Score
```
Score = (Severity_Weight × Zone_Multiplier × Affected_Population) / (1 + Hours × 0.1)
```
Where: P1=100, P2=70, P3=40, P4=10. School/Hospital=3×, Commercial=2.5×, Residential=2×.

### Cluster Velocity (Predictive Alerts)
```
Velocity = Σ(severity_weight_per_complaint) / time_span_hours
```
Where: P1=3.0×, P2=2.0×, P3=1.0×, P4=0.5×. Alerts trigger at velocity ≥2.0/hr (24hr), ≥1.0/hr (48hr).

### Impact Score Decay
```
new_score = base_score × min(1 + age_hours × 0.05, 5.0)
```
Score grows 5% per hour unresolved. Severity auto-escalates at 24h/48h/72h.

### City Health Score
```
score = max(0, 100 - (P1_count × 10 + cluster_count × 5))
```
Healthy (>80) → Moderate Risk (≥50) → Critical (<50).

### Haversine Distance (Geo-Clustering)
```
d = 2R × arcsin(√(sin²(Δlat/2) + cos(lat₁)·cos(lat₂)·sin²(Δlon/2)))
```
Used for both cluster detection (5km threshold) and cross-department correlation (2km threshold).
