# West Recovery Map – Frontend

React frontend for the **West Recovery Map** project.

This app provides:

- A **public, mobile-friendly form** so community members / leaders can submit reports.
- An **admin dashboard** (table + later map) for planners and responders, backed by the API.

---

## Tech Stack

- **Build tool:** Vite
- **Framework:** React
- **Language:** TypeScript
- **HTTP:** Fetch API (or Axios if you prefer)
- **Styling:** Plain CSS / utility classes (e.g., Tailwind) – examples use utility-style classes

---

## Getting Started

### 1. Prerequisites

- Node.js 18+ (Node 20 is fine)
- npm or yarn

### 2. Install dependencies

From the project root:

```bash
cd frontend
npm install
```

### 3. Environment variables

Create a `.env` file in `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

For production, update this to your deployed API base URL.

### 4. Run the dev server

```bash
npm run dev
```

Open the app:

- `http://localhost:5173` (default Vite port)

---

## Project Structure

Recommended structure:

```text
frontend/
  src/
    api/
      client.ts             # API base + helper functions
    components/
      ReportForm.tsx        # Public report form
      CommunityTable.tsx    # (optional) table for admin view
    pages/
      PublicReportPage.tsx  # Wraps the form
      AdminDashboardPage.tsx# Uses community summaries
    App.tsx                 # Simple view switch or Router
    main.tsx
  index.html
  package.json
  vite.config.ts
  README.md
```

---

## API Integration

The frontend talks to the Laravel backend via the `VITE_API_BASE_URL` env var.

### Base client

`src/api/client.ts` defines:

- `submitReport(payload: ReportPayload)`
  → calls `POST ${VITE_API_BASE_URL}/reports`

- `fetchCommunitySummaries(parish?: string)`
  → calls `GET ${VITE_API_BASE_URL}/admin/communities/summary`

**Example:**

```ts
// src/api/client.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export async function submitReport(payload: ReportPayload) {
  const res = await fetch(`${API_BASE_URL}/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || "Failed to submit report");
  }

  return res.json();
}
```

---

## Pages

### Public Report Page

- Component: `PublicReportPage`
- Contains `ReportForm` which:
  - Captures parish, community, landmark, access & utility status, etc.
  - Posts to `POST /api/reports`.
  - Shows a simple success/error message.

### Admin Dashboard Page

- Component: `AdminDashboardPage`
- Uses `fetchCommunitySummaries` to render:
  - A simple table of communities with:
    - Parish
    - Community name
    - Severity level (`low` / `moderate` / `severe`)
    - Flags (no water, no light, limited access)
    - # of severe houses
    - # of reports
- Later, you can add:
  - A map view (Leaflet/Mapbox/Google Maps).
  - Filters and sorting.
  - Drill-down into a single community.

---

## Running with the Backend

Assuming the main project layout:

```text
west-recovery-map/
  backend/
  frontend/
```

### Backend

```bash
cd backend
cp .env.example .env
# configure DB values
composer install
php artisan key:generate
php artisan migrate
php artisan serve   # http://localhost:8000
```

### Frontend

```bash
cd ../frontend
npm install
echo "VITE_API_BASE_URL=http://localhost:8000/api" > .env
npm run dev   # http://localhost:5173
```

The public form will now submit reports directly to the local API.

---

## Scripts

From the `frontend/` directory:

- `npm run dev` – start Vite dev server
- `npm run build` – build production assets
- `npm run preview` – preview the production build locally

---

## TODO / Next Steps

- Add a proper **router** (React Router) for:
  - `/` → Public report
  - `/admin` → Admin dashboard
- Add **auth** for admin:
  - Login page that stores a token
  - Use token in `fetchCommunitySummaries` requests
- Add a **map view** (Leaflet or similar) on the admin dashboard:
  - Colour markers by `severity`
- Improve UI/UX:
  - Validation messages
  - Mobile-friendly layout
  - Parish/community pickers with suggestions
