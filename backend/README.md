# West Recovery Map – API

Backend API for the **West Recovery Map**, a lightweight crisis-mapping tool to track community-level damage and needs in western Jamaica after the Category 5 hurricane.

This service:

- Accepts **public reports** about community status (access, water, light, housing damage, vulnerable groups, urgent needs).
- Aggregates reports per community.
- Exposes **admin endpoints** to power a dashboard (map + table) for planners and responders.

---

## Tech Stack

- **Framework:** Laravel 10+
- **Language:** PHP 8.2+
- **Database:** MySQL / MariaDB / PostgreSQL (any Laravel-supported SQL DB)
- **Auth (admin endpoints):** Laravel Sanctum (or your chosen guard)
- **API Format:** JSON (REST-style)

---

## Getting Started (Local Dev)

### 1. Prerequisites

- PHP 8.2+
- Composer
- A SQL database (MySQL / MariaDB / Postgres)
- Git

### 2. Install

From the **root** of the project:

```bash
git clone <REPO_URL> west-recovery-map
cd west-recovery-map/backend

cp .env.example .env
composer install
php artisan key:generate
```

### 3. Configure database (`.env`)

Open `backend/.env` and update the DB section to match your local setup, for example:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=west_recovery
DB_USERNAME=your_user
DB_PASSWORD=your_pass
```

### 4. Run migrations

```bash
php artisan migrate
```

This creates:

- `communities` – canonical list of communities (parish, name, location)
- `reports` – individual damage/needs reports for each community

### 5. Run the dev server

```bash
php artisan serve
```

Default API base URL:

- `http://localhost:8000/api`

---

## Data Model (MVP)

### `communities` table

Stores parish + community + optional coordinates:

- `id`
- `parish`
- `name`
- `nearest_landmark`
- `lat`, `lng` (nullable)
- `created_at`, `updated_at`

### `reports` table

Each submission from the public form:

- `community_id` → FK to `communities`
- Reporter info:
  - `reporter_name`, `reporter_contact`, `reporter_role`
- Access & utilities:
  - `road_access` (`clear`, `partial`, `foot_or_bike_only`, `blocked`)
  - `electricity_status` (`mostly_restored`, `partially_restored`, `none`, `unknown`)
  - `water_status` (`pipe`, `standpipe_tank`, `trucking_only`, `none`, `unknown`)
  - `signal_status` (`good`, `weak_unstable`, `none`)
- Housing:
  - `households_estimated`
  - `houses_no_damage`
  - `houses_roof_damaged`
  - `houses_roof_gone`
  - `houses_destroyed`
- Critical facilities:
  - `school_status`
  - `health_centre_status`
  - `police_status`
  - `church_centre_status`
  - `main_shop_status`
  - `gas_station_status`
- Vulnerable persons (booleans):
  - `has_elderly_alone`
  - `has_disabled_persons`
  - `has_pregnant_women`
  - `has_children_under_5`
  - `has_chronic_illness`
- Needs (booleans + text):
  - `needs_drinking_water`
  - `needs_food`
  - `needs_tarps_roofing`
  - `needs_building_materials`
  - `needs_medical_support`
  - `needs_transport_fuel`
  - `needs_debris_clearance`
  - `needs_counselling`
  - `needs_school_support`
  - `needs_cash_support`
  - `needs_other`
  - `needs_other_text`
- Free text & media:
  - `urgent_cases_text`
  - `other_details`
  - `photo_urls` (JSON array of URLs)
  - `source` (e.g. `web_form`, `field_app`)
- Timestamps:
  - `created_at`, `updated_at`

---

## API Overview

### Public Endpoints

#### `POST /api/reports`

Submit a new report for a community.

**Behavior:**

- Looks up an existing `community` using `parish + community_name`.
- If not found, creates the community automatically.
- Creates a `report` record linked to that community.
- Returns both the community and the created report.

**Sample Request (JSON):**

```json
{
  "parish": "Westmoreland",
  "community_name": "Little London",
  "nearest_landmark": "Little London Primary School",
  "lat": 18.2534,
  "lng": -78.2321,

  "reporter_name": "John Brown",
  "reporter_contact": "876-555-1234",
  "reporter_role": "resident",

  "road_access": "blocked",
  "electricity_status": "none",
  "water_status": "none",
  "signal_status": "weak_unstable",

  "households_estimated": 25,
  "houses_no_damage": 3,
  "houses_roof_damaged": 7,
  "houses_roof_gone": 10,
  "houses_destroyed": 5,

  "school_status": "damaged_open",
  "health_centre_status": "closed",
  "police_status": "functioning",
  "church_centre_status": "damaged_open",
  "main_shop_status": "closed",
  "gas_station_status": "none",

  "has_elderly_alone": true,
  "has_disabled_persons": true,
  "has_pregnant_women": false,
  "has_children_under_5": true,
  "has_chronic_illness": true,

  "needs_drinking_water": true,
  "needs_food": true,
  "needs_tarps_roofing": true,
  "needs_building_materials": true,
  "needs_medical_support": true,
  "needs_transport_fuel": false,
  "needs_debris_clearance": true,
  "needs_counselling": true,
  "needs_school_support": true,
  "needs_cash_support": true,
  "needs_other": true,
  "needs_other_text": "Help with school books and uniforms.",

  "urgent_cases_text": "Elderly man in wheelchair near the church, no roof, no medication.",
  "other_details": "Road is completely blocked by fallen trees and light poles.",
  "photo_urls": [
    "https://example.com/photos/little-london-1.jpg",
    "https://example.com/photos/little-london-2.jpg"
  ],
  "source": "web_form"
}
```

**Sample Response:**

```json
{
  "message": "Report submitted successfully.",
  "community": {
    "id": 1,
    "parish": "Westmoreland",
    "name": "Little London",
    "nearest_landmark": "Little London Primary School",
    "lat": "18.2534000",
    "lng": "-78.2321000",
    "created_at": "2025-11-08T16:00:00.000000Z",
    "updated_at": "2025-11-08T16:00:00.000000Z"
  },
  "report": {
    "id": 1,
    "community_id": 1,
    "road_access": "blocked",
    "water_status": "none",
    "electricity_status": "none",
    "signal_status": "weak_unstable",
    "households_estimated": 25,
    "houses_roof_gone": 10,
    "houses_destroyed": 5
    // ... other fields omitted for brevity
  }
}
```

---

### Admin Endpoints

Admin endpoints are under `/api/admin` and **should be protected** using `auth:sanctum` or your preferred guard.

> For initial prototyping, you can temporarily remove the middleware, but for any real deployment, lock this down.

#### `GET /api/admin/communities/summary`

Returns aggregated info per community, including a **severity score** and **severity level** (`low` / `moderate` / `severe`).

**Query params:**

- `parish` (optional) – filter by parish name, e.g. `?parish=Westmoreland`

**Sample Response:**

```json
[
  {
    "id": 1,
    "parish": "Westmoreland",
    "name": "Little London",
    "nearest_landmark": "Little London Primary School",
    "lat": "18.2534000",
    "lng": "-78.2321000",
    "report_count": 3,
    "severe_houses": 18,
    "no_water": 1,
    "no_light": 1,
    "limited_access": 1,
    "has_high_risk": 1,
    "last_report_at": "2025-11-08T16:30:00.000000Z",
    "severity_score": 9,
    "severity": "severe"
  }
]
```

Use this endpoint to power:

- Map markers (colour by `severity`)
- Table view (sort/filter by `severity`, `no_water`, `limited_access`, etc.)

---

## Routes (Summary)

In `routes/api.php`:

```php
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\Admin\CommunitySummaryController;
use Illuminate\Support\Facades\Route;

Route::post('/reports', [ReportController::class, 'store']);

Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/communities/summary', [CommunitySummaryController::class, 'index']);
});
```

---

## Repo Structure (Backend)

Inside the main project repo:

```text
west-recovery-map/
  backend/
    app/
    bootstrap/
    config/
    database/
      migrations/
      seeders/
    public/
    routes/
      api.php
    storage/
    tests/
    composer.json
    .env.example
    README.md
  frontend/
    ...
  README.md        # root project README
```

---

## Next Steps / TODOs

- Wire up **admin auth** (Sanctum or similar).
- Add endpoints for:
  - Listing raw reports per community.
  - Viewing a single community’s detailed history.
- Add basic **logging & monitoring** for production.
- Add **AI summaries** (optional):
  - Scheduled command that pulls aggregated data and calls an LLM to generate a human-readable daily situation report.
